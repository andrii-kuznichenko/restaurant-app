import axios from "../axiosInstance";
import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminOrders = () => {
  const { admin, loading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const notify = () => toast("New order!💰");
  const prevOrdersRef = useRef();

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
        // Check if there is a previous state and if the new orders array is longer
        if (prevOrdersRef.current && receivedOrders.length > prevOrdersRef.current.length) {
          notify(); // Trigger the notification for a new order
        }
  
        // Update the previous orders ref with the current orders
        prevOrdersRef.current = receivedOrders;
      setOrders(receivedOrders);
      });
  }, []);

  const closeOrderHandler = (e) => {
    socket.emit("connectToOrder", {
      restaurantId: admin.restaurantId,
      orderId: e.target.name,
      operation:'close'});
  }

  const changeOrderStatusHandler = (e) => {
    socket.emit("connectToOrder", {
      restaurantId: admin.restaurantId,
      orderId: e.target.name,
      status: 'waiting for payment',
      operation:'change_status'});
  }

  return (
    <div>
        <ToastContainer />
      <h1 className="text-center py-3">Admin Orders</h1>
      {orders.length === 0 ? (
        <h2>No orders yet</h2>
      ) : (
        orders.map((order, index) => (
          <>
          <div key={index} className="p-2 grid grid-cols-6 justify-between">
            <div className="flex flex-col"><div className="font-bold">Table</div> <div>{order.tableNumberId.tableNumber}</div></div>
            <div className="flex flex-col">
            <div className="font-bold">Order</div>
            {order.meals.map((meal, index) => (
              <div>
              <div key={index}>
                
                {meal.name.title} {meal.quantity}x
              </div>
              </div>
            
            ))}
            </div>
            <div className="flex flex-col"><div className="font-bold">Status</div> <div>{order.status}</div></div>
            <div className="flex flex-col"><div className="font-bold">Closed/active</div> <div>{order.isClosed?'closed':'active'}</div></div>
          <button onClick={closeOrderHandler} name={order._id} className="border-2 hover:bg-red-500">Close the Order</button>
          <button onClick={changeOrderStatusHandler} name={order._id} className="border-2 hover:bg-blue-500">Change Status</button>
          </div>
          <hr />
          </>
        ))

      )}
    </div>
  );
};

export default AdminOrders;
