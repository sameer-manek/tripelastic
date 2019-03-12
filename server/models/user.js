const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
	username: { type: String, unique: true, required: true, trim: true },
	firstname: { type: String, trim: true },
	lastname: { type: String, trim: true },
	email: { type: String, unique: true, required: true, trim: true },
	password: { type: String, required: true },
	phone: { type: String, unique:true, trim: true },
	emailVerified: { type: Boolean, default: false },
	phoneVerified: { type: Boolean, default: false },
	photo: { type: String, default: "//cdn1.iconfinder.com/data/icons/navigation-elements/512/user-login-man-human-body-mobile-person-512.png" }
})

module.exports = mongoose.model('User', userSchema)
