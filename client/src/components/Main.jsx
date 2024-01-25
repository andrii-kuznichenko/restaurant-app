import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';

function Main() {
  return (
    <main>
      <Routes>
      <Route path="" element={<UserMenu />} />
      </Routes>  

      <h1 className='text-dark-sapphire-blue'>Hello Team!</h1>    
    </main>
  )
}

export default Main