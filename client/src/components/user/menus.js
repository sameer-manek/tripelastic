import React from 'react'

const blue = "#3895D3"
const orange = "#FF4500"

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
				Container Options
			</p>

			<ul className="menu-list">
				<li>
					<a onClick={() => props.toggle("all")} className="has-icon"><i className="icon lnr lnr-plus-circle" style={{ color: "red", fontWeight: "900" }}></i> All</a>
				</li>
				<li>
					<a onClick={() => props.toggle("trips")} className="has-icon"><i className="icon lnr lnr-bus" style={{ color: "orange", fontWeight: "900" }}></i> Trips</a>
				</li>
				<li>
					<a onClick={() => props.toggle("blueprints")} className="has-icon"><i className="icon lnr lnr-map" style={{ color: blue, fontWeight: "900" }}></i> Blueprints</a>
				</li>
				<li>
					<a onClick={() => props.toggle("create")} className="has-icon"><i className="icon lnr lnr-plus-circle" style={{ color: "limegreen", fontWeight: "900" }}></i> new container</a>
				</li>
			</ul>
		</aside>
	)
}