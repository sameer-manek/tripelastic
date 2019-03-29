import React, { Component } from 'react'

function Post (props) {
	return (
		<div>
			{this.props.post.id}
		</div>
	)
}

class PostList extends Component {
	constructor (props) {
		super(props)

		this.state = {}
	}

	render(){
		let posts = this.props.posts
		return (
			<div>
				{posts.map(post => {
					return(<Post post={post} />)
				})}
			</div>
		)
	}
}

export default PostList