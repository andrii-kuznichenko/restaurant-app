import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "../axiosInstance";
import { AuthTableContext } from "../context/AuthTable";
import { useNavigate } from "react-router-dom";
import "./OrderSummary.css";
import "../index.css";
import { Button } from "flowbite-react";
import UserMealDetails from "./UserMealDetails";


const OrderSummary = () => {
  const context = useContext(AuthTableContext);
  const [order, setOrder] = useState({ loading: false });
  const navigate = useNavigate();
  const { orderItems, total } = useContext(AuthTableContext);
  const [showMeal, setShowMeal] = useState(false);
  const [mealDetailsId, setMealDetailsId] = useState("");
  const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
    transports: ["websocket"],
  });

  useEffect(() => {
    axios
      .get(`/order/${context.table._id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        setState(null, false, error.response.data);
      });
  }, []);

  const BackHandler = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (order && order.loading) {
      navigate("/user/order/confirmation");
    }
  }, [order]);

  useEffect(() => {
    if (orderItems && orderItems.length === 0) {
      navigate("/user");
    }
  }, [orderItems]);

  const SendOrderHandler = () => {
    const mealsInOrder = orderItems.map((meal) => {
      return { name: meal._id, quantity: meal.quantity };
    });
    console.log(mealsInOrder);
    socket.emit("connectToOrder", {
      restaurantId: context.table.restaurantId,
      tableNumberId: context.table._id,
      meals: mealsInOrder,
      totalPrice: total,
      operation: "add",
    });

    navigate("/user/order/confirmation");
  };

  const openMealDetailsHandler = (id) => {
    console.log(id);
    setMealDetailsId(id);
    setShowMeal(!showMeal);
  };

  return (
    <>
      {showMeal && (
        <>
          <div className="absolute h-screen w-screen z-20 opacity-55 bg-gray-400 " onClick={openMealDetailsHandler}/>
          <div  onClick={openMealDetailsHandler}><UserMealDetails id={mealDetailsId} /></div>
        </>
      )}
      <div className="flex flex-col items-center justify-center mx-3 h-full">
        <div>
          <h1 class="mb-2 text-3xl  text-center mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Order{" "}
            <span class="text-footerBackground dark:text-footerBackground">
              details.
            </span>
          </h1>
          <p class="mt-1 mb-10 text-center font-normal text-gray-500 lg:text-xl dark:text-gray-400">
            Check your order. If you are sure that everything is correct,
            confirm it.
          </p>
        </div>
        <div>
          <table class="w-100 text-sm text-left border-dashed border-2 border-gray-300 rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white border-dashed border-gray-300 border-2 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => openMealDetailsHandler(item._id)}
                  >
                    <td class="p-4">
                    <div className="xxs:w-12 xs:w-18 s:w-24  md:w-36  overflow-hidden rounded-full">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.title}/>
              </div>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </td>
                    <td class="px-6 py-4 ">
                      <div className="flex items-center">
                        <svg
                          class="w-3 h-3 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18 18 6m0 12L6 6"
                          />
                        </svg>
                        <div className="text-base mb-0.5 font-semibold">
                          {item.quantity}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <div className="flex gap-0.5 items-end">
                      {item.price * item.quantity}
                        <div>EUR</div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <li>No items in the order</li>
              )}
            </tbody>
          </table>
          <div className="flex justify-evenly">
            <h5 class="text-xl text-gray-700  mb-10 font-bold dark:text-white mt-5">
              Total:
            </h5>
            <h5 class="text-xl text-gray-700  mb-10 font-bold dark:text-white mt-5">
              {total}
              <span className="text-lg text-gray-700font-bold dark:text-white">
                {" "}
                EUR
              </span>
            </h5>
          </div>
          <div class="flex justify-between mt-3 mb-3">
            <button
              type="button"
              class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={BackHandler}
            >
              Back
            </button>
            <button
              class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-500 to-teal-700 group-hover:from-teal-500 group-hover:to-teal-700 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-teal-200 dark:focus:ring-teal-800"
              onClick={SendOrderHandler}
            >
              <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Confirm Order
              </span>
            </button>
          </div>
        </div>
        <div></div>
      </div>
      {/* <div className="order-summary-container bg-light-zinc-50"
   
     >
        <h1 className="font-merienda text-4xl mb-4">Order Summary</h1>
      <ul>
        { orderItems.length > 0 ? (
          orderItems.map((item) => (
            <li key={item._id}>
              {item.quantity} x {item.title} - {item.price * item.quantity} Euro
            </li>
          ))
        ) : (
          <li>No items in the order</li>
        )}
      </ul>
      <p className="font-nunito-sans italic font-light mt-4">Total price {total} Euro</p>
      <div className='flex mt-5 gap-5 justify-center'>
      <button 
      className="btn-hoover rounded-full bg-indigo1"
     
      onClick={BackHandler}>
        Back
      </button>
      <button 
      className="btn-hoover rounded-full bg-indigo1"
      
      onClick={SendOrderHandler}>
        Confirm Order
      </button>
      </div>
    </div> */}
    </>
  );
};

export default OrderSummary;
