import React, { Component } from 'react'

import Comment from './Comment'

class CommentFormComponent extends Component {

	constructor(props) {
		super(props) 

		this.state = {
			content: "",
		}

		this.changeContentEvent = this.changeContentEvent.bind(this)
		this.sendRequest = this.sendRequest.bind(this)
	}

	changeContentEvent(e) {
		this.setState({
			content: e.target.value
		})
	}

	async sendRequest(e) {
		e.preventDefault()

		this.setState({
			content: ""
		})

		this.props.postComment({ content: this.state.content, postId: this.props.postId })
	}

	render() {
		return(
			<div className="card" style={{ margin: "10px 0 0 20px", padding: "10px" }}>
				<div className="control">
					<div className="field">
						<textarea rows="2" className="input textarea" placeholder="post your comment here" onChange={this.changeContentEvent}></textarea>
					</div>
				</div>
				<div className="control" style={{ marginTop: "10px" }}>
					<div className="field">
						<button className="button is-info" onClick={ this.sendRequest }>Post</button>
					</div>
				</div>
			</div>
		)
	}
}

class SelectedPost extends Component {
	constructor (props) {
		super(props)

		this.state = {
			post: this.props.post
		}
	}

	render() {
		let buttons, content
		if(this.props.post.editable){
			buttons = (<span className="level-right"><button className="button has-icon" style={{ borderColor: "red" }} onClick={() => this.props.deletePost(this.props.post.id)}>
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
						</span>
						<hr/>
						<p className="menu-label">Comments</p>
						{this.props.post.comments.map(comment => <Comment 
							key={comment.id} 
							data={comment} 
							deleteComment={this.props.deleteComment}
							updateComment={this.props.updateComment}
						/>)}
						<CommentFormComponent postComment={this.props.createComment} postId={this.props.post.id} />
					</div>
				</div>
			</div>
		)
	}
}

export default SelectedPost