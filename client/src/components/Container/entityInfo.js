import React, { Component } from 'react'
import axios from 'axios'

class EntityInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: this.props.data.name,
			type: this.props.data.type,
			detail: {
				id: this.props.data.detail
			},
			start: this.props.data.start,
			end: this.props.data.end,
			mode: "browse"
		}

		this.toggleMode = this.toggleMode.bind(this)
	}

	// toggleMode() {
	// 	console.log(this.state.mode)
	// }

	// onUpdateEvent(e) {
	// 	e.preventDefault()
	// 	return false
	// }

	render() {

		let footer
		let content

		if(this.state.mode === "update") {
			footer = (
				<footer className="modal-card-foot">
					<button type="button" className="button is-info is-outlined" onClick={this.onUpdateEvent}>Update</button>
					<button type="button" className="button is-danger is-outlined" onClick={this.props.closeModal}>Cancel</button>
				</footer>
			)
		}

		if(this.state.mode === "browse") {
			footer = (
				<footer className="modal-card-foot">
					<button type="button" className="button is-danger is-outlined" onClick={this.props.closeModal}>Close</button>
				</footer>
			)
		}

		return (
			<div className="modal is-active">
				<div className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">Add new Entity</p>
					</header>
					<section className="modal-card-body">
						{content}
					</section>
					{footer}
				</div>
			</div>
		)
	}
}

export default EntityInfo