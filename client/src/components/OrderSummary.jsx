
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthTableContext } from '../context/AuthTable';
import { useNavigate } from 'react-router-dom';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

const OrderSummary = () => {

  const context = useContext(AuthTableContext);
  const [ order, setOrder ] = useState({});
  const navigate = useNavigate();
  const { orderItems, total } = useContext(AuthTableContext);

 useEffect(() => {
    console.log()
    console.log(context.table._id);
    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      // if(receivedOrder.length === 0){
      //   navigate('/user/order/closed');
      // }
      setOrder(receivedOrder[0]);
    });

}, []);


  return (
    <div>
      <h2>Order Summary</h2>
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
      <p>Total: ${total}</p>
      <div className='flex mt-5 gap-5'>
      <button 
      className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded-full">
        Back
      </button>
      <button 
      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
        Confirm Order
      </button>
      </div>
    </div>
    
  );
};

export default OrderSummary;
