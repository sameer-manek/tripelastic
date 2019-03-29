import React, { Component } from 'react'


class browseContainerComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			name: "random"
		}
	}

	componentDidMount() {
		this.setState(this.props.location.state)
	}

	render() {
		return (
			<div>
				<h1 className="title">{this.state.id}</h1>
			</div>
		)
	}
}

export default browseContainerComponent