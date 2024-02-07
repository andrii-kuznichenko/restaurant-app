import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthTableContext } from "../context/AuthTable";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import Lottie from "react-lottie";
import waitForAcceptAnimation from "../animations/cookerAnimation.json";
import declinedAnimation from "../animations/declinedAnimation.json";
import thankUouAnimation from "../animations/thankYouAnimation.json";
import cookingAnimation from "../animations/cookingAnimation.json";
import paymentAnimation from "../animations/waitingForPayment.json";
import LoadingDots from "./LoadingDots";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function UserConfirmation() {
  const context = useContext(AuthTableContext);
  const [order, setOrder] = useState({ loading: false });
  const [orderId, setOrderId] = useState("");
  const [currency, setCurrency] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0); // State to track elapsed time
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: waitForAcceptAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };
  const declinedOptions = {
    loop: true,
    autoplay: true,
    animationData: declinedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };
  const thankYouOption = {
    loop: true,
    autoplay: true,
    animationData: thankUouAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };
  const cookingOption = {
    loop: true,
    autoplay: true,
    animationData: cookingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  const paymentOption = {
    loop: true,
    autoplay: true,
    animationData: paymentAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  useEffect(() => {
    axios
      .get(`/order/${context.table._id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data && Object.keys(res.data).length > 0) {
          setOrderId(res.data?._id);
        } else if (res.data === null) {
          navigate("/user");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`/dashboard/restaurant/${context.table.restaurantId}`)
      .then((res) => {
        setCurrency(res.data?.currency);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (orderId?.length > 0) {
      socket.emit("connectToOrder", { orderId: orderId });
      socket.on(`getOrder-${orderId}`, (receivedOrder) => {
        if (receivedOrder?.isClosed) {
          const newOrder = { ...receivedOrder, loading: true, isClose: true };
          setOrder(newOrder);
        } else {
          const newOrder = { ...receivedOrder, loading: true, isClose: false };
          setOrder(newOrder);
        }
      });
    }
  }, [orderId]);

  useEffect(() => {
    // Start the timer when the order status is "in process"
    if (order.status === "in process" && !order.isClosed) {
        const createdAt = new Date(order.updatedAt);
        const now = new Date();
        const differenceInSeconds = Math.floor((now - createdAt) / 1000);
        console.log('111');

      setElapsedTime(order.orderTime * 60 - differenceInSeconds);
      setFlag(true);
    }
  }, [order.status]);

  useEffect(() => {
    if (order.status === "in process" && !order.isClosed) {
      setInterval(() => {
        // Update elapsed time every second
        setElapsedTime((prevElapsedTime) => prevElapsedTime - 1);
      }, 1000);
    }
  }, [flag]);

  const openMealDetailsHandler = (id) => {
    navigate(`/user/order/meal/${id}`)
  }

  return (
      <div className="flex flex-col items-center justify-center h-full">
        {order.loading && !order.isClose ? (
          order.status === "order could not be processed" ? (
            <>
              <h1 className="text-2xl mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                Order was{" "}
                <span className="text-red-700 dark:text-footerBackground">
                  declined.
                </span>{" "}
              </h1>
              <div>
                <p className="mb-2 text-lg font-normal text-gray-900 dark:text-gray-400">
                  Please wait for waiter!
                </p>
              </div>
              <Lottie
                options={declinedOptions}
                height={200}
                width={700}
                style={{
                  width: "90%",
                }}
              />
            </>
          ) : order.status === "need to accept" ? (
            <>
            <div className="flex flex-col text-center">
              <h1 class="text-2xl mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                Order{" "}
                <span class="text-footerBackground dark:text-footerBackground">
                  placed
                </span>{" "}
                succesfully.
              </h1>
              <div>
                <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  Please wait for acception
                </p>
                </div>  
              </div>
              <Lottie
                options={defaultOptions}
                height={200}
                width={700}
                style={{
                  width: "80%",
                }}
              />
            </>
          ) : order.status === "in process" ? (
            <>
              <h1 class="text-2xl mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                Order{" "}
                <span class="text-footerBackground dark:text-footerBackground">
                  confirmed
                </span>{" "}
                succesfully.
              </h1>
              <div>
                <p className="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Order being prepared!
                </p>
              </div>
              <Lottie
                options={cookingOption}
                height={200}
                width={700}
                style={{
                  width: "80%",
                }}
              />
            </>
          ) : order.status === "waiting for payment" ? (
            <>
              <h1 class="text-2xl mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                Waiting{" "}
                <span class="text-footerBackground dark:text-footerBackground">
                  for
                </span>{" "}
                payment.
              </h1>
              <div>
                <p className="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Call the waiter when you're ready!
                </p>
              </div>
              <Lottie
                options={paymentOption}
                height={200}
                width={700}
                style={{
                  width: "80%",
                }}
              />
            </>
          ) : order.isClose ? (
            <>
              <h1 class="text-2xl mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                Thank you{" "}
                <span class="text-footerBackground dark:text-footerBackground">
                  for your
                </span>{" "}
                order!
              </h1>
              <div>
                <p class="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400">
                  We hope to see you again!
                </p>
              </div>
              <Lottie
                options={thankYouOption}
                height={200}
                width={700}
                style={{
                  width: "80%",
                }}
              />
            </>
          ) : (
            <h1>
              <LoadingDots />
            </h1>
          )
        ) : order.isClose ? (
          <>
            <h1 class="text-2xl mt-10 font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
              Thank you{" "}
              <span class="text-footerBackground dark:text-footerBackground">
                for your
              </span>{" "}
              order!
            </h1>
            <div>
              <p class="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400">
                We hope to see you again!
              </p>
            </div>
            <Lottie
              options={thankYouOption}
              height={200}
              width={700}
              style={{
                width: "80%",
              }}
            />
          </>
        ) : (
          <h1>
            <LoadingDots />
          </h1>
        )}
        {order.status === "in process" && !order.isClosed && (
          <>
            <div className="flex gap-5 mt-8 mb-8">
              <div className="text-gray-800">
                <span className="countdown font-mono text-5xl">
                  <span
                    style={{ "--value": Math.floor(elapsedTime / 60) }}
                  ></span>
                </span>
                min
              </div>
              <div className="text-gray-800">
                <span className="countdown font-mono text-5xl">
                  <span style={{ "--value": elapsedTime % 60 }}></span>
                </span>
                sec
              </div>
            </div>
          </>
        )}
        {order && !order.loading ? (
          <p></p>
        ) : (
          <>
            <div className="justify-self-start">
              <h2 class="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Here is your receipt!
              </h2>
            </div>
            <div className="flex flex-col justify-center mx-3">
              <table class="w-100 text-sm text-left rtl:text-right border-dashed border-2 border-gray-300 text-gray-500 dark:text-gray-400">
                <tbody>
                  {order.meals?.length > 0 ? (
                    order.meals.map((item) => (
                      <tr
                        key={item.name._id}
                        className="bg-white border-dashed border-gray-300 border-2 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        onClick={() => openMealDetailsHandler(item._id)}
                      >
                        <td class="p-4">
                          <img
                            src={item.name.image}
                            class="w-18 md:w-20 max-w-full max-h-full rounded-full"
                            alt={item.name.title}
                          />
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {item.name.title}
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
                            {item.name.price * item.quantity}
                            <div>{currency}</div>
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
                {order?.totalPrice}
                <span className="text-lg text-gray-700font-bold dark:text-white"> {currency}</span>
              </h5>
            </div>
            </div>
          </>
        )}
      </div>
  );
}

export default UserConfirmation;
