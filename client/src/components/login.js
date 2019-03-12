import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { userLogin } from '../actions/user-actions.js'

import{ HeroComponent } from './pageDefaults'

import styles from '../assets/styles/login.css'

function mapStateToProps (state) {
	return ({
		user: state.user
	})
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ userLogin }, dispatch)
}

class LoginComponent extends Component {

	constructor (props) {
		super(props)

		this.state = {

			email: "",
			password: "",
			emailError: "",
			passwordError: ""
		}

		this.handleEmailInput = this.handleEmailInput.bind(this)
		this.handlePasswordInput = this.handlePasswordInput.bind(this)
		this.handleIOClick = this.handleIOClick.bind(this)
	}

	handleEmailInput (e) {
		if(this.state.email !== e.target.value) {
			this.setState({
				email: e.target.value,
				emailError: ""
			})
		}
	}

	handlePasswordInput (e) {
		if(this.state.password !== e.target.value) {
			this.setState({
				password: e.target.value,
				passwordError: ""
			})
		}
	}

	handleIOClick(e) {
		e.preventDefault()
		if(this.state.email === "") {
			return this.setState({
				emailError: "email is required"
			})
		}

		if(this.state.password === "") {
			return this.setState({
				passwordError: "password is required"
			})
		}

		this.props.userLogin(this.state.email, this.state.password)
	}

	render() {
		
		if(this.props.user.loggedIn === true) {
			return <Redirect to="/user/trips" />
		}
		
		let message

		if (this.props.user.error) {
			message = <article className="message is-danger"><div className="message-body">{this.props.user.error}</div></article>
		}

		return(
			<div>
				<HeroComponent />

				<div className="box login-box">
					{message}
					<form className="form">
						
						<div className="control">
							<label className="label">Email</label>
							<div className="field">
								<input type="email" id="username" className="input" onChange={this.handleEmailInput} />
								<br/>
								<i className="error" id="email-error">{ this.state.emailError }</i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Password</label>
							<div className="field">
								<input type="password" id="password" className="input" onChange={this.handlePasswordInput} />
								<br/>
								<i className="error" id="password-error">{ this.state.passwordError }</i>
							</div>
						</div>

						<br/>
						<div className="control">
							<div className="field">
								<button className="button is-primary" onClick={ this.handleIOClick }>Login</button>
							</div>
						</div>
					</form>

				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent)