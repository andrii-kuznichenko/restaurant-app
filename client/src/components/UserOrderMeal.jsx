
import React, { useState } from 'react';

const UserOrderMeal = ({ item, onAdd, onRemove, name, content, price }) => {
  
  console.log("UserOrder is mounted")
  
  const [quantity, setQuantity] = useState(0);

  const handleAdd = (event) => {
    event.stopPropagation();
    setQuantity(quantity + 1);
    onAdd(item); 
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    if (quantity > 0) {
      setQuantity(quantity - 1);
      onRemove(item);
    }
  };

  const totalPrice = quantity * price;

  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }} className="text-sm sm:text-base md:text-lg lg:text-xl">Amount</span>
        <button onClick={handleRemove} style={{ borderRadius: '50%', padding: '5px', width: '30px', height: '30px', marginRight: '10px', boxShadow: '0 3px 5px 2px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-sm sm:text-base md:text-lg lg:text-xl">-</button>
        <span style={{ marginRight: '10px' }} className="text-sm sm:text-base md:text-lg lg:text-xl">{quantity}</span>
        <button onClick={handleAdd} style={{ borderRadius: '50%', padding: '5px', width: '30px', height: '30px', marginRight: '10px', boxShadow: '0 3px 5px 2px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-sm sm:text-base md:text-lg lg:text-xl">+</button>
      </div>
      <div className="text-xs sm:text-sm md:text-base lg:text-lg">Total Price: <strong>${totalPrice.toFixed(2)}</strong></div>
    </div>
  );
};

export default UserOrderMeal;
