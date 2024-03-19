import React from 'react';
import './App.css';
import Dropzone from './Dropzone'
import Button from './Components/Button'



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


// class App extends Component {
//   state = {
//     message: `Click button to choose a random file from the user's system`,
//     path: defPath,
//   }

//   pickFile = () => {
//     eel.pick_file(defPath)(( message) => this.setState( { message } ) )
//   }

//   render() {
//     eel.expand_user(defPath)(( path) => this.setState( { path } ) )
//     return (

//         <div className="App">
//           <h1 className='text-blue-600'> Eel React Example </h1>
//           <Button color="red">Pick a file</Button>
//         </div>
//     );
//   }
// }

const App = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit')
    console.log(e)
  }
  const handleTest = ()=>{
    eel.use_button('test')((message) => console.log(message))
  }
  return (
    <div className="container mx-auto flex flex-col items-center justify-center w-full  h-screen">
      <Button onClick={handleTest}>Test Funkcji na Backendzie</Button>

      <div className="w-full flex flex-col items-center">
        <h1 className='text-center text-3xl my-4'> Wczytaj plik csv </h1>
        <Dropzone />
        <Button onClick={handleSubmit} >Zatwierdź</Button>
      </div>
    </div>
  )
}

export default App;
