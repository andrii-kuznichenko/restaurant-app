import axios from "../axiosInstance";
import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";

function AdminMenu() {
  const { admin, loading } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios
      .get(`/dashboard/menu/${restaurantId}`)
      .then((res) => {
        console.log("Received menu data:", res.data);
        setMenuItems(res.data);
      })
      .catch((e) => console.error("Error fetching menu:", e));
  }, []);

  return (
    <div>
      <h2>Menu for Restaurant {restaurantId}</h2>
      {menuItems.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Price: {item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminMenu;
