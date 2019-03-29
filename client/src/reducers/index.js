import { combineReducers } from 'redux'
import UserReducer from './user-reducer'
import UserInfoReducer from './userinfo-reducer'
import ContainerReducer from './container-reducer'
import errorReducer from './error-reducer'

const rootReducer = combineReducers({
	user: UserReducer,
	userinfo: UserInfoReducer,
	containers: ContainerReducer,
	error: errorReducer
})

export default rootReducer