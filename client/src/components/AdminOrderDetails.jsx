import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import { AuthContext } from '../context/Auth';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const { admin, loading } = useContext(AuthContext);


  useEffect(() => { 
    socket.emit("connectToOrder", {restaurantId: admin.restaurantId, operation: 'find', orderId: id});
    socket.on(`getOrder-${id}`, (receivedOrder) => {
      setOrder(receivedOrder);
  })
 }, []);
 useEffect(() => { 
  console.log(order);

}, [order]);

  return (
    <div>
      <p>Status: {order?.status}</p></div>
  )
}
export default AdminOrderDetails;