import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';

function Main() {
  return (
    <main>
      <Routes>
      <Route path="" element={<UserMenu />} />
      </Routes>      
    </main>
  )
}

export default Main