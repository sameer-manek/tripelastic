const graphql = require('graphql')

const {
	GraphQLObjectType, 
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLID,
	GraphQLNonNull,
	GraphQLUnionType
} = graphql

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

module.exports = TransportType