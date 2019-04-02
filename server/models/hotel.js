const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const hotelSchema = Schema({
	address: { type: String, required: true },
	userId: { type: String, required: true },
	city: { type: String, required: true },
	country: { type: String, required: true },
	pincode: { type: String, required: false },
	location: { type: String, required: false },
	room: { type: String, required: false }
})

module.exports = mongoose.model("Hotel", hotelSchema)