import axios from 'axios'

const USER_LOGIN = "USER_LOGIN"
const USER_LOGOUT = "USER_LOGOUT"
const LOGIN_FAILED = "LOGIN_FAILED"

const URI = "http://localhost:4000/api"

export const userDetails = function (token) {
	let query = `query{
		me(token: "` + token + `"){
			firstname
			lastname
			email
			username
			password
			phone
			emailVerified
			phoneVerified
		}
	}`

	return (dispatch) => {
		axios({
			url: URI,
			method: "post",
			data: {
				query
			}
		}).then(({data}) => {
			let details = data.data.me
			dispatch({
				type: "USER_DETAIL",
				payload: {
					firstname: details.firstname,
					lastname: details.lastname,
					email: details.email,
					username: details.username,
					password:details.password,
					phone: details.phone,
					emailVerified: details.emailVerified,
					phoneVerified: details.phoneVerified
				}
			})
		})
	}
}

export const userLogin = function(email, password) {
	let query = `query {
		login(email: "`+email+`", password: "`+password+`"){
			token
			username
		}
	}`

	return function(dispatch) {
		let response = axios({
			url: 'http://localhost:4000/api',
			method: 'post',
			data: {
				query
			}
		}).then(({ data }) => {
			data = data.data.login
			if(data.token && data.username){
				sessionStorage.setItem("token", data.token)
				sessionStorage.setItem("username", data.username)
				dispatch ({
					type: USER_LOGIN,
					payload: {
						loggedIn: true,
						token: data.token,
						username: data.username
					}
				})
			} else {
				dispatch({
					type: LOGIN_FAILED,
					payload: {
						error: "cannot login, please check if you have entered the right credentials"
					}
				})
			}
		})
	}
}

export const userLogout = function() {
	sessionStorage.clear()
	return {
		type: USER_LOGOUT,
		payload: {
			loggedIn: false,
			token: null,
			username: null
		}
	}
}

export function calloutAction() {

	if(sessionStorage.username && sessionStorage.token){
		return {
			type: "USER_RESEAT",
			payload: {
				loggedIn: true,
				token: sessionStorage.token,
				username: sessionStorage.username
			}
		}
	} else {
		return {
			type: "NO_ACTION"
		}
	}
	
}