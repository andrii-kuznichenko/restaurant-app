
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthTableContext } from '../context/AuthTable';
import { useNavigate } from 'react-router-dom';
import "./OrderSummary.css";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

const OrderSummary = () => {

  const context = useContext(AuthTableContext);
  const [ order, setOrder ] = useState({loading: false});
  const navigate = useNavigate();
  const { orderItems, total } = useContext(AuthTableContext);

 useEffect(() => {
    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      if(receivedOrder?.length > 0){
        setOrder({loading: true});
      }
    });

}, []);

const BackHandler = () =>{
  navigate(-1);
}

useEffect(() => {
  if(order?.loading){
    socket.disconnect();
    navigate('/user/order/confirmation');
  }
},[order])

const SendOrderHandler = () => {
  const mealsInOrder = orderItems.map(meal => {
    return {name: meal._id, quantity: meal.quantity}
  })
  console.log(mealsInOrder);
  socket.emit("connectToOrder", {
    restaurantId: context.table.restaurantId,
    tableNumberId: context.table._id,
    meals: mealsInOrder,
    totalPrice: total,
    operation: 'add'
  });

  socket.disconnect();

  navigate('/user/order/confirmation');
} 


  return (
    <div className="flex items-center justify-center min-h-screen">
     <div className="order-summary-container"
     style={{
      containerBackground: 'var(--color-buttonBackground)',
     
    }}
     >
        <h1 className="font-merienda text-4xl mb-4">Order Summary</h1>
      <ul>
        { orderItems.length > 0 ? (
          orderItems.map((item) => (
            <li key={item._id}>
              {item.quantity} x {item.title} - ${item.price * item.quantity}
            </li>
          ))
        ) : (
          <li>No items in the order</li>
        )}
      </ul>
      <p className="font-nunito-sans italic font-light mt-4">Total: ${total}</p>
      <div className='flex mt-5 gap-5 justify-center'>
      <button 
      className="btn-hoover rounded-full"
      style={{
        backgroundColor: 'var(--color-buttonBackground)',
        color: 'var(--color-buttonText)',
      }}
      onClick={BackHandler}>
        Back
      </button>
      <button 
      className="btn-hoover rounded-full"
      style={{
        backgroundColor: 'var(--color-buttonBackground)',
        color: 'var(--color-buttonText)',
      }}
      onClick={SendOrderHandler}>
        Confirm Order
      </button>
      </div>
    </div>
  </div>  
  );
};

export default OrderSummary;
