const graphql = require('graphql')
const _ = require('lodash')

const UserType = require('./userSchema')
const { EntityType } = require('./entitySchema')

const User = require('../models/user')
const Container = require('../models/container')
const Entity = require('../models/entity')

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



module.exports = ContainerType