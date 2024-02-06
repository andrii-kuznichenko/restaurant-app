'use client';
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserOrderMeal from "./UserOrderMeal";
import { FaChevronDown } from "react-icons/fa";
import "./UserMenu.css";
import { AuthTableContext } from "../context/AuthTable";
import io from "socket.io-client";
import axios from "../axiosInstance";
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

  useEffect(() => {
    if(order && order && Object.keys(order).length > 0){
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
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {userMenu.menu.map(item => {
          if(item.category === category){
            return(
              <tr key={item._id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                          <p className="bg-gray-50 w-14 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {getQuantity(item._id)}</p>

                         
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
                  {item.price} Euro
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total: {getTotalPrice(item._id)} Euro</p>
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
   
   
  );
  }

export default UserMenu;

