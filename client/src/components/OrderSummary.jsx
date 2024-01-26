
import React from 'react';

const OrderSummary = ({ orderItems, total }) => {
  return (
    <div>
      <h2>Order Summary</h2>
      <ul>
        {orderItems.map((item) => (
          <li key={item.id}>
            {item.quantity} x {item.name} - ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
    </div>
  );
};

export default OrderSummary;
