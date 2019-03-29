import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Bar from './bar'
import {PostsMenu} from './menus'
import { fetchPosts } from '../../actions/forum-actions'
import PostList from './forum/postList'


function mapStateToProps(state) {
	return {
		user: state.user,
		posts: state.posts
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchPosts }, dispatch)
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
			posts: []
		}

		this.toggleSelected = this.toggleSelected.bind(this)
		this.selectPost = this.selectPost.bind(this)
	}

	componentDidMount() {
		this.props.fetchPosts()
	}

	componentWillReceiveProps (newProps) {
		this.setState ({
			posts: newProps.posts
		})
	}

	toggleSelected = function(newSelection) {
		if(this.state.selected !== newSelection) {
			this.setState({
				selected: newSelection
			})
		}
	}

	selectPost(post) {
		if(this.state.selectPost !== post) {
			this.setState({
				selectPost: post
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
								<PostList posts = {this.state.posts} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Comm)