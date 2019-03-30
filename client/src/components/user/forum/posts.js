import React, { Component } from 'react'

class Post extends Component {
	constructor(props) {
		super(props) 
	}

	render() {
		let deleteButton
		let str = this.props.post.content
		if(str.length > 32) str = str.substring(0,10)+'...'
		return (
			<article className="message is-info" style={{ cursor: "pointer" }} onClick={() => this.props.selectPost(this.props.post)}>
				<div className="message-header">
					<p>{this.props.post.user.username}</p>
					{deleteButton}
				</div>
				<div className="message-body">
					<b>{this.props.post.title}</b>
					<br/>
					{str}
				</div>
			</article>
		)
	}
}

export default Post