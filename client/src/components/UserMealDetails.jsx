import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import { AuthTableContext } from '../context/AuthTable';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function UserMealDetails() {
  const context = useContext(AuthTableContext);
  const { id } = useParams();
  const [meal, setMeal] = useState({});

  useEffect(() => { 
    socket.emit("connectToMenu", {restaurantId: context.table.restaurantId, mealId: id, operation: 'find'});
    socket.on(`getMeal-${id}`, (receivedMeal) => {
      setMeal(receivedMeal)
  })
 }, []);

  return (
    <div>UserMealDetails{meal?.title}</div>
  )
}

export default UserMealDetails