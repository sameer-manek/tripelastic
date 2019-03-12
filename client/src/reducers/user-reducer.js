export default function(state = {}, action) {
	switch (action.type) {
		case "USER_LOGIN":
			return action.payload
		case "USER_LOGOUT":
			return action.payload
		case "USER_RESEAT":
			return action.payload
		case "LOGIN_FAILED":
			return action.payload
		default:
			return state
	}
}