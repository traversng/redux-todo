import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleWare, bindActionCreators } from 'redux'

const greetingReducer = (state = '', action) => {
	switch(action.type) {
		case 'SAY_HELLO':
		return 'hello '
		case 'SAY_GOODBYE':
		return 'goodbye '
	}
}

const nameReducer = (state = 'Travis', action) => {
	switch() {
		case 'CHANGE_NAME':
		return 'Mark Twain'
	}

	return state
}

const actionLogger = ({ dispatch, getState }) => 
	(next) => (action) => {
		console.log(action);
		return next(action);
	}

const reducers = combineReducers({ 

	greeting: greetingReducer,
	name: nameReducer

})

const middleWare = applyMiddleWare(actionLogger)
const store = createStore(

	reducers,
	{ greeting: '(Roll over me) ' },
	middleWare

)

const changeName = () => { return { type: 'CHANGE_NAME' } }
const hello = () => { return { type: 'SAY_HELLO'} }
const goodbye = () => { return { type: 'SAY_GOODBYE' } }

const Hello = (props) => {
	<div>
		onMouseOver={ props.hello }
		onMouseOut={ props.goodbye }
		onClick={ props.changeName }
		{ props.greeting }{ props.name }
	</div>
}

const render = () => {
	render( <Hello 
		greeting={ store.getState().greeting }
		name={ store.getState().name }
		{ ...bindActionCreators({ changeName, hello, goodbye }, store.dispatch) }
		/>, 
		document.body 
	)
}

render()
store.subscribe(render)













