import React from 'react';
import ReactDOM from 'react-dom';
import ToggleString from './components/app';
import HeaderToggle from './components/header';

const API_KEY = "AIzaSyDsEtxwEc2OWbfk0xYY2HwCMccOldy7DgM";


// Create a new component. This component should produce some HTML

// const means that the value for App will never change
const App = () => {
    return (
        <div>
            <HeaderToggle />
            <ToggleString />
        </div>
    )
};

// Take this components generated HTML and put it on the DOM

ReactDOM.render(<App />, document.querySelector('.container'));