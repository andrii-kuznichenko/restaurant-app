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
import LoadingDots from "./LoadingDots";

const AdminOrders = () => {
  const { admin, loading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoadind, SetOrdersLoading] = useState(true);
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
      setTimeout(() => {
        SetOrdersLoading(false);
   }, 600)
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

  const selectClass = "text-sm group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 :ring-cyan-700 focus:text-cyan-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 rounded-lg focus:ring-2";
  const selectedOptionClass = "flex items-center transition-all duration-200 rounded-md text-sm px-4 py-2"

  return (
    <div>
      <Timeline className="mx-4">
        <ToastContainer />

        {ordersLoadind?<LoadingDots />
        :orders.length === 0 ? (
          <h2>No orders yet</h2>
        ) : (
          orders.map((order, index) => (
            <>
              <Timeline.Item className="border-b-2">
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{timeSince(order.createdAt)}</Timeline.Time>
                  <Timeline.Title>
                    Table {order.tableNumberId.tableNumber}
                  </Timeline.Title>
                  <Timeline.Body>
                    <div
                      key={index}
                      className="p-2 grid grid-cols-4 justify-between"
                    >
                      <div className="flex flex-col">
                        {order.meals.map((meal, index) => (
                          <div>
                            <div key={index}>
                              ●{meal.name.title} {meal.quantity}x
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        
                        <div>{order.status}</div>
                      </div>
                      <div className="flex flex-col">
                        
                        <div>{order.isClosed ? "closed" : "active"}</div>
                      </div>
                      {/* <button onClick={changeOrderStatusHandler} name={order._id} className="border-2 hover:bg-blue-500">Change Status</button> */}
                      <div className="flex flex-col gap-2">
                    <Button
                    color="gray"
                    onClick={() => OrderDetailHandler(order._id)}
                  >
                    Order Details
                    <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                  </Button>
                  <div>
                  <select
                  onChange={(e) => changeOrderStatusHandler(e)}
                  defaultValue={order.status}
                  className={selectClass} 
                  name={order._id}
                  type="button"
                >
                  <option value="in process" > <span className="in-process">In process</span></option>
                  <option value="need to accept">Need to accept</option>
                  <option value="waiting for payment">
                    Waiting for payment
                  </option>
                  <option value="finished">Finished</option>
                  <option value="order could not be processed">
                    Order could not be processed
                  </option>
                </select>
                </div>
                  <Button
                    color="red"
                    onClick={closeOrderHandler}
                    name={order._id}
                  >
                    Close
                  </Button>
                  </div>
                    </div>
                    <div><div className="font-bold">Total price: {order.totalPrice} EUR</div></div>
          
                  </Timeline.Body>


                </Timeline.Content>
              </Timeline.Item>
              
              {/* <div key={index} className="p-2 grid grid-cols-6 justify-between">
                <div className="flex flex-col">
                  <div className="font-bold">Table</div>{" "}
                  <div>{order.tableNumberId.tableNumber}</div>
                  <div>{timeSince(order.createdAt)}</div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold pl-2">Order</div>
                  {order.meals.map((meal, index) => (
                    <div>
                      <div key={index}>
                        ●{meal.name.title} {meal.quantity}x
                      </div>
                    </div>
                  ))}
                  <div>Total price: {order.totalPrice} EUR</div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold">Status</div>{" "}
                  <div>{order.status}</div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold">Closed/active</div>{" "}
                  <div>{order.isClosed ? "closed" : "active"}</div>
                </div>
                <select
                  onChange={(e) => changeOrderStatusHandler(e)}
                  defaultValue={order.status}
                  className="border-2 hover:bg-blue-500"
                  name={order._id}
                >
                  <option value="in process">In process</option>
                  <option value="need to accept">Need to accept</option>
                  <option value="waiting for payment">
                    Waiting for payment
                  </option>
                  <option value="finished">Finished</option>
                  <option value="order could not be processed">
                    Order could not be processed
                  </option>
                </select>
          
                {/* <button onClick={changeOrderStatusHandler} name={order._id} className="border-2 hover:bg-blue-500">Change Status</button> */}
              {/* </div> */} 
              
  
             
            </>
          ))
        )}
      </Timeline>
    </div>
  );
};

export default AdminOrders;
