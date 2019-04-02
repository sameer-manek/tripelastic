const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const destinationSchema = Schema({
	address: { type: String, required: false },
	userId: { type: String, required: true },
	city: { type: String, required: true },
	country: { type: String, required: false },
	pincode: { type: String, required: true },
	location: { type: String },
})

module.exports = mongoose.model("Destination", destinationSchema)