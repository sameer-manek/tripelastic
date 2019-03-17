import React, { Component } from 'react'

class CreateContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: "",
			detail: "",
			parent: "",
			start: "",
			end: "",
			category: "trip",
		}
	}

	render() {
		return (
			<h1 className="subtitle">
				create new trip container
				{/* form */}
			</h1>
		)
	}
}

export default CreateContainer