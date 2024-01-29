import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';
import Login from './Login';
import Register from './Register'

function Main() {
  return (
    <main>
      <Routes>
      <Route path="/" element={<Protected />}>
      
      </Route>

      <Route path="/login" element ={<Login />} />
      <Route path="/register" element ={<Register />} />
      </Routes>  

      <h1 className='text-dark-sapphire-blue'>Hello Team!</h1>    
    </main>
  )
}

export default Main