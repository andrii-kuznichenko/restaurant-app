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
        <Accordion key={category}>
        <Accordion.Panel>
        <Accordion.Title>{category}</Accordion.Title>
        <Accordion.Content>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 xxs:table-fixed">
        {userMenu.menu.map(item => {
          if(item.category === category){
            return(
              <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="p-0.1">
                  <img src={item.image} className="w-full max-w-full h-auto rounded-xl" 
                  alt={item.title}
                  style={{ height: 'auto' }}
                  />
              </td>
              <td className="px-6 py-4 m-2 flex flex-col items-center text-gray-900 dark:text-white">
                 
              <span className="font-merienda font-bold">{item.title}</span>

                  <button className="bg-indigo1 text-center hover:bg-blue-500 text-black font-bold inline-flex items-center px-2 py-2 w-16 h-8 rounded-full"
                  onClick={() => NavigateToDetails(item._id)}>
                  Details
                </button>

              </td>

              <td className="px-3 py-2">
                  <div class="flex flex-col items-center md:flex-row md:items-center">
                      <button className="mb-2 md:mb-0 inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                      type="button"
                      onClick={() => handleRemove(item)}>
                          <span class="sr-only">Quantity button</span>
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                          </svg>
                      </button>
                      <div className="mb-2 md:mb-0">
                          <input type="number" value={getQuantity(item._id)} id="first_product" class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>

                         
                      </div>
                      <button className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                      type="button"
                      onClick={() => handleAdd(item)}>
                          <span className="sr-only">Quantity button</span>
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                          </svg>
                      </button>
                      
                  </div>
              </td>
              <td className="px-1 py-1 flex-col font-semibold text-gray-900 dark:text-white">
                  <span>{item.price} Euro</span>
                  <p className="text-gray-900 dark:text-gray-400 mt-1 md:mt-0">Total: {getTotalPrice(item._id)} Euro</p>
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

    <div className="flex justify-center items-center"> 
    <Link to="/user/order/summary">
    <button
        className="order-summary-button bg-indigo1 hover:bg-blue-500 text-black font-merienda font-bold inline-flex items-center px-2 py-2 text-black w-23 h-8 rounded-full mt-2 mb-16">
          See your order summary
        </button>
      </Link>
    </div>
  </>
   
  );
  }

export default UserMenu;

