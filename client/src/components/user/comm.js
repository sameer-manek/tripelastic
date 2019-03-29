import React, { Component } from 'react'
import axios from 'axios'

import Bar from './bar'
import {PostsMenu} from './menus'
import { fetchPosts } from '../../actions/forum-actions'

// rendering post
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

class SelectedPost extends Component {
	constructor (props) {
		super(props)

		this.state = {}
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
						<span>
							<i className="icon lnr lnr-thumbs-up" style={{ fontSize: "13px", cursor: "pointer", color: "skyblue" }}></i>
							&nbsp;
							<span>{this.props.post.votes}</span>
							&nbsp;
							<i className="icon lnr lnr-thumbs-down" style={{ fontSize: "13px", cursor: "pointer", color: "orange" }}></i>
						</span>
						<hr/>
					</div>
				</div>
			</div>
		)
	}
}

class Comm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "all",
			selectedPost: null,
			posts: [],
			loading: true
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.selectPost = this.selectPost.bind(this)
	}

	selectPost (post) {
		this.setState({
			selectedPost: post
		})
	}

	componentDidMount() {
		let query = `query{
		  allPosts(token: "`+ sessionStorage.token +`") {
		    id
		    title
		    content
		    user {
		      username
		    }
		    container{
		      id
		      name
		    }
		    editable
		    comments{
		      id
		      user{
		        username
		      }
		      content
		      editable
		    }
		    votes
		  }
		}`

		axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.allPosts
			this.setState({
				posts: data,
				loading: false
			})
		})
	}

	toggleSelected = function(newSelection) {
		if(this.state.selected !== newSelection) {
			this.setState({
				selected: newSelection
			})
		}
	}

	render() {
		let selectedPost
		if (this.state.selectedPost !== null) {
			selectedPost = <SelectedPost post={this.state.selectedPost} />
		}
		return (
			<div>
				<Bar constrained />
				<hr/>
				<div className="columns" style={{padding: "0 20px"}}>
					<div className="column is-one-fifth" style={{ borderRight: "1px solid #CCC", height: "100%" }}>
						<PostsMenu toggle={this.toggleSelected} />
					</div>
					<div className="column is-four-fifths">
						<div className="columns">
							<div className="column is-one-third" style={{ borderRight: "1px solid #CCC", height: "100%" }}>
								<p className="menu-label">
									{this.state.selected} posts <i style={{ color: "blue", cursor: "pointer", fontSize: "12px" }} className="lnr lnr-plus-circle"></i>
								</p>
								{
									this.state.posts.map(post => <Post key={post.id} post={post} selectPost={this.selectPost} />)
								}
							</div>
							<div className="column is-two-thirds">
								{selectedPost}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Comm