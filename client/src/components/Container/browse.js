import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Bar from '../user/bar'

function Entity(props) {
	return (
		<div className="card">
		  <header className="card-header">
		    <p className="card-header-title">
		      {props.data.type}
		    </p>
		    <a href="#" className="card-header-icon" aria-label="more options">
		      <span className="icon">
		        <i className="fas fa-angle-down" aria-hidden="true"></i>
		      </span>
		    </a>
		  </header>
		  <div className="card-content">
		    <div className="content">
		      <p>{props.data.name}</p>
		      <br />
		      <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
		    </div>
		  </div>
		  <footer className="card-footer">
		  <a href="#" className="card-footer-item">Info</a>
		    <a href="#" className="card-footer-item">Edit</a>
		    <a href="#" className="card-footer-item">Delete</a>
		  </footer>
		</div>
	)
}

class browseContainerComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState(newProps.location.state)
	}

	render() {
		let data = this.props.location.state.data

		return (
			<div className="container">
				<Bar />
				<hr/>
				<div>
					<div className="container-header level">
						<span className="level-left">
							<Link to={{
									pathname: this.props.location.state.url
								}} className="button">
								<i className="icon lnr lnr-arrow-left"></i>&nbsp; Back
							</Link>
						</span>

						<span className="level-right">
							<button className="button">
								<i className="icon lnr lnr-pencil"></i>
							</button>
							&nbsp;
							<button className="button">
								<i className="icon lnr lnr-trash"></i>
							</button>
						</span>
					</div>

					<div className="container-body columns">
						<div className="column is-two-thirds">
							<p className="menu-label">Entities</p>
							{data.entities.map(entity => <div><Entity key={entity.id} data={entity} /> <br/></div>)}
							<div className="level">
								<button className="button is-info is-outlined level-item">
									<i className="icon lnr lnr-plus-circle"></i>&nbsp; Add Entity
								</button>
							</div>
						</div>
						<div className="column is-one-third">
							<p className="menu-label">{data.category} details</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default browseContainerComponent