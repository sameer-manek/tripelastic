import React from 'react'
import ReactDOM from 'react-dom'
import './assets/styles/index.css'
import App from './components/App'

import{ BrowserRouter, Route } from 'react-router-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Provider } from 'react-redux'
import rootReducer from './reducers'

const store = createStore(
	rootReducer,
	compose (
		applyMiddleware(thunk, logger),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
)

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Route path="/:filter?" component={App} />
		</BrowserRouter>
	</Provider>
	, 
	document.getElementById('root'))
