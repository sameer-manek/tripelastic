const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId

const entitySchema = new Schema ({
	name: { type: String, required: true },
	containerId: { type: ObjectId, required: true },
	type: { type: String, required: true },
	detail: { type: ObjectId },
	start: { type: Date },
	end: { type: Date }
}) 

module.exports = mongoose.model("Entity", entitySchema)