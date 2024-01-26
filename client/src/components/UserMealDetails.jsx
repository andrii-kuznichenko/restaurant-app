
import React, { useState } from 'react';

const UserMealDetails = ({ item, onAdd, onRemove }) => {
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

  return (
    <div>
      <button onClick={handleRemove}>-</button>
      {quantity} {item.name}
      <button onClick={handleAdd}>+</button>
        
    </div>
  );
};

export default UserMealDetails;
