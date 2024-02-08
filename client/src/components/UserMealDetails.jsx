import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { AuthTableContext } from "../context/AuthTable";
import LoadingDots from "./LoadingDots";
import { Card } from "flowbite-react";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function UserMealDetails({ id, isMenu, setShowMeal }) {
  const context = useContext(AuthTableContext);
  const [meal, setMeal] = useState({});
  const {
    userMenu,
    selectedItem,
    updateSelectedItem,
    updateOrderItems,
    removeOrderItems,
    orderItems,
    categories,
  } = useContext(AuthTableContext);

  const getTotalPrice = (id) => {
    const item = orderItems.find((item) => item._id === id);
    const quantity = item?.quantity || 0;
    const price = item?.price || 0;
    const total = price * quantity;
    return total.toFixed(2);
  };

  const getQuantity = (id) => {
    return orderItems.find((item) => item._id === id)?.quantity || 0;
  };

  const handleAdd = (item) => {
    updateOrderItems(item);
  };

  const handleRemove = (item) => {
    removeOrderItems(item);
  };

  const changeState = () =>{
    console.log('11');
    setShowMeal(false);
  }

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
    <>
      <div className="fixed z-30 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-md" onClick={()=>{changeState()}}></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="z-20 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-bottom sm:max-w-sm sm:w-full">
            <Card
              className=" z-20 w-md:max-w-sm"
              imgAlt={meal.title}
              imgSrc={meal.image}
            >
              <div className="flex-grow" onClick={()=>{changeState()}}>
                <div className="flex justify-between items-center" onClick={()=>{changeState()}}>
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
                <p className="text-sm text-gray-500">
                  Category: {meal.category}
                </p>
                <div className="mt-2" onClick={()=>{changeState()}}>
                  <p className="text-sm text-gray-500">
                    Description: {meal.description}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Allergens: {meal.allergens}
                  </p>
                </div>
              </div>
              {isMenu && (
                <>
                  <div className="flex items-center justify-evenly">
                    <button
                      className="inline-flex items-center justify-center p-1 me-3 xxs:me-1 text-sm font-medium h-6 w-6 text-gray-800 bg-white border border-gray-50 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                      onClick={() => handleRemove(meal)}
                    >
                      <span className="sr-only">Quantity button</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 1h16"
                        />
                      </svg>
                    </button>

                    <div>
                       <p className="text-gray-900 text-xl"> {getQuantity(meal._id)} </p>
                    </div>

                    <button
                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 xxs:ms-1 text-sm font-medium text-gray-800 bg-white border border-gray-50 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                      onClick={() => handleAdd(meal)}
                    >
                      <span className="sr-only">Quantity button</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-gray-800 dark:text-gray-400 text-center">
                    {" "}
                    Total: {getTotalPrice(id)} Euro
                  </span>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  ) : (
    <p></p>
  );
}

export default UserMealDetails;
