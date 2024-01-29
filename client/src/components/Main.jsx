import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';
import Login from './Login';
import Register from './Register'
import MockOrder from './MockOrder';
import Protected from './ProtectedRoute';
import AdminOrders from './AdminOrders';

function Main() {
  return (
    <main>
      <Routes>
      <Route path="/" element={<Protected />}>
        <Route path="orders" element ={<AdminOrders />} />
      </Route>

      <Route path="/login" element ={<Login />} />
      <Route path="/register" element ={<Register />} />
      <Route path="/mockorder" element ={<MockOrder />} />

      </Routes>  

      <h1 className='text-dark-sapphire-blue'>Hello Team!</h1>    
    </main>
  )
}

export default Main