
import React, { useContext } from 'react';
import { AppContext } from './Context';

const OrderSummary = () => {

  console.log("OrderSummery is mounted")
  
  const { orderItems, total } = useContext(AppContext);

  return (
    <div>
      <h2>Order Summary</h2>
      <ul>
        {Array.isArray(orderItems) && orderItems.length > 0 ? (
          orderItems.map((item) => (
            <li key={item._id}>
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
