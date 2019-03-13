import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchContainers } from '../../actions/container-actions'

import Bar from './bar'
import { TripsMenu } from './menus'
import SearchComponent from './containers/SearchComponent'
import Containers from './containers/Containers'


function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchContainers }, dispatch)
}

class Trips extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "all"
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
		this.props.fetchContainers(sessionStorage.token)
	}

	render() {
		return (
			<div className="container">
				<Bar />
				<hr/>
				<div className="columns">
					<div className="column is-one-quarter">
						<TripsMenu toggle={this.toggleSelected} />
					</div>
					<div className="column is-three-quarters">
						<SearchComponent />
						<Containers />
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Trips)