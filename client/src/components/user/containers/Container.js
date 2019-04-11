import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

class Container extends Component {
	constructor(props) {
		super(props)

		this.state = {}

		this.duplicateContainer = this.duplicateContainer.bind(this)
	}

	marginStyle = {
		margin: "20px 0"
	}

	async duplicateContainer() {
		let query = `mutation{
			duplicateContainer(token:"`+ sessionStorage.token +`", containerId: "`+ this.props.data.id +`", name: "(copy of) `+ this.props.data.name +`", detail: "`+ this.props.data.detail +`"){
				success
				message
			}
		}`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			if(!data.error)
				alert("the Component has been duplicated! reload the page to see in effect")
			else
				alert("hello")
		})
	}

	render() {
		let option = this.props.data.category === "trip" ? "duplicate" : "inherit"
		return (
			<div className="card" style={this.marginStyle}>
				<header className="card-header">
					<Link to="#" className="card-header-title">
						{this.props.data.name} <i style={{fontWeight: "normal", color: "grey"}}>({this.props.data.category})</i>
					</Link>

					<a href="#" className="card-header-icon" aria-label="more options" onClick={() => {this.props.deleteContainer(this.props.data.id); this.props.removeContainer(this.props.data.id)}}>
				    	<span className="icon">
				        	<i className="lnr lnr-trash" style={{color: "red"}} aria-hidden="true" title="Delete"></i>
				    	</span>
				    </a>
				</header>

				<div className="card-content">
					<div className="content">
						{this.props.data.detail}
					</div>
				</div>

				<footer className="card-footer">
					<Link to={{
						pathname: "/container",
						state: {
							data: this.props.data,
							url: "/user/trips"
						}
					}} className="card-footer-item">Browse</Link>
					<Link to="/editcontainer" className="card-footer-item">Edit</Link>
					<button onClick={this.duplicateContainer} style={{ background: "transparent", border: "0", color: "blue", cursor: "pointer" }} className=" link card-footer-item">{option}</button> 
				</footer>
			</div>
		)
	}
}

export default Container