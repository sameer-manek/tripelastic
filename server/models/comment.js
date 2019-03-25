const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new Schema({
	content: { type: String, required: true },
	userId: { type: ObjectId, required: true },
	postId: { type: ObjectId, required: true },
	parentId: { type: ObjectId, required: false },
	votes: { type: Number, required: false, default: 0 }
})

module.exports = mongoose.model("Comment", commentSchema)