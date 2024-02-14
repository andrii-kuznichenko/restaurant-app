import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { AuthTableContext } from '../context/AuthTable';
import { Navigate, useParams } from 'react-router-dom';
import LoadingDots from './LoadingDots';

function TableLogin() {
  const context = useContext(AuthTableContext);
  const {_id, tableNumber, restaurantId} = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    const newUser = {
      _id: _id,
      tableNumber: tableNumber,
      restaurantId: restaurantId
    };
    setUser(newUser);

  },[]);

  useEffect(() => {
    if(user && Object.keys(user).length > 0){
      context.login(user);
    }
  },[user])
  


  if (!context.loading && context.table) {
    console.log('user to navigate', user);
    return (<Navigate to="/user" />)  
  }


if (!context.loading && !context.table) {
  console.log('user to loading', user);
  return (
    <>
    <LoadingDots />
    </>
  )
}
}

export default TableLogin