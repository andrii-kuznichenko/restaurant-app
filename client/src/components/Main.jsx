import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';
import OrderSummary from './OrderSummary';
import UserOrderMeal from './UserOrderMeal';
import TableLogin from './TableLogin';
import ProtectedTables from './ProtectedTables';

function Main() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<ProtectedTables />}>
          <Route path="" element={<UserMenu />} />
          <Route path="order/summary" element={<OrderSummary />} />
          <Route path="/order/meal/:id" element={<UserOrderMeal />} />
        </Route>
        <Route path="/loginTable/:_id/:tableNumber/:restaurantId" element={<TableLogin />} />
        <Route path="/loginTable" element={<TableLogin />} />
      </Routes>
    </main>

    
  )
}

export default Main