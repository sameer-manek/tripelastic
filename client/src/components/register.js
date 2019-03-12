import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import{ HeroComponent } from './pageDefaults'

import styles from '../assets/styles/login.css'

export default class RegisterComponent extends Component {

	constructor (props) {
		super(props)

		this.state = {
			
			username: "",
			email: "",
			password: "",
			error: {
				state: false,
				username: null,
				password: null,
				email: null
			}

		}
	}

	render() {
		return(
			<div>
				<HeroComponent />

				<div className="box login-box">

					<form className="form">
						<div className="control">
							<label className="label">Username</label>
							<div className="field">
								<input type="text" id="username" className="input"/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Email</label>
							<div className="field">
								<input type="text" id="username" className="input"/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Password</label>
							<div className="field">
								<input type="password" id="password" className="input"/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<label className="label">Confirm Password</label>
							<div className="field">
								<input type="password" id="username" className="input"/>
								<br/>
								<i className="error"></i>
							</div>
						</div>
						<br/>
						<div className="control">
							<div className="field">
								<button className="button is-primary">Login</button>
							</div>
						</div>
					</form>

				</div>
			</div>
		)
	}
}