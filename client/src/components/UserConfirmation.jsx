import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthTableContext } from '../context/AuthTable';
import { useNavigate } from 'react-router-dom';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

function UserConfirmation() {

  const context = useContext(AuthTableContext);
  const [ order, setOrder ] = useState({loading: false});

 useEffect(() => {
    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      if(receivedOrder?.length === 0){
        const newOrder = {...receivedOrder[0], loading: true, isClose: true};
        setOrder(newOrder);
      } else if (receivedOrder?.length > 0){
        const newOrder = {...receivedOrder[0], loading: true, isClose: false};
        setOrder(newOrder);
      }
    });

}, []);

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
    </div>
    :order.isClose?<h1>Thank you for your order</h1>:<h1>Loading...</h1>    
  )
}

export default UserConfirmation