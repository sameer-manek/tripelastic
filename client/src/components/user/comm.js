import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Bar from './bar'
import {PostsMenu} from './menus'


function mapStateToProps(state) {
	return {
		user: state.user
	}
}

const columnBorder = {
	borderRight: '1px solid #CCC'
}

class Comm extends Component {
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

	render() {
		return (
			<div>
				<Bar constrained />
				<hr/>
				<div className="columns" style={{padding: "0 20px"}}>
					<div className="column is-one-fifth">
						<PostsMenu toggle={this.toggleSelected} />
					</div>
					<div className="column is-four-fifths">
						<div className="columns">
							<div className="column is-one-third">
								hello
							</div>
							<div className="column is-two-thirds">
								world
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps)(Comm)