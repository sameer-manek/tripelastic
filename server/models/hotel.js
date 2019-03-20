const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const hotelSchema = Schema({
	name: { type: String, required: true },
	address: { type: String, required: true },
	city: { type: String, required: true },
	country: { type: String, required: true },
	pincode: { type: Number, required: true },
	location: { type: String, required: false },
	room: { type: String, required: true }
})

module.exports = mongoose.model("Hotel", hotelSchema)