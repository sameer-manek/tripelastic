import React, { Component } from 'react'

import axios from 'axios'

class CreateContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: "",
			detail: "",
			start: "",
			end: "",
			category: "trip",
			error: {
				state: false,
				message: ""
			}
		}

		this.handleInputEvent = this.handleInputEvent.bind(this)
		this.handleClickEvent = this.handleClickEvent.bind(this)
	}

	handleInputEvent(e) {
		switch (e.target.id) {
			case "name":
				this.setState({
					name: e.target.value
				})
			break

			case "detail":
				this.setState({
					detail: e.target.value
				})
			break

			case "start":
				this.setState({
					start: e.target.value
				})
			break

			case "end":
				this.setState({
					end: e.target.value
				})
			break

			case "category":
				this.setState({
					category: e.target.value
				})
			break

			default: 
			break
		}
	}

	async handleClickEvent(e) {
		e.preventDefault()

		if (this.state.name == "", this.state.detail == "") {
			return this.setState({
				error: {
					state: true,
					message: "name and detail fields are mandatory"
				}
			})
		}

		let query = `mutation {
			createContainer (token: "`+ sessionStorage.token +`", name: "`+ this.state.name +`", detail:"`+ this.state.detail +`", parentContainer: "`+ this.props.inherit +`", start: "`+ this.state.start +`", end: "`+ this.state.end +`", category: "`+ this.state.category +`"){
				id
			}
		}`

		console.log(query)

		return await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			console.log("ADDED CONTAINER", data)
		}).catch(err => console.log(err))
	}

	render() {
		let error
		if (this.state.error.state === true) {
			error = <div className="message is-danger">{this.state.error.message}</div>
		}
		return (
			<div>
				<h1 className="subtitle">Create new trip container</h1>
				<form>
					{error}
					<div className="control">
						<label htmlFor="" className="label">Name</label>
						<div className="field">
							<input type="text" id="name" className="input" placeholder="name of the container" onChange={this.handleInputEvent} />
						</div>
					</div>
					<br/>
					<div className="control">
						<label htmlFor="" className="label">details</label>
						<div className="field">
							<textarea id="detail" cols="30" rows="3" className="textarea" placeholder="some details about the container" onChange={this.handleInputEvent} ></textarea>
						</div>
					</div>
					<br/>
					<div className="control">
						<label htmlFor="" className="label">when do we start?</label>
						<div className="field">
							<input type="datetime-local" className="input" id="start" placeholder="you may leave it blank to decide later" onChange={this.handleInputEvent} />
						</div>
					</div>
					<br/>
					<div className="control">
						<label htmlFor="" className="label">when do we end?</label>
						<div className="field">
							<input type="datetime-local" className="input" id="end" placeholder="you may leave it blank to decide later" onChange={this.handleInputEvent} />
						</div>
					</div>
					<br/>
					<div className="control">
						<label htmlFor="" className="label">This is what?</label>
						<div className="field">
							<select className="select input" id="category" onChange={this.handleInputEvent} >
								<option value="trip">Trip</option>
								<option value="blueprint">Blueprint</option>
							</select>
						</div>
					</div>
					<br/>

					<button type="submit" onClick={this.handleClickEvent} className="button is-info">Create Container</button>
				</form>
			</div>
		)
	}
}

export default CreateContainer