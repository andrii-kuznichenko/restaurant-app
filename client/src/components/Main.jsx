import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserMenu from './UserMenu';
import Login from './Login';
import Register from './Register'
import MockOrder from './MockOrder';
import Protected from './ProtectedRoute';
import AdminOrders from './AdminOrders';
import OrderSummary from './OrderSummary';
import UserOrderMeal from './UserOrderMeal';
import TableLogin from './TableLogin';
import ProtectedTables from './ProtectedTables';
import AdminMenu from './AdminMenu';
import AdminNewMeal from './AdminNewMeal';
import AdminDashboard from './AdminDashboard';
import MyRestaurant from './MyRestaurant';

function Main() {
  return (
    <main>
      <Routes>
      <Route path="/user" element={<ProtectedTables />}>
        <Route path="" element={<UserMenu />} />
        <Route path="order/summary" element={<OrderSummary />} />
        <Route path="order/meal/:id" element={<UserOrderMeal />} />
      </Route>
      <Route path="/loginTable/:_id/:tableNumber/:restaurantId" element={<TableLogin />} />

      <Route path="/" element={<Protected />}>
        <Route path="admin/menu" element={<AdminMenu />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} /> 
       <Route path="admin/newMeal" element={<AdminNewMeal />} />  
      <Route path="admin/orders" element ={<AdminOrders />} />
      <Route path="admin/restaurant" element ={<MyRestaurant />} />
      </Route>
      <Route path="/login" element ={<Login />} />
      <Route path="/register" element ={<Register />} />
      <Route path="/mockorder" element ={<MockOrder />} />
      </Routes>
    </main>

    
  )
}

export default Main