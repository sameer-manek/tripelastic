import React, { Component } from 'react'

import Comment from './Comment'

class SelectedPost extends Component {
	constructor (props) {
		super(props)

		this.state = {
			post: null
		}
	}

	render() {
		let buttons
		if(this.props.post.editable){
			buttons = (<span className="level-right"><button className="button has-icon" style={{ borderColor: "red" }}>
					<i className="icon lnr lnr-trash" style={{ color: "red" }}></i>
				</button>
				&nbsp;
				<button className="button has-icon" style={{ borderColor: "blue" }}>
					<i className="icon lnr lnr-pencil" style={{ color: "blue" }}></i>
				</button></span>)
		}
		return (
			<div>
				<div className="header">
					<div className="level">
						<span className="level-left" style={{ fontWeight: 900, fontSize: "14px" }}>{this.props.post.user.username}</span>
						{buttons}
					</div>
					<br/>
					<div className="body">
						<p className="subtitle">{this.props.post.title}</p>
						<p>{this.props.post.content}</p>
						<hr/>
						<span className="level">
							<span className="level-left">
								<i className="icon lnr lnr-thumbs-up" style={{ fontSize: "16px", cursor: "pointer", color: "skyblue" }}></i>
								&nbsp;
								<span>{this.props.post.votes}</span>
								&nbsp;
								<i className="icon lnr lnr-thumbs-down" style={{ fontSize: "16px", cursor: "pointer", color: "orange" }}></i>
							</span>
							<button className="button has-icon level-right">
								<i className="icon lnr lnr-mic"></i> &nbsp; Comment
							</button>
						</span>
						<hr/>
						<p className="menu-label">Comments</p>
						{this.props.post.comments.map(comment => <Comment key={comment.id} data={comment} />)}
					</div>
				</div>
			</div>
		)
	}
}

export default SelectedPost