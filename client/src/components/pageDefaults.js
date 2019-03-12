import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from '../assets/styles/pageDefaults.css'

export function HeroComponent() {
	return (
		<div className="hero">
			<div className="hero-body">
				<div className="container">
					<div className="level">
						<div>
							<h1 className="title">Tripelastic</h1>
							<h3 className="subtitle">A custom trip planner</h3>
						</div>
						<ul className="level">
							<li>
								<Link to="/login" className="button is-small is-warning">Login</Link>
							</li>
							<li>
								<Link to="/register" className="button is-small is-success">Register</Link>
							</li>
							<li>
								<Link to="/" className="button is-small is-info">About us</Link>
							</li>
						</ul>
					</div>
					<hr/>
				</div>
			</div>
		</div>
	)
}