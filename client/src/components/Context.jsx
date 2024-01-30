

import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../assets/mockData.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userMenu, setUserMenu] = useState([]);
  

  const updateSelectedItem = (item) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem?.id === item.id ? null : item
    );
  };

  const updateOrderItems = (item) => {
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
