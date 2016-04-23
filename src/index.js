import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux'


// =================== REDUCER
// In this app the phraseReducer returns a different string depending on the action.type. 
// If the action.type is 'ADD_PHRASE' it returns the action.text etc.
// Default initial state is a single string of 'phraseReducer'
// Returns an object with the text and an incremented id
const counter = () => {
  var num = 0;
  return function closedCount() {
    return ++num;
  };
}

let count = counter();
const phraseReducer = (state, action) => {
	if(!state) {
		state = true
	}
	switch(action.type) {
		case 'ADD_PHRASE':
		return {
			id: count(),
			text: action.text
		}
	}
	return state
}

// =================== REDUCER
// The phraseListReducer changes the state. if the action.type is 'ADD_PHRASE' 
// it will return the new state as in array with the newly added phrase
const phraseListReducer = (state = [], action) => {
	switch(action.type) {
		case 'ADD_PHRASE':
		return [
			...state,
			phraseReducer(undefined, action)
		]
	}
	return state
}

// =================== COMBINE REDUCERS
// The combineReducers function is a helper function that turns an object whose values are 
// different reducing functions into a single reducing function that you can pass into createStore.
// In this case it is the const reducers. 
const reducers = combineReducers({ 
	
	// The keys of the reducers (activePhrase, removedPhrase) will be available on the state object
	phrase: phraseReducer,
	phrases: phraseListReducer

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
const store = createStore( reducers,{ phrases: [{id: 0, text: 'initial phrase'}] }, middleWare )


// =================== ACTION CREATORS
const newPhrase = ( phrase ) => { 
	console.log('newPhrase!!', phrase)
	return { type: 'ADD_PHRASE', text: phrase } 
}


// =================== REACT COMPONENTS
// PhraseInput 

const PhraseItem = ( props ) => {
	return <li>{ props.phrase.text }</li>
}

class PhraseInput extends Component{
	render(){
		let input
		return(
			<div> 
				<form onSubmit={ e => { 
					e.preventDefault() 
					store.dispatch(newPhrase(input.value))
					input.value = ''
				}}>
					<input ref={node => {
          				input = node
        			}}/>
					<button onClick={ this.addPhrase }>Add Phrase</button>
				</form>
			</div>	
		)
	}
}

const PhraseList = () => {
	let phrases = store.getState().phrases
	return(
	<ul>
    	{ phrases.map( (phrase) => <PhraseItem key={ phrase.id } phrase={ phrase }/> ) }
  	</ul>
  	)
}

const App = () => {
	return (
		<div>
			<PhraseInput />
			<PhraseList props={ store }/>
		</div>
	)
}



const render = () => {
	console.log('Store in render: ', store)

	ReactDOM.render( 
		<Provider store={ store }>
			<App 
				// bindActionCreators makes the actionCreators available on via the props object
				{ ...bindActionCreators( { newPhrase } , store.dispatch) } 
			/>
		</Provider>, document.querySelector('.container')
	)
}

render()
store.subscribe(render)













