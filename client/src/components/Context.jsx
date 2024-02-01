

import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../assets/mockData.json';

export const AppContext = createContext();

function AppProvider ({ children }) {

  const [selectedItem, setSelectedItem] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userMenu, setUserMenu] = useState([]);
  

  const updateSelectedItem = (item) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem?._id === item._id ? null : item
    );
  };

  const updateOrderItems = (item) => {
    const existingItem = orderItems.find((orderItem) => orderItem._id === item._id);

    if (existingItem) {
      setOrderItems((prevItems) =>
        prevItems.map((orderItem) =>
          orderItem._id === item._id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }

    setTotal((prevTotal) => prevTotal + item.price);
  };

  useEffect(() => {
    // Fetch data or set mock data

    // Set usermenu state with the mock data
    console.log("usermenu with mockData:", mockData);
    setUserMenu(mockData);

        
  }, []);

  return (
    <AppContext.Provider value={{ selectedItem, orderItems, total, userMenu, setUserMenu, updateSelectedItem, updateOrderItems, }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
