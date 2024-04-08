import React from 'react';
import './App.css';
import Button from './Components/Button'
import { HashRouter, Routes, Route } from "react-router-dom"
import Upload from './Views/Upload';
import Dataset from './Views/Dataset';
import EventLog from './Views/EventLog';
import Model from './Views/Model';
import { RecoilRoot } from 'recoil'
import Tabelarisation from './Views/Tabelarisation';
import EventStatistics from './Views/EventStatistics';


// Point Eel web socket to the instance
export const eel = window.eel
eel.set_host('ws://localhost:8080')

// Expose the `sayHelloJS` function to Python as `say_hello_js`
function sayHelloJS(x) {
  console.log('Hello from ' + x)
}
// WARN: must use window.eel to keep parse-able eel.expose{...}
window.eel.expose(sayHelloJS, 'say_hello_js')

// Test anonymous function when minimized. See https://github.com/samuelhwilliams/Eel/issues/363
function show_log(msg) {
  console.log(msg)
}
window.eel.expose(show_log, 'show_log')

// Test calling sayHelloJS, then call the corresponding Python function
sayHelloJS('Javascript World!')
eel.say_hello_py('Javascript World!')

// Set the default path. Would be a text input, but this is a basic example after all
const defPath = '~'


const App = () => {


  return (
    <RecoilRoot>
      <HashRouter >
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path='/eventlog' element={<EventLog />} />
          <Route path='/model' element={<Model />} />
          <Route path='/tabelarisation' element={<Tabelarisation/>} />
          <Route path='/eventstatistics' element={<EventStatistics/>} />
        </Routes>
      </HashRouter>
    </RecoilRoot>
  )
}

export default App;
