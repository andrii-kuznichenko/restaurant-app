import axios from "../axiosInstance";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

const AdminOrders = () => {
  const [newOrders, setNewOrders] = useState([]);
  const adminUserId = '65b7b5bd1d74a6082d25ffcb';

  useEffect(() => {
    // axios
    // .get(`/api/books`)
    // .then(res => setBooks(res.data))
    // .catch(e => console.error(e));

    socket.on(`getOrders-65b3b26aef210c44a63af9b2`, orders => {
      console.log("Received orders:", orders);
      setNewOrders((existingOrders) => [...existingOrders, ...orders]);
    });

    return () => {
      socket.off(`getOrders-65b3b26aef210c44a63af9b2`);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
    <h2>Admin Orders</h2>
    {newOrders.length === 0 ? (
      <h2>No orders yet</h2>
    ) : (
      newOrders.map((order) => (
        <div key={order._id}>
          {order.meals.map((meal) => (
            <div key={meal._id}>
              Meal ID: {meal.name}, Quantity: {meal.quantity}
            </div>
          ))}
        </div>
      ))
    )}
  </div>
  );
};

export default AdminOrders;
