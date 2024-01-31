import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Main from './components/Main'
import Footer from './components/Footer'
import AdminMenu from './components/AdminMenu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Main />
     <AdminMenu />
     <Footer />
    </>
  )
}

export default App
