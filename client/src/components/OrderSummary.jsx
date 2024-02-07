import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "../axiosInstance";
import { AuthTableContext } from "../context/AuthTable";
import { useNavigate } from "react-router-dom";
import "./OrderSummary.css";
import "../index.css";
import { Button } from "flowbite-react";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

const OrderSummary = () => {
  const context = useContext(AuthTableContext);
  const [order, setOrder] = useState({ loading: false });
  const navigate = useNavigate();
  const { orderItems, total } = useContext(AuthTableContext);

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
    
    if (orderItems && orderItems.length === 0 ) {
      navigate("/user");
    }

  }, [orderItems])

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
    navigate(`/user/order/meal/${id}`)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mx-3 h-full">
        <div>
      <h1 class="mb-2 text-3xl  text-center mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Order <span class="text-footerBackground dark:text-footerBackground">details.</span></h1>
        <p class="mt-1 mb-10 text-center font-normal text-gray-500 lg:text-xl dark:text-gray-400">Check your order. If you are sure that everything is correct, confirm it.</p>
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
                    <img
                      src={item.image}
                      class="w-17 md:w-20 max-w-full max-h-full rounded-full"
                      alt={item.title}
                    />
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
                      {item.price}
                      <div>EUR</div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total: {item.price * item.quantity} EUR</p>
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
                <span className="text-lg text-gray-700font-bold dark:text-white"> EUR</span>
              </h5>
            </div>
            </div>
        <div>
          <div class="inline-flex mt-7 mb-3">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l" onClick={BackHandler}>
              Back
            </button>
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r" onClick={SendOrderHandler}>
              Confirm Order
            </button>
          </div>
        </div>
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
