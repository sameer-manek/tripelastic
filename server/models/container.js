const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const containerSchema = new Schema({
	name: { type:String, required: true, trim:true },
	userId: { type: ObjectId, required: true },
	parentContainer: { type: ObjectId, required: false },
	detail: { type: String, required: false },
	start: { type: Date, required:false },
	end: { type:Date, require: false },
	createdAt: { type: Date, required: true },
	category: { type: String, required: true, default: "trip" },
	status: { type: String, required: true, default: "active" },
})

module.exports = mongoose.model('Container', containerSchema)