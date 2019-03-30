import React, { Component } from 'react'

function Comment(props) {
	let children
	if (props.data.children && props.data.children !== null) {
		children = props.data.children.map(child => <Comment key={child.id} data={child} />)
	}
	return (
		<article className="message is-dark" style={{ marginLeft: "20px", borderLeft: "1px solid black" }}>
			<div className="message-header">{props.data.user.username}</div>
			<div className="message-body">{props.data.content}</div>
			{children}
		</article>
	)
}

export default Comment