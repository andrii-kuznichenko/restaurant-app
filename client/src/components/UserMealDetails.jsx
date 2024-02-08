import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { AuthTableContext } from "../context/AuthTable";
import LoadingDots from "./LoadingDots";
import { Card } from "flowbite-react";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function UserMealDetails({ id }) {
  const context = useContext(AuthTableContext);
  const [meal, setMeal] = useState({});

  useEffect(() => {
    socket.emit("connectToMenu", {
      restaurantId: context.table.restaurantId,
      mealId: id,
      operation: "find",
    });
    socket.on(`getMeal-${id}`, (receivedMeal) => {
      setMeal(receivedMeal);
    });
  }, []);

  return meal && Object.keys(meal).length > 0 ? (
    <div className="absolute z-30 inset-x-0 bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto">
    <div className="flex items-center justify-center ">
      <Card className="max-w-sm" imgAlt={meal.title} imgSrc={meal.image}>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              {meal.title}
            </h3>
            <p className="text-lg leading-6 font-medium text-gray-900">
              €{meal.price}
            </p>
          </div>
          <p className="text-sm text-gray-500">Category: {meal.category}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Description: {meal.description}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Allergens: {meal.allergens}</p>
          </div>
        </div>
      </Card>
    </div>
    </div>
  ) : (
    <p></p>
  );
}

export default UserMealDetails;
