import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';
import OrderSummary from './OrderSummary';
import UserOrderMeal from './UserOrderMeal';

function Main() {
  console.log('Main component is rendered.')
  return (
    <main>
      <Routes>
      <Route path="" element={<UserMenu />} />
      <Route path="/UserOrderMeal" element={<UserOrderMeal />} />
      <Route path="/OrderSummary" element={<OrderSummary />} />
      </Routes>  

    
    </main>
  )
}

export default Main