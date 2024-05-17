import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ButtonShiMin from './components/button'
import NextButton from './components/Nextbutton'
import Heading from './components/Heading'

const usersList = ['Shi Min', 'Bobby', 'Pablo', 'Ditta', 'Sita']
const startingStatus = 1

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React </h1>
      <Heading />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Shi min  level is {count}
        </button>
        <ButtonShiMin text='Shi Min  level is ' isShiMin='true' count={count} setCount={setCount}/>
        <ButtonShiMin text='Pablo  level is ' isShiMin='false' count={count} setCount={setCount}/>
        <NextButton list={usersList} current_status={startingStatus} />
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}




export default App
