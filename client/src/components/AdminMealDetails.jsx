import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import { AuthContext } from '../context/Auth';

function AdminMealDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState({});
  const { admin, loading } = useContext(AuthContext);
  const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
    transports: ["websocket"],
  });


  useEffect(() => { 
    socket.emit("connectToMenu", {restaurantId: admin.restaurantId, operation: 'find', mealId: id});
    socket.on(`getMeal-${id}`, (receivedMeal) => {
      setMeal(receivedMeal);
  })
 }, []);
 useEffect(() => { 
  console.log(meal);

}, [meal]);

  return (
    <div>
      <p>Title: {meal?.title}</p></div>
  )
}

export default AdminMealDetails;