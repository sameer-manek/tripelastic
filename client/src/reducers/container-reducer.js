export default function (state = {}, action) {
	switch (action.type) {
		case "FETCH_USER_CONTAINERS": 
			return action.payload
		case "DELETE_CONTAINER":
			return state.filter(({ id }) => id != action.payload)
		default: 
			return state
	}
} 