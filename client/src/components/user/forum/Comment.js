import React, { Component } from 'react'

class Comment extends Component{
	constructor(props) {
		super(props)

		this.state = {
			mode: "view",
			content: this.props.data.content,
			loadingUpdate: false
		}

		this.changeMode = this.changeMode.bind(this)
		this.changeContentEvent = this.changeContentEvent.bind(this)
		this.sendRequest = this.sendRequest.bind(this)

	}

	changeMode() {
		if(this.state.mode === "edit") {
			this.setState({
				content: this.props.data.content,
				mode: "view"
			})
		} else {
			this.setState({
				mode: "edit"
			})
		}
	}

	changeContentEvent(e) {
		this.setState({
			content: e.target.value
		})
	}

	async sendRequest(e) {
		e.preventDefault()
		this.setState({
			loadingUpdate: true
		})
		await this.props.updateComment({ id: this.props.data.id, content: this.state.content })
		this.setState({
			loadingUpdate: false,
			mode: "view"
		})
	}

	render() {
		let props = this.props
		let children, actions, edit, content, updateButton
		if (props.data.children && props.data.children !== null) {
			children = props.data.children.map(child => <Comment key={child.id} data={child} />)
		}
		content = this.state.content
		if (props.data.editable === true) {
			edit = <i className="button lnr lnr-pencil" style={{ color: "grey", cursor: "pointer", fontSize: "11px", fontStyle: "normal" }} onClick={this.changeMode}></i>
			if(this.state.mode === "edit") {
				updateButton = <button className="button is-info" style={{marginTop: "5px"}} onClick={this.sendRequest}>update</button>
				if(this.state.loadingUpdate === true) {
					updateButton = <button className="button is-info is-loading" style={{marginTop: "5px"}} onClick={this.sendRequest}>update</button>
				}
				edit = <i className="button delete is-danger" style={{ cursor: "pointer", fontSize: "11px", fontStyle: "normal" }} onClick={this.changeMode}></i>
				content = ( <form> 
						<textarea rows="2" className="textarea input" placeholder="your comment.." defaultValue={this.state.content} onChange={this.changeContentEvent}></textarea>
						{updateButton}
					</form> )
			}
			actions = (
				<span className="level-right"> 
					{edit}
					&nbsp;&nbsp;
					<i className="button lnr lnr-trash" style={{ color: "grey", cursor: "pointer", fontSize: "11px", fontStyle: "normal" }} onClick={() => props.deleteComment(props.data.id)}></i>
				</span>
			)
		}
		return (
			<article className="card is-dark" style={{ margin: "10px 0 0 20px", padding: "10px", borderLeft: "1px solid black" }}>
				<b>{props.data.user.username}</b>
				<br/>
				<div className="card-body">
					{content}
				</div>
				{actions}
			</article>

		)
	}
}

export default Comment