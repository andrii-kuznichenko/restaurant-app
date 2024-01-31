
import React, { useState } from 'react';

const UserOrderMeal = ({ item, onAdd, onRemove, name, content, price }) => {
  
  console.log("UserOrder is mounted")
  
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(quantity + 1);
    onAdd(item);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      onRemove(item);
    }
  };

  const totalPrice = quantity * price;

  return (
    <div>
       <button onClick={handleRemove}>-</button>
      <span>{quantity}</span>
      <button onClick={handleAdd}>+</button>
      
      <div>Total Price: ${totalPrice.toFixed(2)}</div>
        
    </div>
  );
};

export default UserOrderMeal;
