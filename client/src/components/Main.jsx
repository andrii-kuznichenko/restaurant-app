import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';
import Login from './Login';
import Register from './Register'
import OrderSummary from './OrderSummary';
import UserOrderMeal from './UserOrderMeal';
import TableLogin from './TableLogin';
import ProtectedTables from './ProtectedTables';
import Protected from './ProtectedRoute';

function Main() {
  return (
    <main>
      <Routes>
          <Route path="/" element={<Protected />}>
      
      </Route>
      <Route path="/login" element ={<Login />} />
      <Route path="/register" element ={<Register />} />

      
      <Route path="/user" element={<ProtectedTables />}>
          <Route path="/user/order/summary" element={<OrderSummary />} />
          <Route path="/user/order/meal/:id" element={<UserOrderMeal />} />
      </Route>
        <Route path="/loginTable/:_id/:tableNumber/:restaurantId" element={<TableLogin />} />
        <Route path="/loginTable" element={<TableLogin />} />
      </Routes>
    </main>

    
  )
}

export default Main