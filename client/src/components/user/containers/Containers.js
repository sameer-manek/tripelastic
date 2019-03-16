import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { deleteContainer } from '../../../actions/container-actions'

import Container from './Container'

function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ deleteContainer }, dispatch)
}

class Containers extends Component {
	constructor(props) {
		super(props)

		this.state = {
			containers: []
		}

		this.deleteContainer = this.deleteContainer.bind(this)
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			containers: newProps.containers
		})
	}

	marginStyle = {
		padding: "50px 0"
	}

	deleteContainer(id) {
		this.props.deleteContainer(sessionStorage.token, id)	
	}

	render() {
		return (
			<div style={this.marginStyle}>
				{this.state.containers.map(container => {
					return (
						<Container 
							key={container.id}
							data={container}
							deleteContainer={this.deleteContainer}
						/>
					)
				})}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Containers)

