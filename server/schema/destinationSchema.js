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

const DestinationType = new GraphQLObjectType({
	name: "Destination",
	fields: () => ({
		id: { type: GraphQLID },
		address: { type: new GraphQLNonNull(GraphQLString) },
		city: { type: new GraphQLNonNull(GraphQLString) },
		country: { type: new GraphQLNonNull(GraphQLString) },
		pincode: { type: GraphQLString },
		location: { type: GraphQLString },
	})
})

module.exports = DestinationType