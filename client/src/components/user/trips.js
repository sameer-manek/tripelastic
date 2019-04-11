import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import Bar from './bar'
import { TripsMenu } from './menus'
import SearchComponent from './containers/SearchComponent'
import Containers from './containers/Containers'
import CreateContainer from './containers/CreateContainer'
import Loader from '../Loader'

class Trips extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "all",
			search: "",
			searching: false,
			inherit: null,
			containers: null,
			loading: true,
			reload: false,
			currentRoute: "/user/trips"
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.handleSearchEvent = this.handleSearchEvent.bind(this)
		this.deleteContainer = this.deleteContainer.bind(this)
		this.fetchContainers = this.fetchContainers.bind(this)
	}

	toggleSelected = function (newSelection) {
		if(this.state.selected !== newSelection) {
			this.setState({
				selected: newSelection,
				loading: false
			})
		}
	}

	async deleteContainer (cid) {
		// this.props.deleteContainer(sessionStorage.token, id)
		let query = `
			mutation {
				deleteContainer(token: "`+ sessionStorage.token +`", containerId: "`+ cid +`") {
					success
					message
				}
			}
		`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({data}) => {
			this.setState({
				reload: true
			})
		})
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
		let query = `
			query{
				myContainers(token: "`+ sessionStorage.token +`") {
					id
					name
					category
					detail
					entities {
						id
						name
						type
						detail
						start
						end
					}
					start
					end
				}
			}
		`
		return axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.myContainers
			return data
		})
	}

	componentDidMount() {
		this.fetchContainers().then(data => this.setState({
			containers: data,
			loading: false
		}))
	}

	render() {

		if(this.state.reload === true) {
				return (<Redirect to="/login" />)
		}

		let searchComponent
		let containerSpace

		
		if(this.state.loading === true) {
			containerSpace = <Loader type="spin" color="#000000" />
		} else {
			if(this.state.selected !== "create") {
				searchComponent = <SearchComponent handleSearch={this.handleSearchEvent} />
			} else {
				searchComponent = null
			}

			containerSpace = <Containers containers={this.state.containers} searchQuery={this.state.search} category={this.state.selected} deleteContainer={this.deleteContainer} />
			
			if (this.state.selected === "create") {
				containerSpace = <CreateContainer inherit={this.state.inherit} />
			}
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

export default Trips