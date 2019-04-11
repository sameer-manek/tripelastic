import React, { Component } from 'react'
import axios from 'axios'

import Bar from './bar'
import {PostsMenu} from './menus'
import { fetchPosts } from '../../actions/forum-actions'
import Post from './forum/posts'
import SelectedPost from './forum/selectedPost'

// rendering post

function CreatePostForm (props) {
	return (
		<form>
			<div className="control">
				<label className="label">PostTitle</label>
				<div className="field">
					<input type="text" className="input" placeholder="title of your post" />
				</div>
			</div>

			<div className="control">
				<label className="label">Content</label>
				<div className="field">
					<textarea placeholder="content of the post"></textarea>
				</div>
			</div>

			<button className="button" onClick={this.createPost}>create post</button>
		</form>
	)
}

class Comm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: "all",
			selectedPost: null,
			posts: [],
			loading: true,
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.selectPost = this.selectPost.bind(this)
	}

	selectPost (post) {
		//the state is updated in infinity loop. diagnose if t
		this.setState({
			selectedPost: post
		})
	}

	async createPost(e) {
		e.preventDefault()
		let query = `
			mutation {
				createPost(token: "`+ sessionStorage.token +`", title: "`+ this.state.title +`", content: "`+ this.state.content +`") {
					id,
					title,
					content,
					editable,
					comments{
						comments{
							id
							user{
								username
							}
							content
						}
					}
					votes
				}
			}
		`
		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({data}) => {
			data = data.data.createPost

			// update stack
			let posts = this.state.posts
			posts.push(data)
			this.setState({
				posts
			})
		})
	}

	async createComment(data) {
		let query = `
			createComment(token, content, postId, parentId) {
				id
				content
				postId
				parentId
			}
		`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({data}) => {
			data = data.data.createComment

			let post = this.state.posts.filter(({id}) => { return id === data.postId })
			let comments = post.comments
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
		      children {
		      	id
		      	user {
		      		username
		      	}
		      	content
		      	children {
					id
					user {
						username
					}
					content
					editable
		      	}
		      	editable
		      }
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