import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapStateToProps (state) {
	return {
		userinfo: state.userinfo
	}
}

class ContactFormComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		this.setState({
			loading: false
		})
	}

	render() {
		if(this.state.loading === true) {
			return (
				<h1 className="subtitle">Loading...</h1>
			)
		}
		let emailmsg = this.props.userinfo.emailVerified ? "" : (<div className="message is-danger">
			<div className="message-body">Email is not verified! Verify your email to access all facilities of the platform. <a className="tag is-danger" target="_blank">Click Here</a> to resend verification email.</div>
		</div>)

		let phonemsg = this.props.userinfo.phoneVerified ? "" : (<div className="message is-danger">
			<div className="message-body">Phone number is not verified! Verify your phone to receive important notifications. <a className="tag is-danger" target="_blank">Click Here</a> to verify phone number.</div>
		</div>)

		phonemsg = this.props.userinfo.phone === null ? (<div className="message is-info">
			<div className="message-body">You haven't provided your phone number yet! This is not at all mandatory, however it will help us to send you important notifications in future. <a className="tag is-info" target="_blank">Click Here</a> to verify your phone number.</div>
		</div>) : phonemsg
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
								<input type="text" className="input" placeholder="Your registered email" defaultValue={this.props.userinfo.email}/>
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