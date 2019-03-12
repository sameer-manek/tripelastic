import React, { Component } from 'react'

import styles from '../../../assets/styles/search.css'

class SearchComponent extends Component {
	constructor (props) {
		super(props)

		this.state = {
			query: ""
		}
	}

	queryInputEvent = function (e)  {
		if(e.target.value !== this.state.query) {
			this.setState({
				query: e.target.value
			})
		}
	}

	iconStyle = {
		color: "black @important"
	}

	render() {
		return (
			<div className="column is-three-quarters" >
				<form className="form">
					<p className="control has-icons-right" style={this.boxContainerStyle}>
						<input type="text" className="input" placeholder="Search trips and containers .." style={this.searchBoxStyle} />
						<span className="icon is-right">
							<i className="lnr lnr-magnifier" style={this.iconStyle}></i>
						</span>
					</p>
				</form>
				<hr/>
			</div>
		)
	}
}

export default SearchComponent