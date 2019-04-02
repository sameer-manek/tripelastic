import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import axios from 'axios'

import "react-datepicker/dist/react-datepicker.css";

class AddEntityModal extends Component {
	constructor(props) {
		super(props)

		this.state = {
			category: this.props.category,
			name: "",
			type: "transport",
			start: new Date(),
			end: new Date(),
			transport: {
				type: "",
				pickupAddress: "",
				pickupCity: "",
				pickupCountry: "",
				pickupPincode: null,
				pickupLocation: "",
				pickupAddress: "",
				pickupCity: "",
				pickupCountry: "",
				pickupPincode: null,
				pickupLocation: "",
				bookingId: "",
				seat: "",
				vehicleId: ""

			},
			hotel: {
				address: "",
				userId: "",
				city: "",
				country: "",
				pincode: null,
				location: "",
				room: ""
			},
			destination: {
				address: "",
				userId: "",
				city: "",
				country: "",
				pincode: null,
				location: "",
			}
		}

		this.handleEndDateChange = this.handleEndDateChange.bind(this)
		this.handleStartDateChange = this.handleStartDateChange.bind(this)
		this.handleNameInput = this.handleNameInput.bind(this)
		this.handleTypeChange = this.handleTypeChange.bind(this)
		this.onSaveEvent = this.onSaveEvent.bind(this)
	}

	handleHotelInput(e) {
		let hotel = this.state.hotel
		switch(e.target.id) {
			case "address":
				hotel.address = e.target.id
				this.setState({
					hotel
				})
			break
			case "city":
				hotel.city = e.target.id
				this.setState({
					hotel
				})
			break
			case "country":
				hotel.country = e.target.id
				this.setState({
					hotel
				})
			break
			case "pincode":
				hotel.pincode = e.target.id
				this.setState({
					hotel
				})
			break
			case "location":
				hotel.location = e.target.id
				this.setState({
					hotel
				})
			break
			case "room":
				hotel.room = e.target.id
				this.setState({
					hotel
				})
			break
			default:
				return
		}
	}

	handleDestinationInput(e) {
		let destination = this.state.destination
		switch(e.target.id) {
			case "address":
				destination.address = e.target.id
				this.setState({
					destination
				})
			break
			case "city":
				destination.city = e.target.id
				this.setState({
					destination
				})
			break
			case "country":
				destination.country = e.target.id
				this.setState({
					destination
				})
			break
			case "pincode":
				destination.pincode = e.target.id
				this.setState({
					destination
				})
			break
			case "location":
				destination.location = e.target.id
				this.setState({
					destination
				})
			break
			default:
				return
		}
	}

	handleTransportInput(e) {
		let transport = this.state.transport
		switch(e.traget.id) {
			case "type":
				transport.type = e.target.value
				this.setState({
					transport
				})
			break
			case "pickupAddress":
				transport.pickupAddress = e.target.value
				this.setState({
					transport
				})
			break
			case "pickupCity":
				transport.pickupCity = e.target.value
				this.setState({
					transport
				})
			break
			case "pickupCountry":
				transport.pickupCountry = e.target.value
				this.setState({
					transport
				})
			break
			case "pickupPincode":
				transport.pickupPincode = e.target.value
				this.setState({
					transport
				})
			break
			case "pickupLocation":
				transport.pickupLocation = e.target.value
				this.setState({
					transport
				})
			break
			case "dropAddress":
				transport.dropAddress = e.target.value
				this.setState({
					transport
				})
			break
			case "dropCity":
				transport.dropCity = e.target.value
				this.setState({
					transport
				})
			break
			case "dropCountry":
				transport.dropCountry = e.target.value
				this.setState({
					transport
				})
			break
			case "dropPincode":
				transport.dropPincode = e.target.value
				this.setState({
					transport
				})
			break
			case "dropLocation":
				transport.dropLocation = e.target.value
				this.setState({
					transport
				})
			break
			case "bookingId":
				transport.bookingId = e.target.value
				this.setState({
					transport
				})
			break
			case "seat":
				transport.seat = e.target.value
				this.setState({
					transport
				})
			break
			case "vehicleId":
				transport.vehicleId = e.target.value
				this.setState({
					transport
				})
			break
		}

	}

	componentDidMount() {
		if (this.state.category === "blueprint") {
			this.setState({
				start: null,
				end: null
			})
		}
	}

	handleEndDateChange(date) {
		this.setState({
			end: date
		})
	}

	handleStartDateChange(date) {
		this.setState({
			start: date
		})
	}

	handleNameInput(e) {
		this.setState({
			name: e.target.value,
			error: null
		})
	}

	handleTypeChange(e) {
		this.setState({
			type: e.target.value,
			error: null
		})
	}

	async onSaveEvent(e) {
		e.preventDefault()
		// validation

		let state = this.state

		// queries
		let hotelQuery = `mutation {
		  createHotel(token: "`+ sessionStorage.token +`", address: "`+ state.hotel.address +`", city: "`+ state.hotel.city +`", country: "`+ state.hotel.country +`", pincode: `+ parseInt(state.hotel.pincode) +`, location: "`+ state.hotel.location +`", room:"`+ state.hotel.room +`") {
		    id
		  }
		}`

		let destinationQuery = `mutation {
		  createHotel(token: "`+ sessionStorage.token +`", address: "`+ state.destination.address +`", city: "`+ state.destination.city +`", country: "`+ state.destination.country +`", pincode: `+ parseInt(state.destination.pincode) +`, location: "`+ state.destination.location +`") {
		    id
		  }
		}`

		let transportQuery = `mutation {
		  createHotel(token: "`+ sessionStorage.token +`", type: "`+ state.transport.type +`", pickupAddress: "`+ state.transport.pickupAddress +`", pickupCity: "`+ state.transport.pickupCity +`", pickupCountry: "`+ state.transport.pickupCountry +`", pickupPincode: `+ parseInt(state.transport.pickupPincode) +`, pickupLocation: "`+ state.transport.pickupLocation +`", dropAddress: "`+ state.transport.dropAddress +`", dropCity: "`+ state.transport.dropCity +`", dropCountry: "`+ state.transport.dropCountry +`", dropPincode: `+ parseInt(state.transport.dropPincode) +`, dropLocation: "`+ state.transport.dropLocation +`", seat: "`+ state.transport.seat +`", bookingId: "`+ state.transport.bookingId +`", vehicleId: "`+ state.transport.vehicleId +`") {
		    id
		  }
		}`

		if(state.name === "" || state.type === "" || state.detail === "") {
			this.setState({
				error: "Please fill up all the fields"
			})
		}
		let detail = null
		if(state.category === "trip" && state.type === "hotel"){
			console.log("HOTEL")
			let hotel = state.hotel
			if(hotel.address === "" || hotel.city === "" || hotel.country === "") {
				this.setState({
					error: "Please fill up all the fields"
				})
			}
			await axios({
				url: "http://localhost:4000/api",
				method: "post",
				data: {
					hotelQuery
				}
			}).then(({ data }) => {
				console.log("TYPE", data)
				data = data.data.createHotel
				detail = data.id
			}).catch(err => console.log(err))
		}

		if(state.category === "trip" && state.type === "destination"){
			console.log("DEST", destinationQuery)
			let destination = state.destination
			if(destination.address === "" || destination.city === "" || destination.country === "") {
				this.setState({
					error: "Please fill up all the fields"
				})
			}
			await axios({
				url: "http://localhost:4000/api",
				method: "post",
				data: {
					destinationQuery
				}
			}).then(({ data }) => {
				console.log("TYPE", data)
				data = data.data.createDestination
				detail = data.id
			}).catch(err => console.log(err))
		}

		if(state.category === "trip" && state.type === "transport"){
			console.log("TRANS")
			let transport = state.transport
			if(transport.pickupAddress === "" || transport.pickupCity === "" || transport.pickupCountry === "" || transport.dropAddress === "" || transport.dropCity === "" || transport.dropCountry === "") {
				this.setState({
					error: "Please fill up all the fields"
				})
			}
			await axios({
				url: "http://localhost:4000/api",
				method: "post",
				data: {
					transportQuery
				}
			}).then(({ data }) => {
				console.log("TYPE", data)
				data = data.data.createTransport
				detail = data.id
			}).catch(err => console.log(err))
		}
		// upload data
		

		let query = `mutation {
		  createEntity(token: "`+ sessionStorage.token +`", containerId: "`+ this.props.containerId +`", name: "`+ this.state.name +`", type: "`+ this.state.type +`", start: "`+ this.state.start +`", end: "`+ this.state.end +`", detail: "`+ detail +`") {
		    id,
		    name,
		    type,
		    start,
		    end
		  }
		}`

		let entity

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({data}) => {
			console.log("DATA", data)
			data = data.data.createEntity
			// put entity in state
			entity = {
				id: data.id,
				name: data.name,
				type: data.type
			}
		}).catch(err => console.log(err))
		this.props.passEntity(entity)
		this.props.closeModal()
		return
	}

	render() {
		let datepickers
		let typeForm
		let error
		if(this.state.error) {
			error = <article className="message is-danger"><p className="message-body">{this.state.error}</p></article>
		}
		if(this.state.category === "trip") {
			switch (this.state.type) {
				case "transport":
					typeForm = (
						<div>
						<hr />
						<div className="control">
							<label className="label">Type</label>
							<div className="field">
								<select id="type" className="input select">
									<option value="plane">Air Plane</option>
									<option value="train">Train (IRCTC)</option>
									<option value="bus">Bus</option>
									<option value="car">Car</option>
									<option value="ship">Ship / cruise</option>
								</select>
							</div>
							<br/>
						</div>
						<p className="menu-label">transport pickup details</p>
						<div className="control">
							<label className="label">*pickup address</label>
							<div className="field">
								<input type="text" className="input" id="pickupAddress"/>
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">*pickup city</label>
							<div className="field">
								<input type="text" className="input" id="pickupCity" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">*pickup country</label>
							<div className="field">
								<input type="text" className="input" id="pickupCountry" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">pickup pincode</label>
							<div className="field">
								<input type="text" className="input" id="pickupPincode" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">pickup location (google maps link)</label>
							<div className="field">
								<input type="text" className="input" id="pickupLocation" />
							</div>
						</div>
						<br/>
						<p className="menu-label">transport drop details</p>
						<div className="control">
							<label className="label">*drop address</label>
							<div className="field">
								<input type="text" className="input" id="dropAddress"/>
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">*drop city</label>
							<div className="field">
								<input type="text" className="input" id="dropCity" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">*drop country</label>
							<div className="field">
								<input type="text" className="input" id="dropCountry" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">drop pincode</label>
							<div className="field">
								<input type="text" className="input" id="dropPincode" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">drop location (google maps link)</label>
							<div className="field">
								<input type="text" className="input" id="dropLocation" />
							</div>
						</div>
						<br/>
						<p className="menu-label">Generic details</p>
						<div className="control">
							<label className="label">booking id</label>
							<div className="field">
								<input type="text" className="input" id="bookingId" />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">seat</label>
							<div className="field">
								<input type="text" className="input" id="seat" />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Vehicle Identification (train number or bus number)</label>
							<div className="field">
								<input type="text" className="input" id="vehicleId" />
							</div>
						</div>
						<br/>
						</div>
					)
				break

				case "hotel":
					typeForm = (
						<div>
						<hr/>
						<p className="menu-label">Hotel details</p>
						<div className="control">
							<label className="label">Address</label>
							<div className="field">
								<input type="text" className="input" id="address" />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">city</label>
							<div className="field">
								<input type="text" className="input" id="city" />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">country</label>
							<div className="field">
								<input type="text" className="input" id="country" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">pincode</label>
							<div className="field">
								<input type="text" className="input" id="pincode" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">location</label>
							<div className="field">
								<input type="text" className="input" id="location" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">room number</label>
							<div className="field">
								<input type="text" className="input" id="room" />
							</div>
						</div>
						<br/>
						</div>
					)
				break

				case "destination":
					typeForm = (
						<div>
						<hr/>
						<p className="menu-label">Destination details</p>
						<div className="control">
							<label className="label">Address</label>
							<div className="field">
								<input type="text" className="input" id="address" />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">city</label>
							<div className="field">
								<input type="text" className="input" id="city" />
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">country</label>
							<div className="field">
								<input type="text" className="input" id="country" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">pincode</label>
							<div className="field">
								<input type="text" className="input" id="pincode" />
							</div>
						</div>
						<br/>

						<div className="control">
							<label className="label">location</label>
							<div className="field">
								<input type="text" className="input" id="location" />
							</div>
						</div>
						<br/>
						</div>
					)
				break

				default:
					return
			}
			datepickers = (
				<div>
					<div className="control">
						<label className="label">Start Date</label>
						<div className="field">
							<DatePicker
							  selected={this.state.start}
							  onChange={this.handleStartDateChange}
							  showTimeSelect
							  dateFormat="Pp"
							  className="input"
							/>
						</div>
					</div>
					<br/>
					<div className="control">
						<label className="label">End Date</label>
						<div className="field">
							<DatePicker
							  selected={this.state.end}
							  onChange={this.handleEndDateChange}
							  showTimeSelect
							  dateFormat="Pp"
							  className="input"
							/>
						</div>
					</div>
				</div>
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
						{error}
						<form>
							<div className="control">
								<label className="label">Name</label>
								<div className="field">
									<input type="text" className="input" onChange={this.handleNameInput} placeholder="name of the place / media / stay" />
								</div>
							</div>
							<br/>
							<div className="control">
								<label className="label">Type</label>
								<div className="field">
									<select className="select input" onChange={this.handleTypeChange}>
										<option value="transport">transport</option>
										<option value="hotel">hotel</option>
										<option value="destination">destination</option>
									</select>
								</div>
							</div>
							<br/>
							{datepickers}
							{typeForm}
						</form>
					</section>
					<footer className="modal-card-foot">
						<button className="button is-info is-outlined" onClick={this.onSaveEvent}>Submit</button>
						<button className="button is-danger is-outlined" onClick={this.props.closeModal}>Cancel</button>
					</footer>
				</div>
			</div>
		)
	}
}

export default AddEntityModal