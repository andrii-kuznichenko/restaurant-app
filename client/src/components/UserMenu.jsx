import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './Context';
/*import axios from 'axios';*/

import UserOrderMeal from './UserOrderMeal';

import mockData from '../assets/mockData.json';
import './UserMenu.css';

const UserMenu = () => {

  console.log("UserMenu component mounted");

  const { userMenu, setUserMenu, selectedItem, updateSelectedItem, updateOrderItems, loading, setLoading } = useAppContext();

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
    

const handleAccordionClick = (item) => {
    updateSelectedItem(item);
  };

const handleAdd = (item) => {
    updateOrderItems(item);
  };

const handleRemove = (item) => {
    updateOrderItems(item);
  };



  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-menu-container">
      <h2>Menu</h2>
      <div className="menu-items">
        {userMenu.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              className="w-full p-8 font-medium text-gray-900 border border-b-0 border-gray-400 focus:ring-7 focus:ring-gray-500 hover:bg-gray-100 gap-8"
              onClick={() => handleAccordionClick(item)}
            >
              {item.name}
            </button>
            {selectedItem && selectedItem.id === item.id && (
              <div className="p-10 border border-b-0 border-gray-400">
                <h3>{selectedItem.name}</h3>
                <p>{selectedItem.content}</p>
                <p>Price: ${selectedItem.price.toFixed(2)}</p>
                <UserOrderMeal
                  item={selectedItem}
                  onAdd={() => handleAdd(selectedItem)}
                  onRemove={() => handleRemove(selectedItem)}
                  name={selectedItem.name}
                  content={selectedItem.content}
                  price={selectedItem.price}
                />

              </div>
            )}
          </div>
        ))}
      </div>
      <Link to="./OrderSummary">
       <button className="order-summary-button">See your order summary</button>
     
      </Link>
    </div>
  );
};

export default UserMenu
