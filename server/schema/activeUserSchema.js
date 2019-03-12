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

const ActiveUserType = new GraphQLObjectType({
	name: 'ActiveUser',
	fields: () => ({
		success: { type: GraphQLBoolean },
		message: { type: GraphQLString },
		token: { type: GraphQLString },
		username: { type: GraphQLString }
	})
})

module.exports = ActiveUserType