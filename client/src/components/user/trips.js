import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchContainers, deleteContainer } from '../../actions/container-actions'

import Bar from './bar'
import { TripsMenu } from './menus'
import SearchComponent from './containers/SearchComponent'
import Containers from './containers/Containers'
import CreateContainer from './containers/CreateContainer'
import Loader from '../Loader'


function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchContainers, deleteContainer }, dispatch)
}

class Trips extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "all",
			search: "",
			searching: false,
			inherit: null,
			containers: null,
			loading: true
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.handleSearchEvent = this.handleSearchEvent.bind(this)
		this.deleteContainer = this.deleteContainer.bind(this)
		this.fetchContainers = this.fetchContainers.bind(this)
	}

	toggleSelected = function (newSelection) {
		if(this.state.selected !== newSelection) {
			this.setState({
				selected: newSelection
			})
		}
	}

	deleteContainer (id) {
		this.props.deleteContainer(sessionStorage.token, id)
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

	fetchContainers() {
		this.setState({
			loading: true
		})
		this.props.fetchContainers(sessionStorage.token)
	}

	componentDidMount() {
		this.fetchContainers()
	}

	componentWillReceiveProps(newProps) {
		if (newProps.containers !== this.state.containers) {
			this.setState({
				containers: newProps.containers,
				loading: false
			})
		}
	}

	render() {
		let conts = this.props.containers
		let searchComponent

		if(this.state.selected !== "create") {
			searchComponent = <SearchComponent handleSearch={this.handleSearchEvent} />
		} else {
			searchComponent = null
		}

		let containerSpace = this.state.searching === true ? <h2 className="subtitle">searching..</h2> : <Containers containers={conts} searchQuery={this.state.search} category={this.state.selected} deleteContainer={this.deleteContainer} />
		if (this.state.selected === "create") {
			containerSpace = <CreateContainer inherit={this.state.inherit} fetchContainers={this.fetchContainers} />
		}

		if(this.state.loading === true) {
			containerSpace = <Loader type="spin" color="#000000" />
		}

		return (
			<div className="container">
				<Bar />
				<hr/>
				<div className="columns">
					<div className="column is-one-quarter">
						<TripsMenu toggle={this.toggleSelected} />
					</div>
					<div className="column is-three-quarters">
						{searchComponent}
						{containerSpace}
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Trips)