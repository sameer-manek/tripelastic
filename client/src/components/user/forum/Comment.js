import React, { Component } from 'react'

function Comment(props) {
	let children
	if (props.data.children && props.data.children !== null) {
		children = props.data.children.map(child => <Comment key={child.id} data={child} />)
	}
	return (
		<article className="card is-dark" style={{ marginLeft: "20px", padding: "10px", borderLeft: "1px solid black" }}>
			<b>{props.data.user.username}</b>
			<br/>
			<div className="card-body">{props.data.content}</div>
			{children}
		</article>
	)
}

export default Comment