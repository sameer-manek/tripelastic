import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { userDetails } from '../../../actions/user-actions'

import axios from 'axios'

function mapStateToProps(state) {
	return ({
		userinfo: state.userinfo
	})
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ userDetails }, dispatch)
}

class InfoFormComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleUpdateInfo = this.handleUpdateInfo.bind(this)
	}

	handleChange(e) {
		switch(e.target.id){
			case "firstname":
				if (e.target.value !== this.state.firstname) {
					this.setState({
						firstname: e.target.value
					})
				}
			break
			case "lastname":
				if (e.target.value !== this.state.firstname) {
					this.setState({
						lastname: e.target.value
					})
				}
			break
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			firstname: newProps.userinfo.firstname,
			lastname: newProps.userinfo.lastname
		})
	}

	async handleUpdateInfo() {
		let firstname = this.state.firstname
		let lastname = this.state.lastname
		let query = `mutation{
		  editUser(token: "` + sessionStorage.token + `", firstname: "` + firstname + `", lastname: "` + lastname + `"){
		    firstname
		    lastname
		  }
		}`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).catch(err => console.log("there was an error", err))
	}

	render() {
		if (this.state.loading === true){
			return (
				<h1 className="subtitle">Loading...</h1>
			)
		}
		return(
			<div>
				<h1 className="title">
					User Information
				</h1>

				<div className="box">
					<form>
						<div className="control">
							<label className="label">Username</label>
							<div className="field">
								<input type="text" className="input" disabled placeholder="Unique Username" defaultValue={this.props.userinfo.username}/>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Name</label>
							<div className="field level">
								<input type="text" className="input" placeholder="First Name" id="firstname" style={{ marginRight: "5px" }} defaultValue={this.state.firstname} onChange={this.handleChange}  />
								<input type="text" className="input" placeholder="Last Name" id="lastname" style={{ marginLeft: "5px" }} defaultValue={this.state.lastname} onChange={this.handleChange} />
							</div>
						</div>
						<br/>
						<button type="button" className="button is-info" onClick={this.handleUpdateInfo}>Update</button>
					</form>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoFormComponent)