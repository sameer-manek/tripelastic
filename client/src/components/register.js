import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {  } from '../actions/user-actions'

import axios from 'axios'

import{ HeroComponent } from './pageDefaults'

import styles from '../assets/styles/login.css'

function mapStateToProps (state)  {
	return {
		user: state.user
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({  }, dispatch)
}

class RegisterComponent extends Component {

	constructor (props) {
		super(props)

		this.state = {
			processing: false,
			username: "",
			email: "",
			password: "",
			confirm: "",
			error: {
				state: false,
				message: ""
			},
			success: false

		}

		this.handleInputEvent = this.handleInputEvent.bind(this)
		this.handleClickEvent = this.handleClickEvent.bind(this)
	}

	handleInputEvent(e) {
		switch (e.target.id) {
			case "username":
				if (this.state.username !== e.target.value) {
					this.setState({
						username: e.target.value
					})
				}
			break

			case "email":
				if (this.state.email !== e.target.value) {
					this.setState({
						email: e.target.value
					})
				}
			break

			case "password":
				if(this.state.password !== e.target.value) {
					this.setState({
						password: e.target.value
					})
				}
			break

			case "confirm":
				if(this.state.confirm !== e.target.value) {
					this.setState({
						confirm: e.target.value
					})
				}
			break

		}
	}
	async handleClickEvent(e) {
		e.preventDefault()
		this.setState({
			processing: true,
			error: {
				state: false,
				message: ""
			}
		})
		if (this.state.username == "" || this.state.email == "" || this.state.password == "" || this.state.confirm == "") {
			this.setState({
				processing: false,
				error: {
					state: true,
					message: "all the fields are required"
				}
			})
		}
		if (this.state.confirm !== this.state.password) {
			this.setState({
				processing: false,
				error: {
					state: true,
					message: "passwords do not match"
				}
			})
		}

		// register the user
		let query = `mutation {
				addUser(username: "`+ this.state.username +`", email: "`+ this.state.email +`", password: "`+ this.state.password +`") {
		  		email
			}
		}`

		return await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			console.log(data)
			let email = data.data.addUser.email
			if (email && this.state.email === email) {
				return this.setState({
					processing: false,
					success: true
				})
			}
			return this.setState({
				processing: false,
				success: false,
				error: {
					state: true,
					message: "Sorry, there was a problem, ask the site admin to survey logs"
				}
			})
		}).catch(err => {
			console.log(err)
			this.setState({
					processing: false,
					success: false,
					error: {
						state: true,
						message: "Sorry, there was a problem, ask the site admin to survey logs, err"
					}
			})
		})

	render() {
		if(this.props.user.loggedIn === true) {
			return <Redirect to="/user/trips" />
		}

		let errorMessage
		let button = this.state.processing === true 
		? <div className="control"><button className="button is-loading is-primary">Sign up</button></div> 
		: <div className="control"><button className="button is-primary" onClick={this.handleClickEvent}>Sign up</button></div>
		let success

		if (this.state.success === true) {
			success = <article className="message is-primary"><div className="message-body">User has been successfully registered. You will receive an Email from us to verify your registered email. Please complete the process to be able to use our services</div></article>
		}

		if (this.state.error.state === true) {
			errorMessage = <article className="message is-danger"><div className="message-body">{this.state.error.message}</div></article>
		}
		return(
			<div>
				<HeroComponent />

				<div className="box login-box">
					{errorMessage}
					<form className="form">
						<div className="control">
							<label className="label">Username</label>
							<div className="field">
								<input type="text" id="username" className="input" onChange={this.handleInputEvent}/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Email</label>
							<div className="field">
								<input type="email" id="email" className="input" onChange={this.handleInputEvent}/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Password</label>
							<div className="field">
								<input type="password" id="password" className="input" onChange={this.handleInputEvent}/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Confirm Password</label>
							<div className="field">
								<input type="password" id="confirm" className="input" onChange={this.handleInputEvent}/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						{button}
					</form>

				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterComponent)