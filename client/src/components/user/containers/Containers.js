import React, {Component} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { deleteContainer } from '../../../actions/container-actions'

import Container from "./Container"

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ deleteContainer }, dispatch)
}

class Containers extends Component{
	constructor(props) {
		super(props)

		this.state = {
			containers: {},
			category: "all",
			search: ""
		}
	}

	deleteContainer(id) {
		this.props.deleteContainer(sessionStorage.token, id)	
	}

	componentWillReceiveProps(newProps) {
		this.setState ({
			containers: newProps.containers,
			category: newProps.category,
			search: newProps.searchQuery
		})
	}

	marginStyle = {
		display: "block",
		margin: "10px 0"
	}

	render() {
		return (
			<div style={this.marginStyle}>
			<hr/>
				<h1 className="subtitle">{this.state.category}</h1>

				{Object.keys(this.state.containers).map(function(container) {
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

export default connect(mapDispatchToProps)(Containers)