import axios from "../axiosInstance";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/Auth";

const MyRestaurant = () => {
    const { admin, loading } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState({})


    useEffect(() => {
        axios
        axios.get(`/dashboard/myrestaurant/${admin.restaurantId}`)
        .then((res) => {
          console.log("Received restaurant data:", res.data);
          setRestaurant(res.data);
        })
        .catch((e) => console.error("Error fetching restaurant data:", e));
          
          
          

      }, []);




  return (
    <div>
        <h1>My Restaurant</h1>
        <p>Restaurant Name: {restaurant.title}</p>
        <p>Restaurant Information: {restaurant.information}</p>
        <p>Restaurant openTime: {restaurant.openTime}</p>
        <p>etc.</p>
        
    </div>
  )
}

export default MyRestaurant