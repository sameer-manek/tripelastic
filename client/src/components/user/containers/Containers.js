import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { deleteContainer } from '../../../actions/container-actions'

import Container from './Container'

function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ deleteContainer }, dispatch)
}

class Containers extends Component {
	constructor(props) {
		super(props)

		this.state = {
			containers: [],
			category: "all"
		}

		this.deleteContainer = this.deleteContainer.bind(this)
	}

	componentWillReceiveProps(newProps) {
		// convert object '{}' to array '[]'
		let obj = newProps.containers
		let containers = Object.keys(obj).map(function(key) {
			return [key, obj[key]]
		})

		// filter containers based on category selected
		this.setState({
			containers: containers === {} ? [] : containers.filter(({ name }) => {
				let result = name.startsWith(newProps.searchQuery)
				if(this.state.category !== "all") {
					return result.filter(({ category }) => {
						return category === this.state.category
					})
				}
				return result
			})
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

export default connect(mapStateToProps)(Containers)

