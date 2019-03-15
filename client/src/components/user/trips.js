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
		containers: state.containers,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchContainers }, dispatch)
}

class Trips extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "all",
			search: "",
			searching: false
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.handleSearchEvent = this.handleSearchEvent.bind(this)
	}

	toggleSelected = function (newSelection) {
		if(this.state.selected !== newSelection) {
			this.setState({
				selected: newSelection
			})
		}
	}

	handleSearchEvent = function (e) {
		console.log("searching..")
		this.setState({
			searching: true
		})
		if (e.target.value !== this.state.search) {
			this.setState({
				search: e.target.value
			})
		}
		this.setState({
			searching: false
		})
	}

	componentDidMount() {
		this.props.fetchContainers(sessionStorage.token)
	}

	render() {
		let containerSpace = this.state.searching === true ? <h2 className="subtitle">searching..</h2> : <Containers searchQuery={this.state.search} category={this.state.selected} />
		return (
			<div className="container">
				<Bar />
				<hr/>
				<div className="columns">
					<div className="column is-one-quarter">
						<TripsMenu toggle={this.toggleSelected} />
					</div>
					<div className="column is-three-quarters">
						<SearchComponent
							handleSearch={this.handleSearchEvent}
						/>
						{containerSpace}
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Trips)