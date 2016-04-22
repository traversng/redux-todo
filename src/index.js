import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux'


// The greetingReducer returns a different sting depending on the action.type. 
// If the action.type is 'SAY_HELLO' it returns 'hello ' etc.
const greetingReducer = (state = '', action) => {
	switch(action.type) {
		case 'SAY_HELLO':
		return 'hello '
		case 'SAY_GOODBYE':
		return 'goodbye '
	}
	return state
}

// The nameChangeReducer changes the state.name if the action.type is 'CHANGE_NAME'.
// The name is changed to a static name, in this case Mark Twain.
const nameChangeReducer = (state = 'Travis', action) => {
	switch(action.type) {
		case 'CHANGE_NAME':
		return action.payload
	}

	return state
}

// The actionLogger is a Middleware that receives dispatch and getState as named arguments. 
// It returns a function, that is given the next middlewares dispatch method. 
// It is then expected to return a function of action by calling next(action). 
// The middlewares signature is ({ dispatch, getState }) => next => action.
const actionLogger = ({ dispatch, getState }) => 
	(next) => (action) => {
		console.log('Will dispatch: ', action);
		return next(action);
	}

// The combineReducers function is a helper function that turns an object whose values are 
// different reducing functions into a single reducing function that you can pass into createStore.
// In this case it is the const reducers. 
const reducers = combineReducers({ 
	
	// The keys of the reducers (greeting, name) will be available on the state object
	greeting: greetingReducer,
	name: nameChangeReducer

})


const middleWare = applyMiddleware(actionLogger)

// createStore holds the complete state tree of the application. 
// There should only be a single store in the app.
// It takes 3 arguments ( reducer, initialState, enhancer(middleware, time travel, persistance etc.) )
// Returns: store which is the complete state of the application
// The only way to change the state is through dispatching actions
// The store can be subscribed to, to receive updates when it changes
const store = createStore(
	
	reducers,
	{ greeting: '(Hover over me) ' },
	middleWare

)


const changeName = (newName) => { return { type: 'CHANGE_NAME', payload: newName } }
const hello = () => { return { type: 'SAY_HELLO'} }
const goodbye = () => { return { type: 'SAY_GOODBYE' } }

const Hello = (props) => 
	<div
		onMouseOver={ props.hello }
		onMouseOut={ props.goodbye }
		onClick={ props.changeName }>
		{ props.greeting }{ props.name }
	</div>

const render = () => {
	ReactDOM.render( <Hello 
		greeting={ store.getState().greeting }
		name={ store.getState().name }
		{ ...bindActionCreators({ changeName, hello, goodbye }, 
												store.dispatch) } 
		/>, 
		
		document.getElementById('root')
	)
}

render()
store.subscribe(render)













