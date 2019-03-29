import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { userDetails } from '../../actions/user-actions'

import Bar from './bar'
import { ProfileMenu } from './menus'
import InfoFormComponent from './profile/info'
import ChangePassword from './profile/changePassword'
import ContactFormComponent from './profile/contact'

import axios from 'axios'


function mapStateToProps(state) {
	return {
		user: state.user,
		userinfo: state.userinfo,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ userDetails }, dispatch)
}

class Profile extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "info"
		}

		this.toggleSelected = this.toggleSelected.bind(this)
	}

	toggleSelected = function(newSelection) {
		if(this.state.selected !== newSelection) {
			this.setState({
				selected: newSelection
			})
		}
	}

	componentDidMount() {
		let token = sessionStorage.token
		this.props.userDetails(token)
	}

	render() {
		let Comp

		switch(this.state.selected){
			case "info":
				Comp = <InfoFormComponent />
				break
			case "contact":
				Comp = <ContactFormComponent />
				break
			case "password":
				Comp = <ChangePassword />
				break
			default:
				Comp = <div className="column is-three-quarters"><h3 className="subtitle">Please select an option</h3></div>
		}

		return (
			<div className="container">
				<Bar />
				<hr/>
				<div className="columns">
					<div className="column is-one-quarter">
						<ProfileMenu toggle={this.toggleSelected} />
					</div>
					<div className="column is-three-quarters">
						{Comp}
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)