const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const voteSchema = new Schema({
	userId: { type: ObjectId, required: true },
	postId: { type: ObjectId, required: true },
	value: { type: Number, required: true }
})

voteSchema.index({ userId: 1, postId: 1 }, { unique: true })

module.exports = mongoose.model("Vote", voteSchema)