
import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../assets/mockData.json';
import io from "socket.io-client";
import { AuthTableContext } from './AuthTable';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
})
export const AppContext = createContext();

function AppProvider ({ children }) {

  const context = useContext(AuthTableContext);
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
    console.log(context.table);
    socket.emit("connectToMenu", {restaurantId: '65b37da552aefd47b8a64f21'});
    socket.on(`getMenuUser-65b37da552aefd47b8a64f21`, (receivedMenu) => {
      console.log(receivedMenu);
      setUserMenu(receivedMenu);
    });
  }, []);

  return (
    <AppContext.Provider value={{ selectedItem, orderItems, total, userMenu, setUserMenu, updateSelectedItem, updateOrderItems, }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
