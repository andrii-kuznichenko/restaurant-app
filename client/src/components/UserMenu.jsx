import React, { useState, useEffect } from 'react';
/*import axios from 'axios';*/
import UserOrderMeal from './UserOrderMeal';
import OrderSummary from './OrderSummary';
import mockData from '../assets/mockData.json';
import './UserMenu.css';

const UserMenu = () => {
  const [usermenu, setUserMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleAccordionClick = (index) => {
    setActiveAccordion((prevIndex) => (prevIndex === index ? null : index));
  };
  

  const handleAdd = (item) => {
   
 // Check if the item is already in the order
 const existingItem = orderItems.find((orderItem) => orderItem.id === item.id);

 if (existingItem) {
   setOrderItems((prevItems) =>
     prevItems.map((orderItem) =>
       orderItem.id === item.id
         ? { ...orderItem, quantity: orderItem.quantity + 1 }
         : orderItem
     )
   );
 } else {
   setOrderItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
 }

 setTotal((prevTotal) => prevTotal + item.price);

  };

  const handleRemove = (item) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id);

    if (existingItem && existingItem.quantity > 0) {
      setOrderItems((prevItems) =>
        prevItems.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      );
      setTotal((prevTotal) => prevTotal - item.price);
    }
  };



  useEffect(() => {
  /* axios
   .get("/api/usermenu")
   .then(res => {
    setUserMenu(res.data);
    setLoading(false);
   })
   .catch(e => {
    console.error(e);
    setLoading(false);
});*/

// Set usermenu state with the mock data
setUserMenu(mockData);
setLoading(false);

}, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-menu-container">
      <h2>User Menu</h2>
      <div className="menu-items">
        {usermenu.map((item, index) => (
          <div key={item.id}>
            <button
              type="button"
              className={`w-full p-8 font-medium text-gray-900 border border-b-0 border-gray-400 focus:ring-7 focus:ring-gray-500 hover:bg-gray-100 gap-8 ${
                activeAccordion === index ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleAccordionClick(index)}
            >
              {item.name}
            </button>
            {activeAccordion === index && (
              <div className="p-10 border border-b-0 border-gray-400">
                <UserOrderMeal
                  item={item}
                  onAdd={() => handleAdd(item)}
                  onRemove={() => handleRemove(item)}
                />

              </div>
            )}
          </div>
        ))}
      </div>
      <OrderSummary orderItems={orderItems} total={total} />
    </div>
  );
};

export default UserMenu
