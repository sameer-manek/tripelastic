const graphql = require('graphql')
const _ = require('lodash')

const UserType = require('./userSchema')
const ContainerType = require('./containerSchema')

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
    GraphQLNonNull,
    GraphQLUnionType
} = graphql

const EntityType = new GraphQLObjectType({
    name: "Entity",
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        container: { 
            type: ContainerType,
            resolve: function(parent, args) {
                return Container.findById(parent.containerId)
            } 
        },
        type: { type: new GraphQLNonNull(GraphQLString) },
        detail: { type: new GraphQLNonNull(GraphQLString) },
        start: { type: GraphQLString },
        end: { type: GraphQLString }
    })
})
module.exports = EntityType