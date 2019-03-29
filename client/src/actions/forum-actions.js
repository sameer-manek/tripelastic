import axios from 'axios'

const URI = "http://localhost:4000/api"

export const fetchPosts = function () {
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

	return (dispatch) => {
		axios({
			url: URI,
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.allPosts
			dispatch ({
				type: "FETCH_POSTS",
				payload: data
			})
		}).catch(err => console.log(err))
	}
}