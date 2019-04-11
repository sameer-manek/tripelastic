import React, { Component } from 'react'

function Comment(props) {
	let children
	if (props.data.children && props.data.children !== null) {
		children = props.data.children.map(child => <Comment key={child.id} data={child} />)
	}
	return (
		<article className="card is-dark" style={{ margin: "10px 0 0 20px", padding: "10px", borderLeft: "1px solid black" }}>
			<b>{props.data.user.username}</b>
			<br/>
			<div className="card-body">{props.data.content}</div>
			<span className="level-right"> 
				<i className="button lnr lnr-pencil" style={{ color: "grey", cursor: "pointer", fontSize: "11px", fontStyle: "normal" }}></i>
				&nbsp;&nbsp;
				<i className="button lnr lnr-trash" style={{ color: "grey", cursor: "pointer", fontSize: "11px", fontStyle: "normal" }}></i>
			</span>
		</article>
	)
}

export default Comment