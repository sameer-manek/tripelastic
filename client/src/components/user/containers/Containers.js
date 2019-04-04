import React, {Component} from 'react'

import Container from "./Container"

class Containers extends Component{
	constructor(props) {
		super(props)

		this.state = {
			containers: this.props.containers,
			category: this.props.category,
			search: this.props.searchQuery,
			loading: false,
		}

		this.filterContainers = this.filterContainers.bind(this)
		this.removeContainer = this.removeContainer.bind(this)
	}

	removeContainer(cid) {
		console.log(cid)
		this.setState({
			containers: this.state.containers.filter(({id}) => {return id !== cid})
		})
	}

	filterContainers(array, prop, value) {
		let result = []
		if (prop === "category" && value === "all") {
			return array
		}
		for (let i = 0; i < array.length; i++) {
			if (array[i][prop] === value) {
				result.push(array[i])
			}
		}
		return result
	}

	componentDidMount() {
		this.setState(prevState => {
			containers: this.filterContainers(prevState.containers, "category", prevState.category)
		})
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			category: newProps.category,
			containers: newProps.containers
		})
	}

	marginStyle = {
		display: "block",
		margin: "10px 0"
	}

	render() {
		return (
			<div style={this.marginStyle}>
			<hr/>
				<h1 className="subtitle">{this.state.category}</h1>

				{this.filterContainers(this.state.containers, "category", this.state.category).map(container => {
					return (<Container
						key={container.id}
						data={container}
						deleteContainer={this.props.deleteContainer}
						removeContainer={this.removeContainer}
					/>)
				})}
			</div>
		)
	}
}

export default Containers