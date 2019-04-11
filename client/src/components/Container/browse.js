import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import axios from 'axios'

import Bar from '../user/bar'
import AddEntityModal from './addEntity'

function Entity (props) {

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
		  	<Link to={{
		  		pathname: "/entity",
		  		data: props.data
		  	}} className="card-footer-item">Info</Link>
		    <a href="#" className="card-footer-item">Edit</a>
		    <span className="card-footer-item" style={{ cursor: "pointer", color: "red" }} onClick={() => props.deleteEntity(props.data.id)}>Delete</span>
		  </footer>
		</div>
	)

}

class browseContainerComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			mode: "browse",
			updating: false,
			data: this.props.location.state.data,
			error: {
				state: false,
				message: ""
			},
			success: {
				state: false,
				message: ""
			},
			modal: {
				show: false,
				component: null
			}
		}

		this.toggleMode = this.toggleMode.bind(this)
		this.handleInputEvent = this.handleInputEvent.bind(this)
		this.handleUpdateEvent = this.handleUpdateEvent.bind(this)
		this.deleteContainer = this.deleteContainer.bind(this)
		this.closeModal = this.closeModal.bind(this)
		this.onAddEntity = this.onAddEntity.bind(this)
		this.passEntity = this.passEntity.bind(this)
		this.deleteEntity = this.deleteEntity.bind(this)
	}

	componentWillReceiveProps(newProps) {
		this.setState(newProps.location.state)
	}

	async deleteEntity(eid) {
		let query = `mutation {
			deleteEntity(token: "`+ sessionStorage.token +`", id: "`+ eid +`") {
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
		}).then(({data}) => {
			data = data.data.deleteEntity

			if(data.success === true) {

				let stateData = this.state.data
				stateData.entities = stateData.entities.filter(({ id }) => {
					return id !== eid
				})

				this.setState({
					data: stateData
				})
			}
		})
	}

	async deleteContainer() {
		let query = `mutation{
		  deleteContainer(token: "`+ sessionStorage.token +`", containerId: "`+ this.state.data.id +`"){
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
		}).then (({data}) => {
			
			data = data.data.deleteContainer
			if(data.success === true) {
				this.setState({
					back: true
				})
			}
		}).catch(err => console.log(err))
	}

	toggleMode() {
		if(this.state.mode === "edit") {
			let data = Object.assign({}, this.state.data)
			data.name = this.props.location.state.data.name
			data.detail = this.props.location.state.data.detail
			this.setState({
				data,
				mode: "browse"
			})
		} else {
			this.setState({
				mode: "edit"
			})
		}
	}

	onAddEntity() {
		let modal = Object.assign({}, this.state.modal)
		modal.show = true
		modal.component = <AddEntityModal 
			closeModal={this.closeModal} 
			category={this.state.data.category} 
			containerId = {this.state.data.id}
			passEntity = {this.passEntity}
		/>
		this.setState({
			modal
		})
	}

	closeModal() {
		let modal = Object.assign({}, this.state.modal)
		modal.show = false
		modal.component = null
		this.setState({
			modal
		})
	}

	handleInputEvent(e) {
		let data = Object.assign({}, this.state.data)
		switch (e.target.id) {
			case "containerName":
				data.name = e.target.value
				this.setState({
					data
				})
				/*
					OR..
					this.setState(prevState => {
						... prevState,
						name: x,
						detail: y
					})
				*/
			break
				
			case "containerDetail":
				data.detail = e.target.value
				this.setState({
					data
				})
			break

			default:
				return false
			break
		}
	}

	async handleUpdateEvent() {
		if(this.state.data.name === "" || this.state.data.detail === "") {
			return this.setState({
				error: {
					state: true,
					message: "all fields are requied",
				}
			})
		}
		
		let query = `mutation{
		  updateContainer(token: "`+ sessionStorage.token +`", containerId: "`+ this.state.data.id +`", name: "`+ this.state.data.name +`", detail: "`+ this.state.data.detail +`") {
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
			data = data.data.updateContainer
			if (data.success === true) {
				this.setState({
					mode: "browse",
					success: {
						state: true,
						message: "updated the container info"
					}
				})
			} else {
				console.log("the container could not be updated")
			}
		}).catch(err => console.log(err))
	}

	passEntity(entity) {
		console.log("PASSING")
		let data = this.state.data
		data.entities.push(entity)
		this.setState({
			data
		})
		return
	}

	render() {
		if (this.state.back === true) {
			return (<Redirect to={{
				pathname: this.props.location.state.url
			}} />)
		}

		let modal

		if (this.state.modal.show === true) {
			modal = this.state.modal.component
		}

		let data = this.state.data
		let nameField = (<div className="control">
			<label className="label">Name</label>
			<div className="field">
				{data.name}
			</div>
		</div>), 
		detailField = (<div className="control">
			<label className="label">Details</label>
			<div className="field">
				{data.detail}
			</div>
		</div>),
		blankContainer,
		editButton = (
			<button className="button" onClick={this.toggleMode}>
				<i className="icon lnr lnr-pencil"></i>
			</button>
		)

		if(this.state.mode === "edit") {
			nameField = (
				<div className="control">
					<label className="label">Name</label>
					<div className="field">
						<input type="text" className="input" placeholder="Name of container" defaultValue={data.name} id="containerName" onChange={this.handleInputEvent} />
					</div>
				</div>
			)

			detailField = (
				<div className="control">
					<label className="label">Details</label>
					<div className="field">
						<textarea rows="5" className="textarea" defaultValue={data.detail} placeholder="describe the container" id="containerDetail" onChange={this.handleInputEvent} ></textarea>
					</div>
				</div>
			)

			blankContainer = (
				<div className="control">
					<button className="button is-info" onClick={this.handleUpdateEvent}>Update</button>
					&nbsp;
					<button className="button is-danger is-outlined" onClick={this.toggleMode}>Cancel</button>
				</div>
			)

			if (this.state.updating === true) {
				blankContainer = (
					<div className="control">
						<button className="button is-info is-loading">Update</button>
					</div>
				)
			}
			editButton = null
		}

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
							{editButton}
							&nbsp;
							<button className="button" onClick={this.deleteContainer}>
								<i className="icon lnr lnr-trash"></i>
							</button>
						</span>
					</div>

					<div className="container-body columns">
						<div className="column is-one-half">
							<p className="menu-label">Entities</p>
							{data.entities.map(entity => { if(entity.id) { return (<div><Entity data={entity} key={entity.id} deleteEntity={this.deleteEntity} /> <br/></div>) } })}
							<div className="level">
								<button className="button is-info is-outlined level-item" onClick={this.onAddEntity}>
									<i className="icon lnr lnr-plus-circle"></i>&nbsp; Add Entity
								</button>
							</div>
						</div>
						<div className="column is-one-half">
							<p className="menu-label">{data.category} details</p>
							<div>
								{nameField}
								<br/>
								{detailField}
								<br/>
								{blankContainer}
							</div>
						</div>
					</div>
				</div>
				{modal}
			</div>
		)
	}
}

export default browseContainerComponent