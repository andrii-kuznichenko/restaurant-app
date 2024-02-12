import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { AuthTableContext } from '../context/AuthTable';
import { Navigate, useParams } from 'react-router-dom';
import LoadingDots from './LoadingDots';

function TableLogin() {
  const context = useContext(AuthTableContext);
  const {_id, tableNumber, restaurantId} = useParams();


  if (!context.loading && context.table) {
    const user = {
      _id: _id,
      tableNumber: tableNumber,
      restaurantId: restaurantId
    };
    console.log(user);
    context.login(user);

    return (<Navigate to="/user" />)
    
  }


if (!context.loading && !context.table) {
  return (
    <>
    <LoadingDots />
    </>
  )
}
}

export default TableLogin