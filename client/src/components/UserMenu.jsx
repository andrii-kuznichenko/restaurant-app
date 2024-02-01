import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserOrderMeal from './UserOrderMeal';
import axios from '../axiosInstance';
import { AuthTableContext } from '../context/AuthTable';
import io from 'socket.io-client';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });


const UserMenu = () => {

  const context = useContext(AuthTableContext);
  const navigate = useNavigate();


  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState({});


  useEffect(() => {

    socket.emit("connectToMenu", {restaurantId: context.table.restaurantId});
    socket.on(`getMenuUser-${context.table.restaurantId}`, (receivedMenu) => {
      console.log(receivedMenu);
      setMenu(receivedMenu);
    });

    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      setOrder(receivedOrder);
    });

}, []);

useEffect(() => {
  if(Object.keys(order).length !== 0){
    socket.disconnect();
    navigate('/user/order/summary');
  }
},[order])

const SendOrder = () => {

  socket.emit("connectToOrder", {
    restaurantId: context.table.restaurantId,
    tableNumberId: context.table._id,
    meals: [{name:"65b2debea687ee49a00630ee", quantity: 2}],
    totalPrice: 30,
    operation: 'add'
  });

  socket.disconnect();

  navigate('/user/order/summary');
} 

  return (
    <>
    <div>UserMenu</div>
    {menu?.length !== 0?menu.menu.map(meal => (
      <h1>
        {meal.title}
      </h1>
    )):<p></p>}
    <button type="button" 
    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    onClick={SendOrder}>
      Send mock order</button>
    </>
  );
};

export default UserMenu;
