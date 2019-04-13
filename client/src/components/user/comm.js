import React, { Component } from 'react'
import axios from 'axios'

import Bar from './bar'
import {PostsMenu} from './menus'
import { fetchPosts } from '../../actions/forum-actions'
import Post from './forum/posts'
import SelectedPost from './forum/selectedPost'

// rendering post

class CreatePostForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			title: "",
			content: ""
		}

		this.changeTitleEvent = this.changeTitleEvent.bind(this)
		this.changeContentEvent = this.changeContentEvent.bind(this)
	}

	changeTitleEvent(e) {
		this.setState({
			title: e.target.value
		})
	}

	changeContentEvent(e) {
		this.setState({
			content: e.target.value
		})
	}

	render (props) {
		return (
			<form>
				<div className="control">
					<label className="label">Title</label>
					<div className="field">
						<input type="text" className="input" placeholder="title of your post" onChange={this.changeTitleEvent} />
					</div>
				</div>
				<br/>
				<div className="control">
					<label className="label">Content</label>
					<div className="field">
						<textarea placeholder="content of the post" className="textarea input" onChange={this.changeContentEvent} ></textarea>
					</div>
				</div>
				<br/>
				<button type="button" className="button is-info" onClick={() => this.props.createPost( { title: this.state.title, content: this.state.content } )}>create post</button>
			</form>
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
			loading: true,
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.selectPost = this.selectPost.bind(this)
		this.postComment = this.postComment.bind(this)
		this.deleteComment = this.deleteComment.bind(this)
		this.updateComment = this.updateComment.bind(this)
		this.addPostEvent = this.addPostEvent.bind(this)
		this.createPost = this.createPost.bind(this)
		this.deletePost = this.deletePost.bind(this)
		this.updatePost = this.updatePost.bind(this)
	}

	selectPost (post) {
		this.setState({
			selectedPost: post
		})
	}

	addPostEvent() {
		this.setState({
			selectedPost: null,
			addPost: true
		})
	}

	async createPost(data) {
		let query = `mutation {
		  createPost(token:"`+ sessionStorage.token +`", title: "`+ data.title +`", content: "`+ data.content +`", containerId: null) {
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

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then( ({ data }) => {
			data = data.data.createPost

			if (!data) {
				console.log("failed to create post", query, data)
			}

			else {
				// render the post
				let posts = this.state.posts
				posts.push(data)
				this.setState({
					posts,
					addPost: false,
					selectedPost: data
				})
			}
		})
	}

	async deletePost(id) {
		let query = `mutation{
			deletePost(token: "`+ sessionStorage.token +`", id: "`+ id +`") {
				success
				message
			}
		}`
		
		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then( ({ data }) => {
			data = data.data.deletePost

			if(!data) {
				console.log("couldnot delete the post", query)
			}

			else {
				// remove the rendered post

				let posts = this.state.posts
				posts = posts.filter(post => {
					return post.id !== id
				})

				this.setState({
					posts,
					selectedPost: null
				})
			}
		})
	}

	async updatePost(pdata) {
		let query = `mutation {
		  updatePost(token:"`+ sessionStorage.token +`", id:"`+ pdata.id +`", title: "`+ pdata.title +`", content: "`+ pdata.content +`") {
		    success
		    message
		  }
		}`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.updatePost

			if(!data) {
				console.log("could not update post", query)
			}

			else{
				// render the update
				let posts = this.state.posts
				posts.filter(post => {
					if(post.id === pdata.id) {
						post.title = pdata.title
						post.content = pdata.content
					}
				})

				this.setState({
					posts
				})
			}
		})
	}

	async postComment(data) {
		let content = data.content
		let postId = data.postId

		let query = `mutation{
			createComment (token:"`+ sessionStorage.token +`", postId: "`+ postId +`", content: "`+ content +`", parentId: null) {
				id
			    user{
			      username
			    }
			    content
			    editable
			}
		}`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.createComment

			if(!data) {
				console.log("cannot post comment", data, query)
			}

			// render the comment

			let posts = this.state.posts
			posts.filter(post => {
				if(post.id == postId) {
					post.comments.push(data)
				}
			})

			this.setState({
				posts
			})
		}).catch(err => console.log(err))
	}

	async updateComment(data){
		let query = `mutation {
		  updateComment(token: "`+ sessionStorage.token +`", id: "`+ data.id +`", content:"`+ data.content +`"){
		    success
		    message
		  }
		}`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data:{
				query
			}
		}).then(({ data }) => {
			data = data.data.updateComment

			if(!data) {
				console.log("error", query, data)
			}

			else {
				// render the update
				let posts = this.state.posts
				posts.filter(post => {
					let comments = post.comments
					comments.filter(comment => {
						if(comment.id === data.id) {
							comment.content = data.content
						}
					})
				})

				this.setState({
					posts
				})
			}
		})
	}

	async deleteComment(cid) {
		let query = `mutation {
			deleteComment(token: "`+ sessionStorage.token +`", id: "`+ cid +`"){
				success
				message
			}
		}`

		await axios({
			url: "http://localhost:4000/api",
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.deleteComment
			if(!data) {
				console.log("could not delete comment", data, query)
			}

			else {
				// remove comment render

				let posts = this.state.posts
				posts.filter(post => {
					let comments = post.comments
					comments = comments.filter(({id}) => {
						return id !== cid
					})

					post.comments = comments
				})

				this.setState({
					posts
				})
			}
		}).catch(err => console.log("error", err))
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
		}).catch(err => console.log(err))
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
			selectedPost = ( <SelectedPost 
				post={this.state.selectedPost} 
				createComment={this.postComment} 
				deleteComment={this.deleteComment}
				updateComment={this.updateComment}
				deletePost={this.deletePost}
				updatePost={this.updatePost}
				/> )
		}

		if(this.state.selectedPost === null && this.state.addPost === true) {
			selectedPost = <CreatePostForm createPost={this.createPost} />
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
								<p className="menu-label" onClick={this.addPostEvent} style={{ cursor: "pointer" }}>
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