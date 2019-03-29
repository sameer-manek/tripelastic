const graphql = require('graphql')
const _ = require('lodash')

const UserType = require('./userSchema')
const { ContainerType } = require('./containerSchema')

const User = require('../models/user')
const Container = require('../models/container')
const Post = require("../models/post")
const Comment = require("../models/comment")
const Vote = require("../models/vote")

const { 
	GraphQLObjectType, 
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql

const PostType = new GraphQLObjectType({
	name: "Post",
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: new GraphQLNonNull(GraphQLString) },
		content: { 
			type: new GraphQLNonNull(GraphQLString)
		},
		container: { 
			type: ContainerType,
			resolve: async function(parent, args) {
				return await Container.findById(parent.containerId)
			}
		},
		user: { 
			type: new GraphQLNonNull(UserType),
			resolve: async function(parent, args) {
				return await User.findById(parent.userId)
			}
		},
		votes: { type: GraphQLInt },
		comments: {
			type: GraphQLList(CommentType),
			resolve: async function (parent, args) {
				let comments = await Comment.find({ postId: parent.id.toString(), parentId: null })
				comments.map(comment => comment.editable = (parent.editable === true && comment.userId.toString() === parent.userId.toString()) ? true : false)
				return comments
			}
		},
		createdAt: { type: GraphQLString },
		updatedAt: { type: GraphQLString },
		editable: { 
			type: GraphQLBoolean,
		},
	})
})

const CommentType = new GraphQLObjectType({
	name: "Comment",
	fields: () => ({
		id: { type: GraphQLID },
		content: { type: new GraphQLNonNull(GraphQLString) },
		user: { 
			type: new GraphQLNonNull(UserType),
			resolve: async function(parent, args) {
				return await User.findById(parent.userId)
			}
		},
		children: { 
			type: GraphQLList(CommentType),
			resolve: async function(parent, args) {
				return await Comment.find({ parentId: parent.id })
			}
		},
		post: { 
			type: new GraphQLNonNull(PostType),
			resolve: async function(parent, args) {
				return await Post.findById(parent.postId)
			}
		},
		votes: { type: GraphQLInt },
		editable: { type: GraphQLBoolean }
	})
})

const VoteType = new GraphQLObjectType({
	name: "Vote",
	fields: () => ({
		user: { 
			type: new GraphQLNonNull(UserType),
			resolve: async function(parent, args) {
				return await User.findById(parent.userId)
			}
		},
		post: { 
			type: new GraphQLNonNull(PostType),
			resolve: async function(parent, args) {
				return await Post.findById(parent.postId)
			}
		},
		value: { type: new GraphQLNonNull(GraphQLInt) }
	})
})

module.exports = {
	PostType,
	CommentType,
	VoteType
}