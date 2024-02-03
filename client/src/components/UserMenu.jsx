import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import UserOrderMeal from "./UserOrderMeal";
import { FaChevronDown } from "react-icons/fa";
import "./UserMenu.css";
import { AuthTableContext } from "../context/AuthTable";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});


const UserMenu = () => {

  const context = useContext(AuthTableContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState({});

  const {
    userMenu,
    setUserMenu,
    selectedItem,
    updateSelectedItem,
    updateOrderItems,
    orderItems
  } = useContext(AuthTableContext);

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);


  useEffect(() => {
    socket.emit("connectToMenu", { restaurantId: '65b37da552aefd47b8a64f21' });
    socket.on(`getMenuUser-65b37da552aefd47b8a64f21`, 
    (receivedMenu) => {

      console.log("Received Menu:", receivedMenu);
      if (Array.isArray(receivedMenu.menu)) {
      // Group meals by category
      const groupedMenu = receivedMenu.menu.reduce((acc, meal) => {
        const category = meal.category;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(meal);

        return acc;
      }, {});

      setUserMenu(groupedMenu);
    } else {
      console.error("Received menu is not an array:", receivedMenu.menu);
    }
  } );
  }, []);


  useEffect(() => { 
    
    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      setOrder(receivedOrder);
  })
 }, []);


  useEffect(() => {
    if(Object.keys(order).length !== 0){
      socket.disconnect();
      navigate('/user/order/confirmation');
    }
  },[order])
  
const getQuantity = (id)=>{
   return orderItems.find(item=>item._id === id)?.quantity || 0
}

const getTotalPrice = (id)=>{
  const item = orderItems.find(item=>item._id === id)
  const quantity = item?.quantity || 0
  const price = item?.price || 0
  const total = price*quantity
  return total.toFixed(2)
}

  const handleAccordionClick = (category) => {
    updateSelectedItem(category);
    setIsAccordionExpanded((prev) => !prev);
  };

  const handleAdd = (item) => {
    updateOrderItems(item);
  };

  const handleRemove = (item) => {
    updateOrderItems(item);
  };

  const NavigateToDetails = (id) => {
    navigate(`order/meal/${id}`)
  }

  return (
    <div className="user-menu-container bg-light-zinc-50  mx-auto px-2 rounded-xl m-2 shadow-[10px_20px_10px_-2px_rgba(0,0,0,0.15),-6px_-6px_10px_-2px_rgba(255,255,255,0.8)]">
      <h2 className="menu-title text-black" style={{ fontFamily: 'Merienda, cursive', fontSize: '1.5rem', lineHeight: 1.5, fontWeight: 900, padding: '0.5rem 0rem' }}>Our Specialties</h2>
      <div className="menu-items text-black flex-col m-6 rounded-xl">
      
    
        {Object.keys(userMenu).length > 0 ? Object.keys(userMenu).map((category) => (
          <div key={category}>
            <button
              type="button"
              className="menu-item menu-item-hover bg-light-zinc-50 relative shadow-[3px_6px_3px_-0.05px_rgba(0,0,0,0.05),-3px_-3px_5px_-0.05px_rgba(255,255,255,0.05)] rounded-xl justify-center text-black flex-col w-full m-3 px-3 justify-between mr-2"
              onClick={() => handleAccordionClick(category)}
            >
              <span style={{ fontFamily: "'Merienda', cursive" }}>
                {category}
              </span>

              <div
                className="arrow-icon-container transform-gpu text-xs sm:text-sm md:text-base lg:text-lg my-1 sm:my-2 md:my-3 lg:my-4"
                style={{
                  transform: `rotate(${
                    selectedItem && selectedItem === category ? "180deg" : "0"
                  })`,
                }}
              >
                <FaChevronDown />
              </div>

              {selectedItem && selectedItem === category && (
                <div className="meal-details relative m-2 flex-col w-full">
                  <p>{category.description}</p>
                  <p>Price: ${selectedItem.price.toFixed(2)}</p>
                  <button class="bg-indigo1 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded-full"
                  onClick={() => NavigateToDetails(item._id)}>
                  See Meal Details
                </button>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{ marginRight: "10px" }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl"
                      >
                        Amount
                      </span>
                      <button
                        onClick={(event)=> {
                          event.stopPropagation();
                          handleRemove(selectedItem)}}
                        style={{
                          borderRadius: "50%",
                          padding: "5px",
                          width: "30px",
                          height: "30px",
                          marginRight: "10px",
                          boxShadow: "0 3px 5px 2px rgba(0,0,0,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl"
                      >
                        -
                      </button>
                      <span
                        style={{ marginRight: "10px" }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl"
                      >
                        {getQuantity(selectedItem._id)}
                      </span>
                      <button
                        onClick={(event)=> {
                          event.stopPropagation();
                          handleAdd(selectedItem)}}
                        style={{
                          borderRadius: "50%",
                          padding: "5px",
                          width: "30px",
                          height: "30px",
                          marginRight: "10px",
                          boxShadow: "0 3px 5px 2px rgba(0,0,0,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg">
                      Total Price: <strong>${getTotalPrice(selectedItem._id)}</strong>
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>
        )): <p>Loading...</p>}

        <script type="module" src="../src/assets"></script>
        <script noModule src="../src/assets"></script>
      </div>
      <Link to="/user/order/summary">
        <button
          className="order-summary-button menu-item-hover bg-indigo1 relative shadow-[3px_6px_3px_-0.05px_rgba(0,0,0,0.05),-3px_-3px_5px_-0.05px_rgba(255,255,255,0.05)] text-black flex-col w-full rounded-xl"
          style={{ 
            fontFamily: "'Merienda', cursive",
            border: '4rem',
            marginBottom: '4rem',
            textAlign: 'center',
            padding: '1rem 2rem'}}>
          See your order summary
        </button>
      </Link>
    </div>
   
  );
  }

export default UserMenu;
