import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Bar from './bar'


function mapStateToProps(state) {
	return {
		user: state.user
	}
}

class Comm extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<div>
				<Bar />
			</div>
		)
	}
}

export default connect(mapStateToProps)(Comm)