import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Point Eel web socket to the instance
export const eel = window.eel
eel.set_host( 'ws://localhost:8080' )

// Expose the `sayHelloJS` function to Python as `say_hello_js`
function sayHelloJS( x ) {
  console.log( 'Hello from ' + x )
}
// WARN: must use window.eel to keep parse-able eel.expose{...}
window.eel.expose( sayHelloJS, 'say_hello_js' )

// Test anonymous function when minimized. See https://github.com/samuelhwilliams/Eel/issues/363
function show_log(msg) {
  console.log(msg)
}
window.eel.expose(show_log, 'show_log')

// Test calling sayHelloJS, then call the corresponding Python function
sayHelloJS( 'Javascript World!' )
eel.say_hello_py( 'Javascript World!' )

// Set the default path. Would be a text input, but this is a basic example after all
const defPath = '~'


export class App extends Component {
  state = {
    message: `Click button to choose a random file from the user's system`,
    path: defPath,
  }

  pickFile = () => {
    eel.pick_file(defPath)(( message) => this.setState( { message } ) )
  }

  render() {
    eel.expand_user(defPath)(( path) => this.setState( { path } ) )
    return (
      <div className="App">
        <header className="App-header">
          <h1>Witam moją szanowną grupę</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.message}</p>
          <button className='App-button' onClick={this.pickFile}>Pick Random File From `{this.state.path}`</button>
        </header>
      </div>
    );
  }
}

export default App;
