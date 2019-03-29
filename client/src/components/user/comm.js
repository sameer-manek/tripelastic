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
		return (
			<div>
				{this.props.post.id}
			</div>
		)
	}
}

const columnBorder = {
	borderRight: '1px solid #CCC'
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
									this.state.posts.map(post => <Post post={post} />)
								}
							</div>
							<div className="column is-two-thirds">
								
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Comm