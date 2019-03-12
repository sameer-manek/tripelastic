import React, { Component } from 'react'

// routes
import { Link, Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { userLogout } from '../../actions/user-actions'

function mapStateToProps(state){
	return {
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ userLogout }, dispatch)
}

const padding = {
	padding: "20px 0 0 0"
}

class Bar extends Component {
	constructor(props) {
		super(props)
	}

	render() {

		if(!this.props.user.loggedIn) {
			return (
				<Redirect to="/login" />
			)
		}

		return (
			<div className="container" style={padding}>
				<nav className="navbar" role="navigation" aria-label="main navigation">
				  <div className="navbar-brand">
				    <Link className="navbar-item" to="/">
				      <strong className="title">Tripelastic</strong>
				    </Link>

				    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
				      <span aria-hidden="true"></span>
				      <span aria-hidden="true"></span>
				      <span aria-hidden="true"></span>
				    </a>
				  </div>

				  <div id="navbarBasicExample" className="navbar-menu">
				    <div className="navbar-start">
				      <Link to="/home" className="navbar-item">
				        Home
				      </Link>

				      <Link to="/user/trips" className="navbar-item">
				        My trips
				      </Link>

				      <Link to="/user/profile" className="navbar-item">
				        Profile
				      </Link>
				    </div>

				    <div className="navbar-end">
				      <div className="navbar-item">
				        <div className="buttons">
				        	<button type="button" className="button"><i className="lnr lnr-bullhorn"></i></button>
				          	<button type="button" className="button is-danger" onClick={this.props.userLogout}><i className="lnr lnr-exit"></i>&nbsp;Logout</button>
				        </div>
				      </div>
				    </div>
				  </div>
				</nav>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)