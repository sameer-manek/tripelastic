const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const transportSchema = Schema({
	type: { type: String, required: true },
	userId: { type: String, required: true },
	pickupAddress: { type: String, required: true },
	pickupCity: { type: String, required: true },
	pickupCountry: { type: String, required: true },
	pickupPincode: { type: String, required: false },
	pickupLocation: { type: String },
	dropAddress: { type: String, required: true },
	dropCity: { type: String, required: true },
	dropCountry: { type: String, required: true },
	dropPincode: { type: String, required: false },
	dropLocation: { type: String },
	bookingId: { type: String },
	seat: { type: String, required: false },
	vehicleId: { type: String, required: false }
})

module.exports = mongoose.model("Transport", transportSchema)