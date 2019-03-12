import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Login from './login'

function mapStateToProps(state) {
	return ({
		user: state.user
	})
}

const PrivateRoute = (props) => {
	let Component = props.component
	return(
		<Route { ...props } render={(props) => (
			props.user.loggedIn === true ? <Component {...props} /> : <Redirect to={{
				pathname: "/login"
			}} />
		)} />
	)}

export default connect(mapStateToProps)(PrivateRoute)