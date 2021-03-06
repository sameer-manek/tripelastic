const graphql = require('graphql')
const _ = require('lodash')
const mailer = require('nodemailer')

const mongoose = require('mongoose')

// mailer configuration

const transporter = mailer.createTransport({
	service: "gmail",
	auth: {
		user: "tripelastic@gmail.com",
		pass: "_Axiom_9809"
	}
})

const jwt = require('jsonwebtoken')
const { privateKey } = require("../config")

const User = require('../models/user')
const Container = require('../models/container')
const Entity = require('../models/entity')
const Hotel = require('../models/hotel')
const Transport = require('../models/transport')
const Destination = require('../models/destination')
const Post = require("../models/post")
const Comment = require("../models/comment")
const Vote = require("../models/vote")

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
} = graphql

const UserType = require('./userSchema')

const ActiveUserType = require('./activeUserSchema')

const { 
	EntityType, 
	ContainerType 
} = require('./containerSchema')

const HotelType = require('./hotelSchema')

const TransportType = require('./transportSchema')

const DestinationType = require('./destinationSchema')

const {
	PostType,
	CommentType,
	VoteType
} = require ('./forumSchema')

// utilities

const createToken = function (data, expiresIn) {
	return jwt.sign(data, privateKey, { expiresIn })
}

const verifyToken = function (token) {
	return jwt.verify(token, privateKey)
}

// end utilities

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

		checkToken: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: function(parent, args) {
				let token = args.token
				let data = verifyToken(token)

				if(data) {
					return {
						success: true,
						message: "token is valid"
					}
				}

				return {
					success: false,
					message: "token ain't valid"
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

		verifyEmail: {
			type: ActionType,
			args: { 
				token: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLString }
			},
			resolve: async function (parent, args) {
				let data = jwt.verify(args.token, privateKey)
				if(data) {
					let user = await User.findById(data.id)
					if(user) {
						let email = args.email ? args.email : await user.email
						console.log(email)
						let token = jwt.sign({ email }, privateKey, { expiresIn: '48h' })
						// send email
						let mailOptions = {
							from: "tripelastic@gmail.com",
							to: email,
							subject: "[DO NOT REPLY] verify your Email",
							html: "<link rel=\"stylesheet\" href=\"https://cdn.linearicons.com/free/1.0.0/icon-font.min.css\">\
							<h1 class=\"title\">Hey,</h1>\
							<p>Thanks being a part of tripelastic community. Inorder to use our services, we require you to <a class=\"button is-link\" href=\"http://localhost:4000/verification?type=email&token="+ token +">click here</a> and verify this email.</p>\
							<p>Note that you must do this in next 48 hours, else you will have to generate new link. which can be easily done from contact section of your profile.</p>"
						}

						await transporter.sendMail(mailOptions, (err, info) => {
							if (err) {
								console.log(err)
							} else {
								console.log(info)
							}
						})

						return {
							success: true,
							message: "verification link has been sent to your email. The link will be valid until 48 hours"
						}
					}
					return {
						success: false,
						message: "user not found"
					}
				}
				return {
					success: false,
					message: "cannot authenticate"
				}
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
		},

		fetchHotel: {
			type: HotelType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(parent, args) {
				return await Hotel.findById(args.id)
			}
		},

		fetchTransport: {
			type: TransportType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function (parent, args) {
				return await Transport.findById(args.id)
			}
		},

		fetchDestination: {
			type: DestinationType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function (parent, args) {
				return await Destination.findById(args.id)
			}
		},

		myPosts: {
			type: GraphQLList(PostType),
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return new Error ("invalid token")
				}
				let posts = await Post.find({ userId: data.id })
				await posts.map(post => post.editable = true)
				return posts
			}
		},

		allPosts: {
			type: GraphQLList(PostType),
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return new Error ("invalid token")
				}
				let posts = await Post.find({ })
				await posts.map(post => post.editable = post.userId.toString() === data.id ? true : false)
				return posts
			}
		},
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
			resolve: async function(parent, args) {
				let user = new User({
					username: args.username,
					email: args.email,
					password: args.password
				})

				let token = await jwt.sign({ email: args.email }, privateKey, { expiresIn: '48h' })

				// send email
				let mailOptions = {
					from: "tripelastic@gmail.com",
					to: args.email,
					subject: "[DO NOT REPLY] verify your Email",
					html: `<link rel="stylesheet" href="https://cdn.linearicons.com/free/1.0.0/icon-font.min.css">
							<h1 class="title">Hey,</h1>
							<p>Thanks being a part of tripelastic community. Inorder to use our services, we require you to <a class="button is-link" href="http://localhost:4000/verification?type=email&token=`+ token +`>click here</a> and verify this email.</p>
							<p>Note that you must do this in next 48 hours, else you will have to generate new link. which can be easily done from contact section of your profile.</p>`
				}

				let commit = user.save()

				await transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.log(error)
					} else {
						console.log(info)
					}
				})

				return commit
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
						parentContainer: args.parentContainer === "null" ? null : args.parentContainer,
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
				let data = jwt.verify(args.token, privateKey)
				if (!data) {
					return {
						success: false,
						message: "could not authenticate user"
					}
				}
				let container = await Container.findById(args.containerId)
				if (!container) {
					return {
						success: false,
						message: "cannot find the container"
					}
				} else {
					let entities = await Entity.find({ containerId: container.id })
					entities.map(entity => entity.remove())

					await container.remove()

					return {
						success: true,
						message: "container has been deleted"
					}
				}
			}
		},

		duplicateContainer: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				containerId: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				detail: { type: GraphQLString },
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)

				if(!data) {
					return new Error("cannot authenticate user")
				}

				await Container.findById(args.containerId).exec(
					function (err, doc) {
						doc._id = mongoose.Types.ObjectId()
						doc.name = args.name
						doc.detail = args.detail
						doc.isNew = true,
						doc.save().then(async data => {
							await Entity.find({ containerId: args.containerId }).exec(
								async function (err, docs) {
									docs.map(doc => {
										doc._id = mongoose.Types.ObjectId()
										doc.containerId = data._id
										doc.isNew = true,
										doc.save()
									})
								}
							)
						})
					}
				)

				return {
					success: true,
					message: "done"
				}
			}
		},

		createEntity: {
			type: EntityType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				containerId: { type: new GraphQLNonNull(GraphQLID) },
				type: { type: new GraphQLNonNull(GraphQLString) },
				detail: { type: GraphQLString },
				start: { type: GraphQLString },
				end: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = jwt.verify(args.token, privateKey)
				let userId = data.id
				let container = await Container.findById(args.containerId)
				if (container && container.userId.toString() === userId) {
					// register the entity
					let entity = new Entity({
						name: args.name,
						containerId: args.containerId,
						type: args.type,
						detail: args.detail === "null" ? null : args.detail,
						start: args.start ? args.start : null,
						end: args.end ? args.end : null
					})

					return entity.save()
				}
				throw new Error('Could not find the container or you are not authorized!')
			}
		},

		createHotel: {
			type: HotelType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				address: { type: new GraphQLNonNull(GraphQLString) },
				city: { type: new GraphQLNonNull(GraphQLString) },
				country: { type: new GraphQLNonNull(GraphQLString) },
				pincode: { type: GraphQLString },
				location: { type: GraphQLString },
				room: { type: GraphQLString },
			},
			resolve: async (parent, args) => {
				let data = await verifyToken(args.token)
				if (data ) {
					// register the hotel and put that into the entity
					let hotel = new Hotel({
						userId: data.id,
						address: args.address,
						city: args.city,
						country: args.country,
						pincode: args.pincode === "null" ? null : args.pincode,
						location: args.location,
						room: args.room
					})

					return hotel.save()
				}
				return new Error("could not authenticate the user")
			}
		},

		createTransport: {
			type: TransportType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				type: { type: new GraphQLNonNull(GraphQLString) },
				pickup: { type: new GraphQLNonNull(GraphQLString) },
				p_address: { type: GraphQLString },
				drop: { type: new GraphQLNonNull(GraphQLString) },
				d_address: { type: GraphQLString },
				seat: { type: GraphQLString },
				vehicleId: { type: GraphQLString },
				bookingId: { type: GraphQLString }
			},
			resolve: async (parent, args) => {
				let data = await verifyToken(args.token)
				if (data) {
					// register the Transport and put that into the entity
					let transport = new Transport({
						type: args.type,
						userId: data.id,
						pickup: args.pickup,
						drop: args.drop,
						p_address: args.p_address,
						d_address: args.d_address,
						seat: args.seat,
						vehicleId: args.vehicleId,
						bookingId: args.bookingId
					})

					return await transport.save()
				}
				return new Error("could not authenticate the user")
			}
		},

		createDestination: {
			type: DestinationType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				address: { type: new GraphQLNonNull(GraphQLString) },
				city: { type: new GraphQLNonNull(GraphQLString) },
				country: { type: new GraphQLNonNull(GraphQLString) },
				pincode: { type: GraphQLString },
				location: { type: GraphQLString },
			},
			resolve: async (parent, args) => {
				let data = await verifyToken(args.token)
				if (data) {
					// register the destination and put that into the entity
					let destination = new Destination({
						address: args.address,
						userId: data.id,
						city: args.city,
						country: args.country,
						pincode: args.pincode === "null" ? null : args.pincode,
						location: args.location,
						room: args.room
					}) 

					return await destination.save()
				}
				return new Error("could not authenticate the user")
			}
		},

		updateEntity: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				detail: { type: GraphQLString },
				start: { type: GraphQLString },
				end: { type: GraphQLString },
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid token"
					}
				}
				let user = await User.findById(data.id)
				let entity = await Entity.findById(args.id)
				if (user && entity) {
					let container = await Container.findById(entity.containerId)
					if (container.userId.toString() === user.id.toString()) {
						// change the entity details
						entity.name = args.name ? args.name : entity.name
						entity.detail = args.detail ? args.detail : entity.detail
						entity.start = args.start ? args.start : entity.start
						entity.end = args.end ? args.end : entity.end

						await entity.save()
						return {
							success: true,
							message: "Entity has been updated successfully!"
						}
					}
				}
				return {
					success: false,
					message: entity.name
				}
			}
		},

		updateHotel: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				address: { type: GraphQLString },
				city: { type: GraphQLString },
				country: { type: GraphQLString },
				pincode: { type: GraphQLString },
				location: { type: GraphQLString },
				room: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if(!data) {
					return {
						success: false,
						message: "Invalid Token"
					}
				}

				let hotel = await Hotel.findById(args.id)
				let user = await User.findById(data.id)

				if(user && hotel && hotel.userId.toString() === data.id) {
					// update hotel
					hotel.address = args.address ? args.address : hotel.address
					hotel.city = args.city ? args.city : hotel.city
					hotel.country = args.country ? args.country : hotel.country
					hotel.pincode = args.pincode ? args.pincode : hotel.pincode
					hotel.location = args.location ? args.location : hotel.location
					hotel.room = args.room ? args.room : hotel.room

					await hotel.save()
					return {
						success: true,
						message: "hotel updated successfully!"
					}
				}

				return {
					success: false,
					message: "Access denied!"
				}
			}
		},

		updateTransport: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				type: { type: new GraphQLNonNull(GraphQLString) },
				pickup: { type: new GraphQLNonNull(GraphQLString) },
				p_address: { type: GraphQLString },
				drop: { type: new GraphQLNonNull(GraphQLString) },
				d_address: { type: GraphQLString },
				vehicleId: { type: GraphQLString },
				bookingId: { type: GraphQLString },
				seat: { type: GraphQLString },
			},
			resolve: async function (parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid Token!"
					}
				}

				let user = await User.findById(data.id)
				let transport = Transport.findById(id)

				if(user && transport && transport.userId === user.id) {
					// update transport
					transport.type = args.type ? args.type : transport.type
					transport.pickup = args.pickup ? args.pickup : transport.pickup
					transport.drop = args.drop ? args.drop : transport.drop
					transport.p_address = args.p_address ? args.p_address : transport.p_address
					transport.d_address = args.d_address ? args.d_address : transport.d_address
					transport.vehicleId = args.vehicleId ? args.vehicleId : transport.vehicleId
					transport.bookingId = args.bookingId ? args.bookingId : transport.bookingId
					transport.seat = args.seat ? args.seat : transport.seat

					await transport.save()
					return {
						success: true,
						message: "Entity has been updated"
					}
				}

				return {
					success: false,
					message: "Access denied"
				}
			}
		},

		updateDestination: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				address: { type: new GraphQLNonNull(GraphQLString) },
				city: { type: new GraphQLNonNull(GraphQLString) },
				country: { type: new GraphQLNonNull(GraphQLString) },
				pincode: { type: GraphQLString },
				location: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if(!data) {
					return {
						success: false,
						message: "Invalid Token"
					}
				}

				let destination = await Destination.findById(args.id)
				let user = await User.findById(data.id)

				if(user && Destination && destination.userId.toString() === data.id) {
					// update Destination
					destination.address = args.address ? args.address : destination.address
					destination.city = args.city ? args.city : destination.city
					destination.country = args.country ? args.country : destination.country
					destination.pincode = args.pincode ? args.pincode : destination.pincode
					destination.location = args.location ? args.location : destination.location

					await destination.save()
					return {
						success: true,
						message: "destination updated successfully!"
					}
				}
			}
		},

		deleteEntity: {
			type: ActionType,
			args: { 
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if(!data) {
					return {
						success: false,
						message: "Invalid token"
					}
				}
			
				let user = await User.findById(data.id)
				let entity = await Entity.findById(args.id)
				let container = entity ? await Container.findById(entity.containerId.toString()) : null
				if(user && entity && container && container.userId.toString() === user.id.toString()) {
					await entity.remove()
					return {
						success: true,
						message: "entity has been removed"
					}
				}

				return {
					success: false,
					message: "access denied!"
				}
			}
		},

		// forum operations

		createPost: {
			type: PostType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) },
				containerId: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return new Error ('Invalid Token!')
				}
				let user = await User.findById(data.id)
				let container = args.containerId ? ( await Container.findById(args.containerId) ? args.containerId : null ) : null
				date = new Date
				if (user) {
					let post = new Post({
						title: args.title,
						content: args.content,
						userId: user.id.toString(),
						containerId: container,
						createdAt: date,
						updatedAt: date
					})

					let newPost = await post.save()
					newPost.editable = true
					return newPost
				}

				return new Error ("access denied")
			}
		},

		updatePost: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				title: { type: GraphQLString },
				content: { type: GraphQLString },
				containerId: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid token!"
					}
				}
				let user = await User.findById(data.id)
				let post = await Post.findById(args.id)
				let container = args.containerId ? ( await Container.findById(args.containerId) ? args.containerId : post.containerId ) : post.containerId

				if(user && post && post.userId.toString() === user.id.toString()) {
					post.title = args.title ? args.title : post.title
					post.content = args.content ? args.content : post.content
					post.containerId = container
					post.update = new Date()

					await post.save()
					return {
						success: true,
						message: "updated the post successfully"
					}
				}

				return {
					success: false,
					message: "Access Denied!"
				}
			}
		},

		deletePost: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid token!"
					}
				}
				let user = await User.findById(data.id)
				let post = await Post.findById(args.id)
				if(user && post && post.userId.toString() === user.id.toString()) {
					// delete comments

					let comments = await Comment.find({ postId: post.id.toString() })
					await comments.map(comment => comment.remove())
					await post.remove()
					return {
						success: true,
						message: "updated the post successfully"
					}
				}
				return {
					success: false,
					message: "Access Denied!"
				}
			}
		},

		createComment: {
			type: CommentType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) },
				postId: { type: new GraphQLNonNull(GraphQLID) },
				parentId: { type: GraphQLID }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid token!"
					}
				}
				let user = await User.findById(data.id)
				let post = await Post.findById(args.postId)
				let parentId = args.parentId ? ( await Comment.findById(args.parentId) ? args.parentId : null ) : null
				let date = new Date

				if (user && post) {
					let comment = new Comment({
						content: args.content,
						userId: user.id,
						postId: post._id,
						parentId: parentId,
						votes: 0,
						createdAt: date,
						updatedAt: date
					})

					let newComment = await comment.save()
					comment.editable = true

					return comment
				}

				return new Error ("Access Denied!")
			}
		},

		updateComment: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				content: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid token!"
					}
				}
				let user = await User.findById(data.id)
				let comment = await Comment.findById(args.id)

				if (user && comment && user.id.toString() === comment.userId.toString()) {
					comment.content = args.content
					await comment.save()
					return {
						success: true,
						message: "comment has been updated"
					}
				}

				return {
					success: false,
					message: "Access Denied!"				
				}
			}
		},

		deleteComment: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid token!"
					}
				}
				let user = await User.findById(data.id)
				let comment = await Comment.findById(args.id)

				if (user && comment && user.id.toString() === comment.userId.toString()) {
					let comments = await Comment.find({ parentId: comment.id })
					await comments.map(child => {child.remove()})
					await comment.remove()

					return {
						success: true,
						messahe: "comment is deleted"
					}
				}

				return {
					success: false,
					message: "Access Denied!"			
				}
			}
		},

		upvote: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid Token"
					}
				}

				let user = await User.findById(data.id)
				let post = await Post.findById(args.id)

				if(user && post) {
					let vote = await Vote.findOne({ userId: user.id, postId: post.id })
					if(vote) {
						let value = vote.value
						switch(value) {
							// if current state = downvoted
							case -1:
								post.values += 2
								vote.value = 1
							break
				
							// if current state = null
							case 0:
								post.values += 1
								vote.value = 1
							break

							// if current state = upvoted
							case 1:
								post.values -= 1
								vote.value = 0
							break
						}

						await post.save()
						await vote.save()

						return {
							success: true,
							message: "updated"
						}
					}

					vote = new Vote({
						userId: user.id,
						postId: post.id,
						value: 1
					})

					post.votes += 1
					await post.save()
					await vote.save()

					return {
						success: true,
						message: ""
					}
				}

				return {
					success: false,
					message: "Access Denied!"
				}
			}
		},

		downvote: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if (!data) {
					return {
						success: false,
						message: "Invalid Token"
					}
				}

				let user = await User.findById(data.id)
				let post = await Post.findById(args.id)

				if(user && post) {
					let vote = await Vote.findOne({ userId: user.id, postId: post.id })
					if(vote) {
						let value = vote.value
						switch(value) {
							// if current state = downvoted
							case -1:
								post.values += 1
								vote.value = 0
							break

							// if current state = null
							case 0:
								post.values -= 1
								vote.value = -1
							break

							// if current state = upvoted
							case 1:
								post.values -= 2
								vote.value = -1
							break
						}

						await post.save()
						await vote.save()

						return {
							success: true,
							message: "updated"
						}
					}

					vote = new Vote({
						userId: user.id,
						postId: post.id,
						value: -1
					})

					post.votes -= 1

					await post.save()
					await vote.save()

					return {
						success: true,
						message: ""
					}
				}

				return {
					success: false,
					message: "Access Denied!"
				}
		},
	}}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})