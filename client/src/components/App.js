import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Home from './Home'
import Login from './login'
import Register from './register'
import Profile from './user/Profile'
import Comm from './user/comm'
import Trips from './user/trips'
import browseContainer from './Container/browse'
import EntityInfo from './Container/entityInfo'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { calloutAction } from '../actions/user-actions'

import PrivateRoute from './privateRoute'

function mapStateToProps(state) {
	return ({
		user: state.user
	})
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ calloutAction }, dispatch)
}

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false
		}

		this.removeLoader = this.removeLoader.bind(this)
	}

	componentDidMount() {
		if(sessionStorage.token && sessionStorage.username){
			this.props.calloutAction()
		}
	}

	removeLoader() {
		this.setState({
			loading: false
		})
	}

	render() {
		if(this.state.loading === true) {
			return (<h2 className="title">loading...</h2>)
		}
		return(
			<div>
				<Route exact path="/" component={Home} />
				<Route exact path="/login" removeLoader={this.removeLoader} component={Login} />
				<Route exact path="/register" component={Register} />
				<Route path="/user/profile" component={Profile} />
				<Route path="/user/trips" component={Trips} />
				<Route path='/home' component={Comm} />
				<Route path="/container" component={browseContainer} />
				<Route path="/entity" component={EntityInfo} />
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)