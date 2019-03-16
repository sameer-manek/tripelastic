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
							<li className="bar-list">
								<Link to="/login" className="link">Login</Link>
							</li>
							<li className="bar-list">
								<Link to="/register" className="link">Register</Link>
							</li>
							<li className="bar-list">
								<Link to="/" className="link">About Tripelastic</Link>
							</li>
						</ul>
					</div>
					<hr/>
				</div>
			</div>
		</div>
	)
}