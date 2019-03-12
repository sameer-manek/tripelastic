const graphql = require('graphql')
const _ = require('lodash')

const jwt = require('jsonwebtoken')
const { privateKey } = require("../config")

const User = require('../models/user')
const Container = require('../models/container')

const { 
	GraphQLObjectType, 
	GraphQLString,
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql

const UserType = require('./userSchema')

const ActiveUserType = require('./activeUserSchema')

const ContainerType = require('./containerSchema')

const ActionType = new GraphQLObjectType({
	name: 'Action',
	fields: () => ({
		success: { type: GraphQLBoolean },
		message: { type: GraphQLString }
	})
})


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {

		// user related queries

		// login user : generate and pass security token
		login: {
			type: ActiveUserType,
			args: { email: { type: new GraphQLNonNull(GraphQLString) }, password: { type: new GraphQLNonNull(GraphQLString) } },
			resolve: async function(parent, args) {
				let user =  await User.findOne({ email: args.email, password: args.password})

				if(user) {
					return {
						success: true,
						message: "found user",
						token: jwt.sign({ id: user.id }, privateKey, { expiresIn: '6h' }),
						username: user.username
					}
				} else {
					return{
						success: false,
						message: "user not found",
						token: null,
						username: null
					}
				}
			}

		},
		
		// fetch details of logged in user
		me: {
			type: UserType,
			args: { token: { type: GraphQLString } },
			resolve: function(parent, args) {
				let data = jwt.verify(args.token, privateKey)
				if(data) {
					let id = data.id
					return User.findById(data.id)
				}
				return null
			}
		},

		// fetch all containers of logged in user
		myContainers: {
			type: GraphQLList(ContainerType),
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: function (parent, args) {
				let data = jwt.verify(args.token, privateKey)
				if(data) {
					let id = data.id
					let containers = Container.find({userId: id})
					return containers
				}
				return null
			}
		},

		// fetch specific container of logged in user
		myContainer: {
			type: ContainerType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function (parent, args) {
				let data = jwt.verify(args.token, privateKey)
				let cont = await Container.findById(args.id)
				
				if(data && data.id === cont.userId.toString()) {
					return cont
				}
				console.log("user not authentic")
				return null
			}
		}
	}
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
	
		// user related mutations

		addUser: {
			type: UserType,
			args: {
				username: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: function(parent, args) {
				let user = new User({
					username: args.username,
					email: args.email,
					password: args.password
				})

				return user.save()
			}
		},

		editUser: {
			type: UserType,
			args: {
				token: {type: new GraphQLNonNull(GraphQLString)},
				firstname: { type: GraphQLString },
				lastname: { type: GraphQLString },
				email: { type: GraphQLString },
			},
			resolve: async function(parent, args) {
				let data = jwt.verify(args.token, privateKey)
				if(data){
					var user = await User.findById(data.id)
					if (user) {
						user.firstname = args.firstname ? args.firstname : user.firstname
						user.lastname  = args.firstname ? args.lastname : user.lastname
						user.email = args.email ? args.email : user.email
						return user.save()
					}
				}
				
				return null
			}
		},

		changePass: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				currentPass: { type: new GraphQLNonNull(GraphQLString) },
				newPass: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async function(parent, args){
				let data = jwt.verify(args.token, privateKey)
				if(data) {
					var user = await User.findById(data.id)
					if(user) {
						if (user.password === args.currentPass) {
							user.password = args.newPass
							user.save()
							return {
								success: true,
								message: "password has been changed"
							}
						} else {
							return {
								success: false,
								message: "could not authenticate the user"
							}
						}
					}
				}
				return {
					success: false,
					message: "could not authenticate the user!"
				}
			}
		},

		// trips and containers

		createContainer: {
			type: ContainerType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				parentContainer: { type: GraphQLID },
				detail: { type: GraphQLString },
				start: { type: GraphQLString },
				end: { type: GraphQLString },
				category: { type:GraphQLString }
			},
			resolve: function (parent, args) {
				let data = jwt.verify(args.token, privateKey)
				let today = new Date()
				let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
				let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
				let dateTime = date+' '+time

				if (data) {
					let id = data.id
					let newContainer = new Container({
						name: args.name,
						userId: id,
						parentContainer: args.parentContainer ? args.parentContainer : null,
						detail: args.detail,
						start: args.start ? args.start : null,
						end: args.end ? args.end : null,
						category: args.category ? args.category : "trip",
						createdAt: dateTime
					})
					return newContainer.save()
				}
				return null
			}
		},

		updateContainer: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				containerId: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: GraphQLString },
				detail: { type: GraphQLString },
				start: { type: GraphQLString },
				end: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = jwt.verify(args.token, privateKey)
				let container = await Container.findById(args.containerId)
				if (data && data.id === container.userId.toString()) {
					let id = data.id
					console.log(container.name)
					container.name = args.name ? args.name : container.name
					container.detail = args.detail ? args.detail : container.detail
					container.start = args.start ? args.start : container.start
					container.end = args.end ? args.end : container.end
					container.save()
					return {
						success: true,
						message: "container has been updated"
					}
				}
				return {
					success: false,
					message: "could not authenticate"
				}
			}
		},

		deleteContainer: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				containerId: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(parent, args) {
				let data = jwt.verify(token, privateKey)
				if (!data) {
					return {
						success: false,
						message: "could not authenticate user"
					}
				}
				await Container.deleteOne({ id: args.containerId }, function (err) {
					console.log(err)
					return {
						success: false,
						message: "some error occurred, please report admin"
					}
				})
				return {
					success: true,
					message: "container has been deleted"
				}
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})