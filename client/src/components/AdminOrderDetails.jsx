import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import { AuthContext } from '../context/Auth';
import { Badge, Progress } from 'flowbite-react';
import { HiCheck, HiClock } from 'react-icons/hi';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({loading:true});
  const { admin, loading } = useContext(AuthContext);
  const prevOrdersRef = useRef();


  useEffect(() => { 
    socket.emit("connectToOrder", {restaurantId: admin.restaurantId, operation: 'find', orderId: id});
    socket.on(`getOrder-${id}`, (receivedOrder) => {
      setOrder({...receivedOrder, loading: false});
  })
 }, []);
 useEffect(() => { 
  console.log(order);

}, [order]);

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

const AcceptOrderHandler = () => {
  socket.emit("connectToOrder", {
    restaurantId: admin.restaurantId,
    orderId: id,
    status: 'in process',
    operation:'change_status'});
}

const DeclineOrderHandler = () => {
  socket.emit("connectToOrder", {
    restaurantId: admin.restaurantId,
    orderId: id,
    status: 'order could not be processed',
    operation:'change_status'});
}

const CloseOrderHandler = () => {
  socket.emit("connectToOrder", {
    restaurantId: admin.restaurantId,
    orderId: id,
    operation:'close'});
}

  return (
    <>
    <div>
      {order.loading?<p>Loading...</p>:
      <div>
      <div className='flex items-start py-3'>
      <div className='flex flex-col'>
        <h2 className="text-3xl mx-5 font-extrabold dark:text-black">Table #{order.tableNumberId.tableNumber}</h2>
        <span class=" bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-5 py-0.5 rounded mx-6 mt-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ">
        <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
        </svg>
        {timeSince(order.createdAt)}
        </span>
      </div>
      <div className="mt-2">
      <span className="flex items-center text-sm font-medium text-gray-500 dark:text-white me-5">
      <span className={order.status==='order could not be processed'?"flex w-2.5 h-2.5 bg-red-600 rounded-full me-1.5 flex-shrink-0":"flex w-2.5 h-2.5 bg-blue-600 rounded-full me-1.5 flex-shrink-0"}>
      </span>{order.status}</span>
      </div> 
      </div>
      <div className='mx-8'>
          <ol class="flex items-center">
        <li class="relative w-full mb-6">
            {order.status === 'need to accept' ?
            <div class="flex items-center">
            <div class="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                <span class="flex w-3 h-3 bg-blue-600 rounded-full"></span>
            </div>
            <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
            :<div class="flex items-center">
                <div class="z-10 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                    <svg class="w-2.5 h-2.5 text-blue-100 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                </div>
                <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
            </div>}
            <div class="mt-3">
                <h3 class="font-medium text-gray-900 dark:text-white">Need to Accept</h3>
            </div>
        </li>
        <li class="relative w-full mb-6">
            {order.status === 'need to accept'?
              <div class="flex items-center">
              <div class="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                  </svg>
              </div>
              <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
          </div>
            :order.status === 'order could not be processed'?
            <div class="flex items-center">
            <div class="z-10 flex items-center justify-center w-6 h-6 bg-red-200 rounded-full ring-0 ring-white dark:bg-red-700 sm:ring-8 dark:ring-red-900 shrink-0">
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
              </svg>
            </div>
            <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
            :<div class="flex items-center">
                <div class="z-10 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                    <svg class="w-2.5 h-2.5 text-blue-100 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                </div>
                <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
            </div>}
            <div class="mt-3">
                <h3 class="font-medium text-gray-900 dark:text-white">In Process</h3>
            </div>
        </li>
        <li class="relative w-full mb-6">
        {order.status === 'need to accept'?
              <div class="flex items-center">
              <div class="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                  </svg>
              </div>
              <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
          </div>
            :order.status === 'order could not be processed'?
            <div class="flex items-center">
            <div class="z-10 flex items-center justify-center w-6 h-6 bg-red-200 rounded-full ring-0 ring-white dark:bg-red-700 sm:ring-8 dark:ring-red-900 shrink-0">
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
              </svg>
            </div>
            <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
            :order.status === 'waiting for payment'?
            <div class="flex items-center">
            <div class="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                <span class="flex w-3 h-3 bg-blue-600 rounded-full"></span>
            </div>
            <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
            :<div class="flex items-center">
                <div class="z-10 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                    <svg class="w-2.5 h-2.5 text-blue-100 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                </div>
                <div class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
            </div>}
            <div class="mt-3">
                <h3 class="font-medium text-gray-900 dark:text-white">Waiting for payment</h3>
            </div>
        </li>
        <li class="relative w-full mb-6">
           {order.isClosed?
           <div class="flex items-center">
                <div class="z-10 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                    <svg class="w-2.5 h-2.5 text-blue-100 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                </div>
            </div>: <div class="flex items-center">
                <div class="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                    <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                </div>
            </div>}
            <div class="mt-3">
                <h3 class="font-medium text-gray-900 dark:text-white">{order.status === 'order could not be processed'?'Closed Order':'Finished'}</h3>
            </div>
        </li>
    </ol>
    </div>
      <div>
        <div class="relative overflow-x-auto">
      <table class="w-90 my-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" class="px-6 py-3">
                      Product Name
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Allergens
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Quantity
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Price
                  </th>
              </tr>
          </thead>
          <tbody>
              {order.meals.map(meal => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {meal.name.title}
                  </th>
                  <td class="px-6 py-4">
                      {meal.name.allergens}
                  </td>
                  <td class="px-6 py-4">
                      {meal.quantity}
                  </td>
                  <td class="px-6 py-4">
                      {meal.name.price}
                  </td>
              </tr>))}
          </tbody>
      </table>
  </div>
      </div>
      <div className='flex mx-5'>
        {order.status === 'need to accept'?
        <><button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
                  onClick={AcceptOrderHandler}>
                  Accept Oder</button><button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={DeclineOrderHandler}>
                    Decline Order</button></>:order.status === 'order could not be processed'?
      <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      onClick={CloseOrderHandler}>
      Close Order</button>
      :<p></p>}
      </div>

      </div>}</div>
      </>
  )
}
export default AdminOrderDetails;