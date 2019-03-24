const graphql = require('graphql')
const _ = require('lodash')

const UserType = require('./userSchema')
const ContainerType = require('./containerSchema')

const Container = require('../models/container')
const Entity = require('../models/entity')
const Hotel = require('../models/hotel')
const Destination = require('../models/destination')
const Transport = require('../models/transport')

const {
	GraphQLObjectType, 
	GraphQLString,
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLUnionType
} = graphql

const EntityType = new GraphQLObjectType({
	name: "Entity",
	fields: () => ({
		name: { type: new GraphQLNonNull(GraphQLString) },
		containerId: { 
			type: GraphQLID,
			// resolve: (parent, args) => {
			// 	return Container.findById(parent.containerId)
			// }
		},
		type: { type: new GraphQLNonNull(GraphQLString) },
		detail: { type: new GraphQLNonNull(GraphQLString) },
		start: { type: GraphQLString },
		end: { type: GraphQLString }
	})
})

const HotelType = new GraphQLObjectType({
	name: "Hotel",
	fields: () => ({
		address: { type: new GraphQLNonNull(GraphQLString) },
		city: { type: new GraphQLNonNull(GraphQLString) },
		country: { type: new GraphQLNonNull(GraphQLString) },
		pincode: { type: GraphQLInt },
		location: { type: GraphQLString },
		room: { type: GraphQLString },
	})
})

const TransportType = new GraphQLObjectType({
	name: "Tranport",
	fields: () => ({
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
	})
})

const DestinationType = new GraphQLObjectType({
	name: "Destination",
	fields: () => ({
		address: { type: GraphQLString },
		city: { type: new GraphQLNonNull(GraphQLString) },
		country: { type: new GraphQLNonNull(GraphQLString) },
		pincode: { type: GraphQLInt },
		location: { type: GraphQLString }
	})
})

module.exports = {
	DestinationType,
	TransportType,
	HotelType,
	EntityType
}