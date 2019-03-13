import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Container extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	marginStyle = {
		margin: "20px 0"
	}

	render() {
		let option = this.props.data.category === "trip" ? "duplicate" : "inherit"
		return (
			<div className="card" style={this.marginStyle}>
				<header className="card-header">
					<Link to="#" className="card-header-title">
						{this.props.data.name} <i style={{fontWeight: "normal", color: "grey"}}>({this.props.data.category})</i>
					</Link>

					<a href="#" className="card-header-icon" aria-label="more options">
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
					<a href="#" className="card-footer-item">Edit</a>
					<a href="#" className="card-footer-item">Share</a>
					<a href="#" className="card-footer-item">{option}</a>
				</footer>
			</div>
		)
	}
}

export default Container