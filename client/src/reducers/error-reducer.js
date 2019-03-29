export default function (state = {}, action) {
	switch(action.type) {
		case "LOGIN_FAILED":
			return action.payload
		default: 
			return state
	}
}