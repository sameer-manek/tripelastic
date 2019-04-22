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
		id: { type: GraphQLID },
		type: { type: new GraphQLNonNull(GraphQLString) },
		pickup: { type: new GraphQLNonNull(GraphQLString) },
		p_address: { type: GraphQLString },
		drop: { type: new GraphQLNonNull(GraphQLString) },
		d_address: { type: GraphQLString },
		vehicleId: { type: GraphQLString },
		bookingId: { type: GraphQLString },
		seat: { type: GraphQLString },
	})
})

module.exports = TransportType