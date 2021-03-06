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
					<a onClick={() => props.toggle("info")} className="has-icon"><i className="icon lnr lnr-paperclip" style={{ color: "skyblue", fontWeight: "900" }}></i> User Info</a>
				</li>
				<li>
					<a onClick={() => props.toggle("contact")} className="has-icon"><i className="icon lnr lnr-laptop-phone" style={{ color: "limegreen", fontWeight: "900" }}></i> Contact Info</a>
				</li>
				<li>
					<a onClick={() => props.toggle("password")} className="has-icon"><i className="icon lnr lnr-lock" style={{ color: "red", fontWeight: "900" }}></i> Change Password</a>
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
					<a onClick={() => props.toggle("trip")} className="has-icon"><i className="icon lnr lnr-bus" style={{ color: "orange", fontWeight: "900" }}></i> Trips</a>
				</li>
				<li>
					<a onClick={() => props.toggle("blueprint")} className="has-icon"><i className="icon lnr lnr-map" style={{ color: blue, fontWeight: "900" }}></i> Blueprints</a>
				</li>
				<li>
					<a onClick={() => props.toggle("create")} className="has-icon"><i className="icon lnr lnr-plus-circle" style={{ color: "limegreen", fontWeight: "900" }}></i> new container</a>
				</li>
			</ul>
		</aside>
	)
}

export const PostsMenu = function (props) {
	return (
		<aside className="menu">
			<p className="menu-label">
				Container Options
			</p>

			<ul className="menu-list">
				<li>
					<a onClick={() => props.toggle("all")} className="has-icon"><i className="icon lnr lnr-layers" style={{ color: "skyblue", fontWeight: "900" }}></i> All posts</a>
				</li>
				<li>
					<a onClick={() => props.toggle("my")} className="has-icon"><i className="icon lnr lnr-highlight" style={{ color: "gold", fontWeight: "900" }}></i> My posts</a>
				</li>
			</ul>
		</aside>
	)
}