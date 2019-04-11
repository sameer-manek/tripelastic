import React, { Component } from 'react'
import Bar from '../user/bar'

import axios from 'axios'

class EntityInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data: this.props.location.data,
			details: {},
			loading: true
		}
	}

	async fetchData(query) {
		return await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			return data
		})
	}

	

	render() {
		if(this.state.loading === true) {
			return (<p>Loading...</p>)
		}
		
		let data = this.props.location.data
		return(
			<div>
				<Bar />
				<div className="container">
				
				</div>
			</div>
		)
	}
}

export default EntityInfo