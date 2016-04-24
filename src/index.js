import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux'


// =================== REDUCER
// In this app the phraseReducer returns a different string depending on the action.type. 
// If the action.type is 'ADD_PHRASE' it returns the action.text etc.
// Default initial state is a single string of 'phraseReducer'
// Returns an object with the text and an incremented id
const todoReducer = (state, action) => {
	switch(action.type) {
		case 'ADD_TODO':
		return {
			text: action.text,
			id: action.id,
			completed: false
		}

		case 'TOGGLE_TODO':
		if (state.id !== action.id) {
			return state
		}
		return Object.assign({}, state, {
			completed: !state.completed
		})

		default: 
	 		return state
	}
}

// =================== REDUCER
// The phraseListReducer changes the state. if the action.type is 'ADD_PHRASE' 
// it will return the new state as in array with the newly added phrase

const todoListReducer = (state = [], action) => {
	switch(action.type) {
		case 'ADD_TODO': 
		return [
			...state,
			todoReducer(undefined, action)
		]

		case 'TOGGLE_TODO':
		return state.map(t => todo(t, action))

		default: 
			return state
	}
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch(action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter
		default: 
			return state
	}
}
// =================== COMBINE REDUCERS
// The combineReducers function is a helper function that turns an object whose values are 
// different reducing functions into a single reducing function that you can pass into createStore.
// In this case it is the const reducers. 
const todoApp = combineReducers({
	todoListReducer,
	visibilityFilter
})


// =================== MIDDLEWARE
// The actionLogger is a Middleware that receives dispatch and getState as named arguments. 
// It returns a function, that is given the next middlewares dispatch method. 
// It is then expected to return a function of action by calling next(action). 
// The middlewares signature is ({ dispatch, getState }) => next => action.
const actionLogger = ({ dispatch, getState }) => 
	(next) => (action) => {
		console.log('Will dispatch: ', action);
		return next(action);
	}

// =================== APPLY MIDDLEWARE TO ACTIONLOGGER
const middleWare = applyMiddleware(actionLogger)

// =================== CREATE STORE
// createStore holds the complete state tree of the application. 
// There should only be a single store in the app.
// It takes 3 arguments ( reducer, initialState, enhancer(middleware, time travel, persistance etc.) )
// Returns: store which is the complete state of the application
// The only way to change the state is through dispatching actions
// The store can be subscribed to, to receive updates when it changes
const store = createStore( todoApp,{ /*Initial State Goes Here*/ }] }, middleWare )


// =================== ACTION CREATORS
let nextTodoId = 0
const addTodo = (text) => {
	return {
		type: 'ADD_TODO',
		id: nextTodoId++
		text
	}
}

const setVisibilityFilter = (filter) => {
	return{
		type: 'SET_VISIBILITY_FILTER',
		filter
	}
}

const toggleTodo = (id) => {
	return {
		type: 'TOGGLE_TODO',
		id
	}
}

// =================== REACT COMPONENTS 
const todoItem = ({ onClick, completed, text }) => (
	<li 
		onClick={ onClick }
		style={{ textDecoration: completed ? 'line-through' : 'none' }}
	>
	{ text }
	</li>
)

const todoList = ({ todos, onTodoClick }) => {
	<ul>
		{ todos.map(todo => 
			<Todo
			key={ todo.id }
		) }
	</ul>
}

// =================== RENDER FUNCTION
const render = () => {
	ReactDOM.render( 
		<Provider store={ store }>
			<App 
				// bindActionCreators makes the actionCreators available on via the props object
				{ ...bindActionCreators( { /*ACTION CREATORS GO HERE*/ } , store.dispatch) } 
			/>
		</Provider>, document.querySelector('.container')
	)
}

render()
store.subscribe(render)













