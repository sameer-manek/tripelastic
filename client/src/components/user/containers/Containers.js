import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {  } from '../../../actions/container-actions'

import Container from './Container'

function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({  }, dispatch)
}

class Containers extends Component {
	constructor(props) {
		super(props)

		this.state = {
			containers: []
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			containers: newProps.containers
		})
	}

	marginStyle = {
		padding: "50px 0"
	}

	render() {
		return (
			<div style={this.marginStyle}>
				{this.state.containers.map(container => {
					return (
						<Container 
							key={container.id}
							data={container}
						/>
					)
				})}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Containers)

