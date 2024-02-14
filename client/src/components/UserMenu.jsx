'use client';
import React, { useEffect, useState, useContext } from "react";
import ScanServeLogo from '../assets/ScanServeLogo.png';
import { Link, useNavigate } from "react-router-dom";
import UserOrderMeal from "./UserOrderMeal";
import { FaChevronDown } from "react-icons/fa";
import "./UserMenu.css";
import { AuthTableContext } from "../context/AuthTable";
import io from "socket.io-client";
import axios from "../axiosInstance";
import { Accordion } from 'flowbite-react';
import UserMealDetails from "./UserMealDetails";
import LoadingDots from "./LoadingDots";
import DarkModeToggle from "./darkModeToggle";

const UserMenu = () => {

  const context = useContext(AuthTableContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
    transports: ["websocket"],
  });
  const [showMeal, setShowMeal] = useState(false);
  const [mealDetailsId, setMealDetailsId] = useState("");
  
  const [restaurant, setRestaurant] = useState({});
  

  const openMealDetailsHandler = (id) => {
    setMealDetailsId(id);
    setShowMeal(!showMeal);
  };

  const {
    userMenu,
    selectedItem,
    updateSelectedItem,
    updateOrderItems,
    removeOrderItems,
    orderItems,
    categories
  } = useContext(AuthTableContext);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  useEffect(() => {
    axios
      .get(`/dashboard/restaurant/${context.table.restaurantId}`) 
      .then((res) => {
       
          setRestaurant(res.data);
        
      })
      .catch((e) => console.error("Error fetching restaurant data:", e));
  }, []);


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
axios
      .get(`/dashboard/restaurant/${context.table.restaurantId}`) 
      .then((res) => {
       
          setRestaurant(res.data);
        
      })
      .catch((e) => console.error("Error fetching restaurant data:", e));
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
    removeOrderItems(item);
  };

  const NavigateToDetails = (id) => {
    navigate(`order/meal/${id}`)
  }

  return (
    <>
    {showMeal && (
      <>
        <div>
          <UserMealDetails id={mealDetailsId} isMenu={true} setShowMeal={setShowMeal} />
        </div>
      </>
    )}
    
    <div className="mx-auto max-w-screen-md font-Poppins">

    <div className="flex items-center justify-center relative overflow-x-auto p-2 first:rounded-t-lg last:rounded-b-lg py-5 px-5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 font-bold text-xl">
      <img src={ScanServeLogo} alt="Scan & Serve" className="h-10 w-auto mr-2" />
      <span className="text-xl font-bold mr-6">Scan & Serve</span>
      <span className="text-xl font-bold mr-6"> {restaurant.title}</span>
      <span className="text-2xl font-bold"><DarkModeToggle /></span>
    </div>

      {categories && categories.length > 0?
      categories.map(category => (
        
        <Accordion key={category}>
          
        <Accordion.Panel>
          
        <Accordion.Title className='font-bold text-xl relative flex items-center justify-center'>{category}</Accordion.Title>
        <Accordion.Content className="xxs:p-1 s:p-3 md:p-6 lg:p-6 xl:p-6">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {userMenu.menu.map(item => {
          if(item.category === category){
            
            return(
              <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
             
             {/*Meal image, meal title*/}
              <td className="p-4 xxs:p-1 md:p-3 xxs:w-16 xs:w-20 s:w-28 md:w-48">
              <div className="xxs:w-15 xs:w-18 s:w-24  md:w-36  overflow-hidden rounded-full">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.title}/>
              </div>
              </td>

              <td className="px-2 py-2 flex flex-col font-bold text-base xxs:text-sm md:text-l lg:text-l xl:text-l text-gray-800 dark:text-white" onClick={() => openMealDetailsHandler(item._id)}>
              <span
                onClick={() => openMealDetailsHandler(item._id)}
                  className="cursor-pointer hover:text-gray-500 transition duration-300 ease-in-out">
                  {item.title}
              </span>
              <span className='font-semibold'>{item.price} Euro</span>
              </td>

              {/*Add quantity; Total*/}
              <td className="px-2 py-2 text-center align-middle xxs:text-xs s:text-sm md:text-l">
                  
                  <div className="flex items-center justify-center dark:text-gray-200">
                      
                      <button className="inline-flex items-center justify-center p-1 me-3 xxs:me-1 text-sm font-medium h-6 w-6 text-gray-800 bg-white border border-gray-50 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                      type="button"
                      onClick={() => handleRemove(item)}>
                          <span className="sr-only">Quantity button</span>
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                          </svg>
                      </button>

                      <div>
                          <p classNameName="bg-gray-50 w-14 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {getQuantity(item._id)}</p>
                      </div>

                      <button className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 xxs:ms-1 text-sm font-medium text-gray-800 bg-white border border-gray-50 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                      type="button"
                      onClick={() => handleAdd(item)}>
                          <span className="sr-only">Quantity button</span>
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                          </svg>
                      </button>

                  </div>

                  <span className="text-gray-900 dark:text-gray-200 text-center"> {getTotalPrice(item._id)} Euro</span>
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
      :<LoadingDots/>}
      <Link to="/user/order/summary">
    <div className="flex items-center justify-center">
    <button className="bg-colour1 font-bold text-base items-center justify-center text-white rounded h-10 mt-5 mb-10 p-2">
          See your order summary
    </button>
    </div>
      </Link>
  </div>
  </>
   
   
  );
  }

export default UserMenu;

