import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Container from './Container'

function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers,
	}
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
		this.setState({
			containers: newProps.containers.filter(({ name }) => {
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
		console.log("deleting container")	
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

