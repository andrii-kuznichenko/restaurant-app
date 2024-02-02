import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthTableContext } from '../context/AuthTable';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance'
import LoadingDots from './LoadingDots';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

function UserConfirmation() {

  const context = useContext(AuthTableContext);
  const [ order, setOrder ] = useState({loading: false});
  const [orderId, setOrderId] = useState('');

 useEffect(() => {
  axios
  .get(`/order/${context.table._id}`)
  .then((res) => {
    setOrderId(res.data?._id);

  })
  .catch((error) => {
    console.log(error);
  });

}, []);

useEffect(() => {
  if(orderId?.length > 0){
    socket.emit("connectToOrder", {orderId: orderId});
    socket.on(`getOrder-${orderId}`, (receivedOrder) => {
      if(receivedOrder?.isClosed){
        const newOrder = {...receivedOrder, loading: true, isClose: true};
        setOrder(newOrder);
      } else {
        const newOrder = {...receivedOrder, loading: true, isClose: false};
        setOrder(newOrder);
      }
    });
  }
},[orderId])

useEffect(() => {
  console.log(order);
},[order])

  return (
    order.loading && !order.isClose 
      ?order.status === 'order could not be processed'?
      <p>Sorry we could not procces your order. Wait for waiter</p>:<div>
      <h2>Order Summary</h2>
      <ul>
        { order.meals?.length > 0 ? (
          order.meals.map((item) => (
            <li key={item._id}>
              {item.quantity} x {item.name.title} - ${item.name.price * item.quantity}
            </li>
          ))
        ) : (
          <li>No items in the order</li>
        )}
      </ul>
      <p>Total: {order?.totalPrice}</p>
      <h1>STATUS: {order?.status}</h1>
      {order.status === 'in process'
      ?<p>OrderTime: {order.orderTime}</p>
      :<p>asdasda</p>}
    </div>
    :order.isClose?<h1>Thank you for your order</h1>:<h1><LoadingDots /></h1>    
  )
}

export default UserConfirmation