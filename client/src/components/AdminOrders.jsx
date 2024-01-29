import axios from "../axiosInstance";
import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

const AdminOrders = () => {
  const { admin, loading } = useContext(AuthContext);
  const [newOrders, setNewOrders] = useState([]);
  const adminUserId = admin._id;

  useEffect(() => {
    // axios
    // .get(`/api/books`)
    // .then(res => setBooks(res.data))
    // .catch(e => console.error(e));

    socket.on(`getOrders-${adminUserId}`, orders => {
      console.log("Received orders:", orders);
      setNewOrders(orders);
    });

    return () => {
      socket.off(`getOrders-${adminUserId}`);
      socket.disconnect();
    };
  }, [adminUserId]);

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
