import React, { Component } from 'react'
import axios from 'axios'

import Bar from './bar'
import {PostsMenu} from './menus'
import { fetchPosts } from '../../actions/forum-actions'
import Post from './forum/posts'
import SelectedPost from './forum/selectedPost'

// rendering post



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