'use client';
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserOrderMeal from "./UserOrderMeal";
import { FaChevronDown } from "react-icons/fa";
import "./UserMenu.css";
import { AuthTableContext } from "../context/AuthTable";
import io from "socket.io-client";
import { Accordion } from 'flowbite-react';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

const UserMenu = () => {

  const context = useContext(AuthTableContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState({});

  const {
    userMenu,
    selectedItem,
    updateSelectedItem,
    updateOrderItems,
    orderItems,
    categories
  } = useContext(AuthTableContext);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  useEffect(() => { 
    socket.emit("connectToOrder", {restaurantId: context.table.restaurantId});
    socket.on(`getOrder-${context.table._id}`, (receivedOrder) => {
      setOrder(receivedOrder);
  })


 }, []);

  useEffect(() => {
    if(order && Object.keys(order).length !== 0){
      socket.disconnect();
      navigate('/user/order/confirmation');
    }
  },[order])

  useEffect(() => {
    console.log(categories);
  },[categories])

  
const getCategories = () => {
  if(userMenu.menu && userMenu.menu.length > 0){
    console.log('1111');
    const newArrayCategories = userMenu.menu.map(meal => meal.category);
    setCategories(newArrayCategories.filter((category, index) => newArrayCategories.indexOf(category) !== index));
  }
}
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
    const newArrayMeal = userMenu
    updateSelectedItem(item);
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
    <>
      {categories && categories.length > 0?
      categories.map(category => (
        <Accordion>
        <Accordion.Panel>
        <Accordion.Title>{category}</Accordion.Title>
        <Accordion.Content>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {userMenu.menu.map(item => {
          if(item.category === category){
            return(
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="p-4">
                  <img src={item.image} class="w-16 md:w-32 max-w-full max-h-full" alt={item.title}/>
              </td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {item.title}
              </td>
              <td class="px-6 py-4">
                  <div class="flex items-center">
                      <button class="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                      type="button"
                      onClick={() => handleRemove(item)}>
                          <span class="sr-only">Quantity button</span>
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                          </svg>
                      </button>
                      <div>
                          <input type="number" value={getQuantity(item._id)} id="first_product" class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                      </div>
                      <button class="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                      type="button"
                      onClick={() => handleAdd(item)}>
                          <span class="sr-only">Quantity button</span>
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                          </svg>
                      </button>
                  </div>
              </td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {item.price}$
              </td>
          </tr>
            )
          }  
        })}
        </table>
        </div>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
      ))
      :<p></p>}
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
  </>
    // <div className="user-menu-container bg-light-zinc-50  mx-auto px-2 rounded-xl m-2 shadow-[10px_20px_10px_-2px_rgba(0,0,0,0.15),-6px_-6px_10px_-2px_rgba(255,255,255,0.8)]">
    //   <h2 className="menu-title text-black" style={{ fontFamily: 'Merienda, cursive', fontSize: '1.5rem', lineHeight: 1.5, fontWeight: 900, padding: '0.5rem 0rem' }}>Our Specialties</h2>
    //   <div className="menu-items text-black flex-col m-6 rounded-xl">
    //     {userMenu?.menu?.length > 0 ?categories.map((category, index) => (
    //       <div key={index}>
    //         <button
    //           type="button"
    //           className="menu-item menu-item-hover bg-light-zinc-50 relative shadow-[3px_6px_3px_-0.05px_rgba(0,0,0,0.05),-3px_-3px_5px_-0.05px_rgba(255,255,255,0.05)] rounded-xl justify-center text-black flex-col w-full m-3 px-3 justify-between mr-2"
    //           onClick={() => handleAccordionClick(category)}
    //         >
    //           <span style={{ fontFamily: "'Merienda', cursive" }}>
    //             {category}
    //           </span>

    //           <div
    //             className="arrow-icon-container transform-gpu text-xs sm:text-sm md:text-base lg:text-lg my-1 sm:my-2 md:my-3 lg:my-4"
    //             style={{
    //               transform: `rotate(${
    //                 selectedItem && selectedItem._id === item._id ? "180deg" : "0"
    //               })`,
    //             }}
    //           >
    //             <FaChevronDown />
    //           </div>
    //           {userMenu.menu.map(item => (
    //           selectedItem && selectedItem._id === item._id && (
    //             <div className="meal-details relative m-2 flex-col w-full">
    //               <p>{item.description}</p><p>Price: ${selectedItem.price.toFixed(2)}</p><button class="bg-indigo1 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded-full"
    //                   onClick={() => NavigateToDetails(item._id)}>
    //                   See Meal Details
    //                 </button><div
    //                   style={{
    //                     display: "flex",
    //                     flexDirection: "column",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                     <div style={{ display: "flex", alignItems: "center" }}>
    //                       <span
    //                         style={{ marginRight: "10px" }}
    //                         className="text-sm sm:text-base md:text-lg lg:text-xl"
    //                       >
    //                         Amount
    //                       </span>
    //                       <button
    //                         onClick={(event) => {
    //                           event.stopPropagation();
    //                           handleRemove(selectedItem);
    //                         } }
    //                         style={{
    //                           borderRadius: "50%",
    //                           padding: "5px",
    //                           width: "30px",
    //                           height: "30px",
    //                           marginRight: "10px",
    //                           boxShadow: "0 3px 5px 2px rgba(0,0,0,0.3)",
    //                           display: "flex",
    //                           alignItems: "center",
    //                           justifyContent: "center",
    //                         }}
    //                         className="text-sm sm:text-base md:text-lg lg:text-xl"
    //                       >
    //                         -
    //                       </button>
    //                       <span
    //                         style={{ marginRight: "10px" }}
    //                         className="text-sm sm:text-base md:text-lg lg:text-xl"
    //                       >
    //                         {getQuantity(selectedItem._id)}
    //                       </span>
    //                       <button
    //                         onClick={(event) => {
    //                           event.stopPropagation();
    //                           handleAdd(selectedItem);
    //                         } }
    //                         style={{
    //                           borderRadius: "50%",
    //                           padding: "5px",
    //                           width: "30px",
    //                           height: "30px",
    //                           marginRight: "10px",
    //                           boxShadow: "0 3px 5px 2px rgba(0,0,0,0.3)",
    //                           display: "flex",
    //                           alignItems: "center",
    //                           justifyContent: "center",
    //                         }}
    //                         className="text-sm sm:text-base md:text-lg lg:text-xl"
    //                       >
    //                         +
    //                       </button>
    //                     </div>
    //                     <div className="text-xs sm:text-sm md:text-base lg:text-lg">
    //                       Total Price: <strong>${getTotalPrice(selectedItem._id)}</strong>
    //                     </div>
    //                   </div>
    //             </div>
    //           )))}
    //         </button>
    //       </div>
    //     )): <p>Loading...</p>}

    //     <script type="module" src="../src/assets"></script>
    //     <script noModule src="../src/assets"></script>
    //   </div>
    //   <Link to="/user/order/summary">
    //     <button
    //       className="order-summary-button menu-item-hover bg-indigo1 relative shadow-[3px_6px_3px_-0.05px_rgba(0,0,0,0.05),-3px_-3px_5px_-0.05px_rgba(255,255,255,0.05)] text-black flex-col w-full rounded-xl"
    //       style={{ 
    //         fontFamily: "'Merienda', cursive",
    //         border: '4rem',
    //         marginBottom: '4rem',
    //         textAlign: 'center',
    //         padding: '1rem 2rem'}}>
    //       See your order summary
    //     </button>
    //   </Link>
    // </div>
   
  );
  }

export default UserMenu;

