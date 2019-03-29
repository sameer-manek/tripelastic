import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import axios from 'axios'

function mapStateToProps (state) {
	return {
		userinfo: state.userinfo
	}
}

class ContactFormComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			emailSent: null
		}

		this.handleEmailVerifyEvent = this.handleEmailVerifyEvent.bind(this)
	}

	componentDidMount() {
		this.setState({
			loading: false
		})
	}

	componentWillReceiveProps (newProps) {
		console.log("PROPS", newProps)
		this.setState({
			email: newProps.userinfo.email
		})
	}

	handleEmailVerifyEvent(e) {
		e.preventDefault()

		// send verification email
		let query = `query{
			verifyEmail(token: "`+sessionStorage.token+`") {
				success
				message
			}
		}`
		axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.verifyEmail
			if(data.success === true) {
				return this.setState({
					emailSent: true
				})
			} else {
				return this.setState({
					emailSent: false
				})
			}
		}).catch(err => {
			console.log("there was an error: ", err)
		})
	}

	render() {
		if(this.state.loading === true) {
			return (
				<h1 className="subtitle">Loading...</h1>
			)
		}
		let emailmsg = this.props.userinfo.emailVerified ? "" : (<div className="message is-danger">
			<div className="message-body">Email is not verified! Verify your email to access all facilities of the platform. <button className="tag is-danger" onClick={this.handleEmailVerifyEvent}>Click Here</button> to resend verification email.</div>
		</div>)

		let phonemsg = this.props.userinfo.phoneVerified ? "" : (<div className="message is-danger">
			<div className="message-body">Phone number is not verified! Verify your phone to receive important notifications. <a className="tag is-danger" target="_blank">Click Here</a> to verify phone number.</div>
		</div>)

		phonemsg = this.props.userinfo.phone === null ? (<div className="message is-info">
			<div className="message-body">You haven't provided your phone number yet! This is not at all mandatory, however it will help us to send you important notifications in future. <a className="tag is-info" target="_blank">Click Here</a> to verify your phone number.</div>
		</div>) : phonemsg

		if (this.state.emailSent === true) {
			emailmsg = (<div className="message is-info">
				<div className="message-body">Email has been sent your registered email address! make sure to reactivate it within next 48 hours</div>
			</div>)
		}
		return(
			<div>
				<h1 className="title">
					Contact Information
				</h1>

				
				<form>
					<div className="box">
						<div className="control">
							<label className="label">Email</label>
							<div className="field">
								<input type="text" id="userEmail" className="input" placeholder="Your registered email" defaultValue={this.props.userinfo.email}/>
							</div>
							{emailmsg}
						</div>
						<br/>
						<button className="button is-info">Update Email</button>
					</div>
					<br/>
					<div className="box">
						<div className="control">
							<label className="label">Phone</label>
							<div className="field">
								<input type="text" className="input" placeholder="Your Phone Number Will Appear Here" disabled defaultValue={this.props.userinfo.phone} />
							</div>
							{phonemsg}
						</div>
					</div>
				</form>
			</div>
		)
	}
}

export default connect(mapStateToProps)(ContactFormComponent)