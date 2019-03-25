const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	containerId: { type: ObjectId, required: false },
	userId: { type: ObjectId, required: true },
	votes: { type: Number, required: true, default: 0 },
})

module.exports = mongoose.model("Post", postSchema)