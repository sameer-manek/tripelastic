const graphql = require('graphql')
const _ = require('lodash')

const jwt = require('jsonwebtoken')
const { privateKey } = require("../config")

const User = require('../models/user')

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

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		firstname: { type: GraphQLString },
		lastname: { type: GraphQLString },
		photo: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type:GraphQLString },
		phone: { type: GraphQLString },
		emailVerified: { type: GraphQLBoolean },
		phoneVerified: { type: GraphQLBoolean }
	})
})

module.exports = UserType