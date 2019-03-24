const graphql = require('graphql')
const _ = require('lodash')
const mailer = require('nodemailer')

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

const { EntityType, ContainerType } = require('./containerSchema')

const HotelType = require('./hotelSchema')

const TransportType = require('./transportSchema')

const DestinationType = require('./destinationSchema')
// usefull functions

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
						token: jwt.sign({ id: user.id }, privateKey, {}),
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

		verifyEmail: {
			type: ActionType,
			args: { token: { type: GraphQLString } },
			resolve: async function (parent, args) {
				let data = jwt.verify(args.token, privateKey)
				if(data) {
					let user = await User.findById(data.id)
					if(user) {
						let email = await user.email
						console.log(email)
						let token = jwt.sign({ email }, privateKey, { expiresIn: '48h' })
						// send email
						let mailOptions = {
							from: "tripelastic@gmail.com",
							to: email,
							subject: "[DO NOT REPLY] verify your Email",
							html: `<h1>Hey,</h1>
									<p>Thanks being a part of tripelastic community. Inorder to use our services, we require you to click on the link below and verify this email.</p>
									<br />
									<a href="http://localhost:4000/verification?type=email&token=`+ token +`>click here</a>
									<br />
									<p>Note that you must do this in next 48 hours, else you will have to generate new link. which can be easily done from contact section of your profile.</p>`
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
					html: `<h1>Hey,</h1>
							<p>Thanks being a part of tripelastic community. Inorder to use our services, we require you to <a href="http://localhost:4000/verification?type=email&token=`+ token +`>click here</a> and verify this email.</p>
							<p>Note that you must do this in next 48 hours, else you will have to generate new link. which can be easily done from contact section of your profile.</p>`
				}

				let commit = user.save()

				await transporter.sendMail(mailOptions, (err, info) => {
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
				let container = await Container.findById(args.containerId).catch(err => {
					return {
						success: false,
						message: "container not found"
					}
				})
				if(container && container.userId.toString() === data.id) {
					container.remove()
					return {
					success: true,
					message: "container has been deleted"
				}
				}
				return {
					success: false,
					message: "container could not be deleted"
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
				detail: { type: new GraphQLNonNull(GraphQLString) },
				start: { type: GraphQLString },
				end: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = jwt.verify(token, privateKey)
				let userId = data.id
				let container = await Container.findById(args.containerId)
				if (container && container.userId.toString() === userId) {
					// register the entity
					let entity = new Entity({
						name: args.name,
						containerId: args.containerId,
						type: args.type,
						detail: args.detail,
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
				pincode: { type: GraphQLInt },
				location: { type: GraphQLString },
				room: { type: GraphQLString },
				entity: { type: GraphQLID }
			},
			resolve: async (parent, args) => {
				let data = await verifyToken(args.token)
				let entity = await Entity.findById(args.entity)
				if (!data.error && entity) {
					// register the hotel and put that into the entity
					let hotel = new Hotel({
						userId: data.id,
						address: args.address,
						city: args.city,
						country: args.country,
						pincode: args.pincode,
						location: args.location,
						room: args.room
					})

					let store = hotel.save()

					entity.detail = store.id
					await entity.save()

					return store
				}
				return new Error("could not authenticate the user")
			}
		},

		createTransport: {
			type: TransportType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				type: { type: new GraphQLNonNull(GraphQLString) },
				pickupAddress: { type: new GraphQLNonNull(GraphQLString) },
				pickupCity: { type: new GraphQLNonNull(GraphQLString) },
				pickupCountry: { type: new GraphQLNonNull(GraphQLString) },
				pickupPincode: { type: GraphQLInt },
				pickupLocation: { type: GraphQLString },
				dropAddress: { type: new GraphQLNonNull(GraphQLString) },
				dropCity: { type: new GraphQLNonNull(GraphQLString) },
				dropCountry: { type: new GraphQLNonNull(GraphQLString) },
				dropPincode: { type: GraphQLInt },
				dropLocation: { type: GraphQLString },
				seat: { type: GraphQLString },
				entity: { type: GraphQLID }
			},
			resolve: async (parent, args) => {
				let data = await verifyToken(args.token)
				let entity = await Entity.findById(args.entity)
				if (!data.error && entity) {
					// register the Transport and put that into the entity
					let transport = new Transport({
						type: args.type,
						userId: data.id,
						pickupAddress: args.pickupAddress,
						pickupCity: args.pickupCity,
						pickupCountry: args.pickupCountry,
						pickupPincode: args.pickupPincode,
						pickupLocation: args.pickupLocation,
						dropAddress: args.dropAddress,
						dropCity: args.dropCity,
						dropCountry: args.dropCountry,
						dropPincode: args.dropPincode,
						dropLocation: args.dropLocation,
						seat: args.seat
					})

					let store = transport.save()

					entity.detail = store.id
					await entity.save()

					return store
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
				pincode: { type: GraphQLInt },
				location: { type: GraphQLString },
				entity: { type: GraphQLID }
			},
			resolve: async (parent, args) => {
				let data = await verifyToken(args.token)
				let entity = await Entity.findById(args.entity)
				if (!data.error && entity) {
					// register the destination and put that into the entity
					let destination = new Destination({
						address: args.address,
						userId: data.id,
						city: args.city,
						country: args.country,
						pincode: args.pincode,
						location: args.location,
						room: args.room
					})

					let store = destination.save()

					entity.detail = store.id
					await entity.save()

					return store
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
				if (data.error) {
					return {
						success: false,
						message: "Invalid token"
					}
				}
				let user = await User.findById(data.id)
				let entity = await Entity.findById(args.id)
				if (user && entity) {
					let container = await Container.findById(entity.containerId)
					if (container.userId === user.id) {
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
					message: "Access denied"
				}
			}
		},

		updateHotel: {
			type: ActionType,
			args: {
				token: { type: new GraphQLNonNull(GraphQLString) },
				id: { type: new GraphQLNonNull(GraphQLID) },
				address: { type: new GraphQLNonNull(GraphQLString) },
				city: { type: new GraphQLNonNull(GraphQLString) },
				country: { type: new GraphQLNonNull(GraphQLString) },
				pincode: { type: GraphQLInt },
				location: { type: GraphQLString },
				room: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if(data.error) {
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
				pickupAddress: { type: GraphQLString },
				pickupCity: { type: GraphQLString },
				pickupCountry: { type: GraphQLString },
				pickupPincode: { type: GraphQLInt },
				pickupLocation: { type: GraphQLString },
				dropAddress: { type: GraphQLString },
				dropCity: { type: GraphQLString },
				dropCountry: { type: GraphQLString },
				dropPincode: { type: GraphQLInt },
				dropLocation: { type: GraphQLString },
				seat: { type: GraphQLString },
			},
			resolve: async function (parent, args) {
				let data = verifyToken(args.token)
				if (data.error) {
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
					transport.pickupAddress = args.pickupAddress ? args.pickupAddress : transport.pickupAddress
					transport.pickupCity = args.pickupCity ? args.pickupCity : transport.pickupCity
					transport.pickupCountry = args.pickupCountry ? args.pickupCountry : transport.pickupCountry
					transport.pickupPincode = args.pickupPincode ? args.pickupPincode : transport.pickupPincode
					transport.pickupLocation = args.pickupLocation ? args.pickupLocation : transport.pickupLocation
					transport.dropAddress = args.dropAddress ? args.dropAddress : transport.dropAddress
					transport.dropCity = args.dropCity ? args.dropCity : transport.dropCity
					transport.dropCountry = args.dropCountry ? args.dropCountry : transport.dropCountry
					transport.dropPincode = args.dropPincode ? args.dropPincode : transport.dropPincode
					transport.dropLocation = args.dropLocation ? args.dropLocation : transport.dropLocation
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
				pincode: { type: GraphQLInt },
				location: { type: GraphQLString }
			},
			resolve: async function(parent, args) {
				let data = verifyToken(args.token)
				if(data.error) {
					return {
						success: false,
						message: "Invalid Token"
					}
				}

				let destination = await Destination.findById(args.id)
				let user = await User.findById(data.id)

				if(user && Destination && Destination.userId.toString() === data.id) {
					// update Destination
					destination.address = args.address ? args.address : destination.address
					destination.city = args.city ? args.city : destination.city
					destination.country = args.country ? args.country : destination.country
					destination.pincode = args.pincode ? args.pincode : destination.pincode
					destination.location = args.location ? args.location : destination.location

					await destination.save()
					return {
						success: true,
						message: "hotel updated successfully!"
					}
				}
			}
		},

		deleteEntity: {
			type: ActionType,
		},

		deleteHotel: {
			type: ActionType,
		},

		deleteTransport: {
			type: ActionType,
		},

		deleteDestination: {
			type: ActionType,
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})