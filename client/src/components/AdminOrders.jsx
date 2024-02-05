import axios from "../axiosInstance";
import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
import AdminOrderTimeline from "./AdminOrderTimeline";
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Dropdown } from "flowbite-react";
import { Table } from "flowbite-react";

const AdminOrders = () => {
  const { admin, loading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const notify = () => toast("New order!💰");
  const prevOrdersRef = useRef();
  const navigate = useNavigate();
  const [timeElapsed, setTimeElapsed] = useState("");

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

    socket.emit("connectToOrder", { restaurantId: admin.restaurantId });
    socket.on(`getOrders-${admin.restaurantId}`, (receivedOrders) => {
      console.log(receivedOrders);
      // Check if there is a previous state and if the new orders array is longer
      if (
        prevOrdersRef.current &&
        receivedOrders.length > prevOrdersRef.current.length
      ) {
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
      operation: "close",
    });
  };

  const changeOrderStatusHandler = (e) => {
    console.log(e);
    socket.emit("connectToOrder", {
      restaurantId: admin.restaurantId,
      orderId: e.target.name,
      status: e.target.value,
      operation: "change_status",
    });
  };

  const timeSince = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const differenceInSeconds = Math.floor((now - createdAt) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} sec ago`;
    }
    if (differenceInSeconds < 3600) {
      return `${Math.floor(differenceInSeconds / 60)} min ago`;
    }
    if (differenceInSeconds < 86400) {
      return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
    }
    return `${Math.floor(differenceInSeconds / 86400)} days ago`;
  };

  const OrderDetailHandler = (id) => {
    navigate(`admin/order/${id}`);
  };

  const getStatusMessage = (status) => {
    if (status === "in process") {
      return (
        <div className="flex items-center gap-2">
          <span class="flex w-2 h-2 bg-yellow-300 rounded-full"></span>

          <span>In process...</span>
        </div>
      );
    } else if (status === "need to accept") {
      return (
        <div className="flex items-center gap-2">
          <span class="flex w-2 h-2 bg-yellow-300 rounded-full"></span>

          <span>Needs acceptance</span>
        </div>
      );
    } else if (status === "waiting for payment") {
      return (
        <div className="flex items-center gap-2">
          <span class="flex w-2 h-2 bg-yellow-300 rounded-full"></span>

          <span>Awaiting payment</span>
        </div>
      );
    } else if (status === "finished") {
      return (
        <div className="flex items-center gap-2">
          <span class="flex w-2 h-2 bg-green-600 rounded-full"></span>

          <span>Order completed</span>
        </div>
      );
    } else if (status === "order could not be processed") {
      return (
        <div className="flex items-center gap-2">
          <span class="flex w-2 h-2 bg-red-600 rounded-full"></span>
          <span>Order failed</span>
        </div>
      );
    } else {
      return status; // default case
    }
  };

  const selectClass =
    "text-sm group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 :ring-cyan-700 focus:text-cyan-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 rounded-lg focus:ring-2";
  const selectedOptionClass =
    "flex items-center transition-all duration-200 rounded-md text-sm px-4 py-2";

  return (
    <>
      <div className="overflow-x-auto mt-4">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Order</Table.HeadCell>
            <Table.HeadCell>Table</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Order details</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {orders.reverse().map((order, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}
              >
                <Table.Cell>#{index + 1}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  #{order.tableNumberId.tableNumber}
                </Table.Cell>
                <Table.Cell>
                  <span class="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ">
                    <svg
                      class="w-2.5 h-2.5 me-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    {timeSince(order.createdAt)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {order.meals.map((meal, index) => (
                    <div>
                      <div key={index}>
                        {meal.quantity} x {meal.name.title}
                      </div>
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>{getStatusMessage(order.status)}</Table.Cell>
                <Table.Cell>
                  {order.isClosed ? (
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
                      closed
                    </span>
                  ) : (
                    <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                      open
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>{order.totalPrice} €</Table.Cell>
                <Table.Cell>
                  <div
                    onClick={() => OrderDetailHandler(order._id)}
                    className="cursor-pointer font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
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
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default AdminOrders;
