const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const transportSchema = Schema({
	name: { type: String, required: true },
	pickupAddress: { type: String, required: true },
	pickupCity: { type: String, required: true },
	pickupCountry: { type: String, required: true },
	pickupPincode: { type: Number, required: true },
	pickupLocation: { type: String },
	dropAddress: { type: String, required: true },
	dropCity: { type: String, required: true },
	dropCountry: { type: String, required: true },
	dropPincode: { type: Number, required: true },
	dropLocation: { type: String },
	bookingId: { type: String },
	seat: { type: String, required: true }
})

module.exports = mongoose.model("Transport", transportSchema)