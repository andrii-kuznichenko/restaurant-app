// src/context/NotificationContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { AuthContext } from "./Auth";

const Notification = createContext();

export const useNotification = () => useContext(Notification);

const notify = () => toast("New order!💰");

export const NotificationProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { admin, loading } = useContext(AuthContext);
  const prevOrdersRef = useRef();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      transports: ["websocket"],
    });
    console.log(admin);
    if (admin) {
      socket.emit("connectToOrder", { restaurantId: admin.restaurantId });
      socket.on(`getOrders-${admin.restaurantId}`, (receivedOrders) => {
        setOrders(receivedOrders);
      });
      return () => socket.disconnect();
    }
  }, [admin]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      if (
        prevOrdersRef.current &&
        orders.length > prevOrdersRef.current.length
      ) {
        notify();
      }
      prevOrdersRef.current = orders;
    }
  }, [orders]);

  return (
    <Notification.Provider value={{ notify }}>{children}</Notification.Provider>
  );
};
