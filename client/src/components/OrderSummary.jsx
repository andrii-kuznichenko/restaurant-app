
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthTableContext } from '../context/AuthTable';
import { useNavigate } from 'react-router-dom';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

const OrderSummary = () => {

  const context = useContext(AuthTableContext);
  const [ order, setOrder ] = useState({});
  const navigate = useNavigate();

 useEffect(() => {
    console.log(context.table._id);
    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      if(receivedOrder.length === 0){
        navigate('/user/order/closed');
      }
      setOrder(receivedOrder[0]);
    });

}, []);


  return (
    <div>
      <h2>Order Summary</h2>
      <ul>
        { order?.meals?.length > 0 ? (
          order.meals.map((item) => (
            <li key={item._id}>
              {item.quantity} x {item.name.title} - ${item.name.price * item.quantity}
            </li>
          ))
        ) : (
          <li>No items in the order</li>
        )}
      </ul>
      <p>Total: ${order?.totalPrice}</p>
      <h1>STATUS: {order?.status}</h1>
    </div>
  );
};

export default OrderSummary;
