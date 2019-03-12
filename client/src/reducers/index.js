import { combineReducers } from 'redux'
import UserReducer from './user-reducer'
import UserInfoReducer from './userinfo-reducer'
import ContainerReducer from './container-reducer'

const rootReducer = combineReducers({
	user: UserReducer,
	userinfo: UserInfoReducer,
	containers: ContainerReducer
})

export default rootReducer