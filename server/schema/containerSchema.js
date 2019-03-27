const graphql = require('graphql')
const _ = require('lodash')

const UserType = require('./userSchema')

const User = require('../models/user')
const Container = require('../models/container')
const Entity = require('../models/entity')

const { 
	GraphQLObjectType, 
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql

const EntityType = new GraphQLObjectType ({
	name: "Entity",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		container: { 
			type: ContainerType,
			resolve: (parent, args) => {
				return Container.findById(parent.containerId)
			}
		},
		type: { type: new GraphQLNonNull(GraphQLString) },
		detail: { type: GraphQLID },
		start: { type: GraphQLString },
		end: { type: GraphQLString }
	})
})

const ContainerType = new GraphQLObjectType ({
	name: 'Container',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		user: { 
			type: UserType,
			resolve: function (parent, args) {
				return User.findById(parent.userId)
			}
		},
		parent: {
			type: ContainerType,
			resolve: function (parent, args) {
				return Container.findById(parent.parentContainer)
			}
		},
		detail: { type: GraphQLString },
		start: { type: GraphQLString },
		end: { type: GraphQLString },
		createdAt: { type: GraphQLString },
		category: { type: GraphQLString },
		status: { type: GraphQLString },
		entities: {
			type: GraphQLList(EntityType),
			resolve: async function(parent, args) {
				return await Entity.find({ containerId: parent.id })
			}
		}
	})
})

module.exports = {
	EntityType, 
	ContainerType
}