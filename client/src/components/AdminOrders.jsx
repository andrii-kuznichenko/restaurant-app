import axios from "../axiosInstance";
import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";

const AdminOrders = () => {
  const { admin, loading } = useContext(AuthContext);
  const restaurantId = admin.restaurantId;

  const [newOrders, setNewOrders] = useState([]);
  const adminUserId = admin._id;

  const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
    transports: ["websocket"],
  });

  const adminSocket = io(
    `${import.meta.env.VITE_SERVER_BASE_URL}/restaurant-${restaurantId}`,
    {
      transports: ["websocket"],
    }
  );

  useEffect(() => {
    axios
    axios.get(`/dashboard/orders/${restaurantId}`)
    .then((res) => {
      console.log("Received data:", res.data);
      if (Array.isArray(res.data)) {
        setNewOrders(res.data);
      }
    })
    .catch((e) => console.error(e));
      
      
      
      
      
      // setNewOrders(res.data))
     

    adminSocket.emit("join room", "admin");
    adminSocket.on("new order", (order) => {
      console.log("New order received:", order);
      setNewOrders((prevOrders) => [order, ...prevOrders]);
    });

    return () => {
      adminSocket.off("new order");
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Admin Orders</h2>
      {newOrders.length === 0 ? (
        <h2>No orders yet</h2>
      ) : (
        newOrders.map((order, index) => (
          <>
          <div key={index}>
            {order.meals.map((meal, index) => (
              <div key={index}>
                Meal ID: {meal.name.title}, Quantity: {meal.quantity}
              </div>
            ))}
          </div>
          <hr />
          </>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
