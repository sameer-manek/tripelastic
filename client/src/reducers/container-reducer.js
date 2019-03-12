export default function (state = {}, action) {
	switch (action.type) {
		case "FETCH_USER_CONTAINERS": 
			return action.payload
		default: 
			return state
	}
} 