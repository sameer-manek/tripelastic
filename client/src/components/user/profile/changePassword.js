import React, { Component } from 'react'

import axios from 'axios'

class ChangePassword extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentPass: "",
			newPass: "",
			confirmPass: "",
			error: {
				state: false,
				message: ""
			}
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleUpdateEvent = this.handleUpdateEvent.bind(this)
	}

	handleChange(e) {
		switch(e.target.id){
			case "currentPass":
				if (e.target.value !== this.state.currentPass) {
					this.setState({
						currentPass: e.target.value
					})
				}
			break
			case "newPass":
				if (e.target.value !== this.state.newPass) {
					this.setState({
						newPass: e.target.value
					})
				}
			break
			case "confirmPass":
				if (e.target.value !== this.state.confirmPass) {
					this.setState({
						confirmPass: e.target.value
					})
				}
			break
		}
	}

	async handleUpdateEvent() {
		console.log("called")
		let currentPass = this.state.currentPass
		let newPass = this.state.newPass

		if(newPass !== this.state.confirmPass) {
			console.log("ended up here")
			return this.setState({
				error: {
					state: true,
					message: "confirm password and new password do not match!"
				}
			})
		}

		let query = `mutation{
		  changePass(token: "`+ sessionStorage.token +`", currentPass: "`+ currentPass +`", newPass: "`+ newPass +`"){
		    success
		    message
		  }
		}`

		

		await axios({
			url: 'http://localhost:4000/api',
			method: 'post',
			data:{
				query
			}
		}).then(({ data }) => {
			data = data.data.changePass
			if (data.success === false) {
				this.setState({
					error: {
						state: true,
						message: data.message
					}
				})
			}
		}).catch(err => console.log(query))
	}

	render() {
		let error
		if(this.state.error.state === true){
			error = <div className="message is-danger">
				<div className="message-body">
					<strong>! Error:</strong> {this.state.error.message}
				</div>
			</div>
		}
		return(
			<div>
				<h1 className="title">
					Change Password
				</h1>
				<div className="box">
					{error}
					<form>
						<div className="control">
							<label className="label">Current Password</label>
							<div className="field">
								<input type="Password" id="currentPass" className="input" placeholder="enter your current password" onChange={this.handleChange}/>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">New Password</label>
							<div className="field">
								<input type="password" id="newPass" className="input" placeholder="choose new password" onChange={this.handleChange} />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Confirm New Password</label>
							<div className="field">
								<input type="password" id="confirmPass" className="input" placeholder="confirm new password" onChange={this.handleChange} />
							</div>
						</div>
						<br/>
						<button type="button" className="button is-info" onClick={this.handleUpdateEvent}>Update</button>
					</form>
				</div>

			</div>
		)
	}
}

export default ChangePassword