import axios from "../axiosInstance";
import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

const AdminOrders = () => {
  const { admin, loading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  // const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  //   transports: ["websocket"],
  // });

  // const adminSocket = io(
  //   `${import.meta.env.VITE_SERVER_BASE_URL}/restaurant-${restaurantId}`,
  //   {
  //     transports: ["websocket"],
  //   }
  // );

  useEffect(() => {
    // axios
    // axios.get(`/dashboard/orders/${restaurantId}`)
    // .then((res) => {
    //   console.log("Received data:", res.data);
    //   if (Array.isArray(res.data)) {
    //     setNewOrders(res.data);
    //   }
    // })
    // .catch((e) => console.error(e));
      
      
      
      
      
    //   // setNewOrders(res.data))
     

    // adminSocket.emit("join room", "admin");
    // adminSocket.on("new order", (order) => {
    //   console.log("New order received:", order);
    //   setNewOrders((prevOrders) => [order, ...prevOrders]);
    // });

    // return () => {
    //   adminSocket.off("new order");
    //   socket.disconnect();
    // };

    socket.emit("connectToOrder", {restaurantId: admin.restaurantId});
    socket.on(`getOrders-${admin.restaurantId}`, (receivedOrders) => {
      console.log(receivedOrders);
      setOrders(receivedOrders);
      });
  }, []);

  const closeOrderHandler = (e) => {
    console.log(e.target.name);
    socket.emit("connectToOrder", {
      restaurantId: admin.restaurantId,
      orderId: e.target.name,
      operation:'close'});
  }

  return (
    <div>
      <h2>Admin Orders</h2>
      {orders.length === 0 ? (
        <h2>No orders yet</h2>
      ) : (
        orders.map((order, index) => (
          <>
          <div key={index}>
            {order.meals.map((meal, index) => (
              <div key={index}>
                Meal ID: {meal.name.title}, Quantity: {meal.quantity}
              </div>
            ))}
          <h1>status: {order.status}</h1>
          <h2>{order.isClosed?'closed':'in work'}</h2>
          <button onClick={closeOrderHandler} name={order._id}>Close the Order</button>
          </div>
          <hr />
          </>
        ))

      )}
    </div>
  );
};

export default AdminOrders;
