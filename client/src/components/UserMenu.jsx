import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserOrderMeal from './UserOrderMeal';
import axios from '../axiosInstance';
import { AuthTableContext } from '../context/AuthTable';
import io from 'socket.io-client';
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

const UserMenu = () => {

  const context = useContext(AuthTableContext);


  const [order, setOrder] = useState({
    "tableNumberId":"",
    "meals": [{
      "name": "",
      "quantity": 0
    }],
    "totalPrice": 0,
    "restaurantId":""
  });
  const [menu, setMenu] = useState([]);


  useEffect(() => {

    socket.emit("connectToMenu", {restaurantId: context.table.restaurantId});
    socket.on(`getMenuUser-${context.table.restaurantId}`, (receivedMenu) => {
      setMenu(receivedMenu);
    });

}, []);

  function uploadHandler (e) {

    socket.emit("connectToMenu",  e.target.files[0], (status) => {
    console.log(status);
    });
  }

const handleAccordionClick = (item) => {
    updateSelectedItem(item);
  };

const handleAdd = (item) => {
    updateOrderItems(item);
  };

const handleRemove = (item) => {
    updateOrderItems(item);
  };

  

  return (
    <>
    <div>UserMenu</div>
    <input type="file" onChange={uploadHandler(files)} />
    {/* <div className="user-menu-container">
      <h2>Menu</h2>
      <div className="menu-items">
        {!menu?menu.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              className="w-full p-8 font-medium text-gray-900 border border-b-0 border-gray-400 focus:ring-7 focus:ring-gray-500 hover:bg-gray-100 gap-8"
              onClick={() => handleAccordionClick(item)}
            >
              {item.title}
            </button>
            {selectedItem && selectedItem.id === item._id && (
              <div className="p-10 border border-b-0 border-gray-400">
                <h3>{selectedItem.title}</h3>
                <p>{selectedItem.content}</p>
                <p>Price: ${selectedItem.price}</p>
                <UserOrderMeal
                  item={selectedItem}
                  onAdd={() => handleAdd(selectedItem)}
                  onRemove={() => handleRemove(selectedItem)}
                  name={selectedItem.name}
                  content={selectedItem.content}
                  price={selectedItem.price}
                />

              </div>
            )}
          </div>
        )):<p></p>}
      </div>
      <Link to="./OrderSummary">
       <button className="order-summary-button">See your order summary</button>
     
      </Link>
    </div>
    </> */}
    </>
  );
};

export default UserMenu
