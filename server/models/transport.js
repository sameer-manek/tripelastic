const mongoose = require("mongoose")
const Schema = mongoose.Schema

var ObjectId = mongoose.Schema.Types.ObjectId;

const transportSchema = Schema({
	type: { type: String, required: true },
	userId: { type: String, required: true },
	pickup: { type: String, required: true },
	p_address: { type: String, required: false },
	drop: { type: String, required: true },
	d_address: { type: String, required: false },
	bookingId: { type: String },
	seat: { type: String, required: false },
	vehicleId: { type: String, required: false }
})

module.exports = mongoose.model("Transport", transportSchema)