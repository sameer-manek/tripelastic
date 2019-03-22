import React, { Component } from 'react'
import ReactLoading from 'react-loading'

const Loader = ({ type, color }) => (
	<div className="has-text-centered" style={{ height: "200px", width: "200px", display: "block", padding: "40px 20px", margin: "0 auto" }}>
		<div style={{ display: "block", margin: "0 auto", width: "41px", height: "70px", padding: "2px" }}><ReactLoading type={type} color={color} height={66} width={37} /></div>
		<span>Loading, please wait</span>
	</div>
)

export default Loader