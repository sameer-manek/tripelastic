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
			post: this.props.post,
			newTitle: this.props.post.title,
			newContent: this.props.post.content,
			mode: "view"
		}

		this.changeMode = this.changeMode.bind(this)
		this.changeTitleEvent = this.changeTitleEvent.bind(this)
		this.changeContentEvent = this.changeContentEvent.bind(this)
		this.sendRequest = this.sendRequest.bind(this)
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			post: newProps.post,
			newTitle: newProps.post.title,
			newContent: newProps.post.content,
			mode: "view"
		})
	}

	changeMode() {
		if(this.state.mode === "edit") {
			this.setState({
				newTitle: this.props.post.title,
				newContent: this.props.post.content,
				mode: "view"
			})
		}

		else {
			this.setState({
				mode: "edit"
			})
		}
	}

	changeTitleEvent(e) {
		this.setState({
			newTitle: e.target.value
		})
	}

	changeContentEvent(e) {
		this.setState({
			newContent: e.target.value
		})
	}

	async sendRequest() {
		await this.props.updatePost({
			id: this.state.post.id,
			title: this.state.newTitle,
			content: this.state.newContent
		})

		let post = this.state.post
		post.title = this.state.newTitle
		post.content = this.state.newContent

		this.setState({
			post
		})
	}

	render() {
		let buttons, content, icon
		content = (<span><p><b>{this.state.post.title}</b></p>
			<p>{this.state.post.content}</p></span>)
		if(this.props.post.editable){
			icon = <i className="icon lnr lnr-pencil" style={{ color: "blue" }}></i>
			if(this.state.mode === "edit") {
				icon = <i className="icon lnr lnr-cross-circle" style={{ color: "blue" }}></i>
				content = (<form>
					<div className="control">
						<label className="label">Title</label>
						<div className="field">
							<input type="text" className="input" placeholder="title for the post" defaultValue={this.state.newTitle} onChange={this.changeTitleEvent} />
						</div>
					</div>
					<div className="control">
						<label className="label">Content</label>
						<div className="field">
							<textarea type="text" className="textarea input" placeholder="post content" defaultValue={this.state.newContent} onChange={this.changeContentEvent}></textarea>
						</div>
					</div>
					<div className="control" style={{marginTop: "10px"}}>
						<div className="field">
							<button type="button" className="button is-info" onClick={this.sendRequest}>Update post</button>
						</div>
					</div>
				</form>)
			}

			buttons = (<span className="level-right"><button className="button has-icon" style={{ borderColor: "red" }} onClick={() => this.props.deletePost(this.props.post.id)}>
					<i className="icon lnr lnr-trash" style={{ color: "red" }}></i>
				</button>
				&nbsp;
				<button className="button has-icon" style={{ borderColor: "blue" }} onClick={this.changeMode}>
					{icon}
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
						{content}
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