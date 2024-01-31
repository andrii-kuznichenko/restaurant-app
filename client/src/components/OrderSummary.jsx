
import React from 'react';
import { useAppContext } from './Context';

const OrderSummary = () => {

  console.log("OrderSummery is mounted")
  
  const { orderItems, total } = useAppContext();

  return (
    <div>
      <h2>Order Summary</h2>
      <ul>
        {Array.isArray(orderItems) && orderItems.length > 0 ? (
          orderItems.map((item) => (
            <li key={item.id}>
              {item.quantity} x {item.name} - ${item.price * item.quantity}
            </li>
          ))
        ) : (
          <li>No items in the order</li>
        )}
      </ul>
      <p>Total: ${total}</p>
    </div>
  );
};

export default OrderSummary;
