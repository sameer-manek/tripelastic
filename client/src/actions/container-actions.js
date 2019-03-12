import axios from 'axios'

const URL = 'http://localhost:4000/api'

export const fetchContainers = async function (token) {
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

	return await axios({
		url: URL,
		method: "post",
		data: {
			query
		}
	}).then(({ data }) => {
		data = data.data.myContainers
		return {
			type: "FETCH_USER_CONTAINERS",
			payload: data
		}
	}).catch(err => console.log(err))
}