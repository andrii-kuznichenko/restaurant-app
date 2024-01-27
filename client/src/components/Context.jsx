

import React, { createContext, useContext, useState } from 'react';

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

  return (
    <AppContext.Provider value={{ selectedItem, orderItems, total, userMenu, setUserMenu, updateSelectedItem, updateOrderItems }}>
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
