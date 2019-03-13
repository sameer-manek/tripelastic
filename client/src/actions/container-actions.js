import axios from 'axios'

const URL = 'http://localhost:4000/api'

export const fetchContainers = function (token) {
	console.log("action is called")
	let query = `query {
		myContainers(token: "` + token + `") {
			id
			name
			detail
			createdAt
			category
		}
	}`

	return async dispatch => { 
		await axios({
			url: URL,
			method: "post",
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.myContainers
			console.log(data)
			dispatch ({
				type: "FETCH_USER_CONTAINERS",
				payload: data
			})
		}).catch(function(err) {
			dispatch({
				type: "ERROR",
				payload: err
			})
		})
	}
}