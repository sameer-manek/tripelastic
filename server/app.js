// 'mongodb+srv://axiom:Password@tripelastic-1i8do.mongodb.net/test?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true }

const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const cors = require('cors')

const jwt = require('jsonwebtoken')

const schema = require('./schema/schema')
const root = {}
const { privateKey } = require("./config")

mongoose.connect('mongodb+srv://axiom:Password@tripelastic-1i8do.mongodb.net/test?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })
	.then(() => {
		console.log("connection has been eshtablished")
	})
	.catch((error) => {
		console.log("connection has been interrupted, check provided username and password")
	})

const User = require('./models/user')


const app = express()

app.use(cors())

app.use('/api', graphqlHTTP({
	graphiql: true,
	rootValue: root,
	schema: schema
}))

app.get('/verification', async function (req, res) {
	let type = req.query.type
	let token = req.query.token

	if(type && token) {
		switch (type) {
			case "email":
				let data = await jwt.verify(token, privateKey)
				if(!data || data.errors) {
					console.log(data.errors.message)
					return res.send("Sorry, invalid token! maybe the token has expired. Please regenerate the email")
				}
				let email = data.email
				if(!email) {
					return res.send("Sorry, invalid token! maybe the token has expired. Please regenerate the email")
				}
				let user = await User.findOne({ email: email })
				console.log(user.email)
				if(!user) {
					return res.send("Sorry, no user match found for this token!")
				}
				user.emailVerified = true
				await user.save()
				return res.send("Thank you for verifying your email. You may now use all your services. Please do not forget to verify your phone number to receive important push notifications!")
			break

			case "phone":
				// do nothing for now
			break
		}
	}
})

app.listen(4000, () => console.log("server working on port 4000"))
