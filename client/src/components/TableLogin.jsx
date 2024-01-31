import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { AuthTableContext } from '../context/AuthTable';
import { Navigate, useParams } from 'react-router-dom';

function TableLogin() {
  const context = useContext(AuthTableContext);
  const {_id, tableNumber, restaurantId} = useParams();

  useEffect(() => {
    const user = {
      _id: _id,
      tableNumber: tableNumber,
      restaurantId: restaurantId
    };
    console.log(user);
    context.login(user);
  },[]);



  if (!context.loading && context.table) {
    return <Navigate to="/" />;
  }


if (!context.loading && !context.table) {
  return (
    <>
    <div>Need to scan QR Code</div>
    <div>To Do: create QR code</div>
    <div>if you wanna login as a user set data into TableLogin component</div>
    </>
  )
}
}

export default TableLogin