import React from 'react'

export const ProfileMenu = function(props) {
	return (
		<aside className="menu">
			<p className="menu-label">
				Profile Options
			</p>

			<ul className="menu-list">
				<li>
					<a onClick={() => props.toggle("info")}>User Info</a>
				</li>
				<li>
					<a onClick={() => props.toggle("contact")}>Contact Info</a>
				</li>
				<li>
					<a onClick={() => props.toggle("password")}>Change Password</a>
				</li>
			</ul>
		</aside>
	)
}

export const TripsMenu = function (props) {
	return (
		<aside className="menu">
			<p className="menu-label">
				Profile Options
			</p>

			<ul className="menu-list">
				<li>
					<a onClick={() => props.toggle("all")}>All</a>
				</li>
				<li>
					<a onClick={() => props.toggle("trips")}>Trips</a>
				</li>
				<li>
					<a onClick={() => props.toggle("blueprints")}>Bluprints</a>
				</li>
			</ul>
		</aside>
	)
}