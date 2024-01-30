import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './Context';
/*import axios from 'axios';*/

import UserOrderMeal from './UserOrderMeal';
import mockData from '../assets/mockData.json';
import { FaChevronDown } from 'react-icons/fa';
import './UserMenu.css';

const UserMenu = () => {

  console.log("UserMenu component mounted");

  const { userMenu, setUserMenu, selectedItem, updateSelectedItem, updateOrderItems } = useAppContext();
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  useEffect(() => {
    /* axios
     .get("/api/usermenu")
     .then(res => {
      setUserMenu(res.data);
      setLoading(false);
     })
     .catch(e => {
      console.error(e);
      setLoading(false);
  });*/
  
  // Set usermenu state with the mock data
 
  setUserMenu(mockData);
  
}, []);
    

const handleAccordionClick = (item) => {
    updateSelectedItem(item);
    setIsAccordionExpanded((prev) => !prev);
  };

const handleAdd = (item) => {
    updateOrderItems(item);
  };

const handleRemove = (item) => {
    updateOrderItems(item);
  };

  
  return (
    <div className="user-menu-container mx-auto px-20 rounded-xl m-[20px] bg-blue-grey-750 shadow-[10px_20px_10px_-2px_rgba(0,0,0,0.15),-6px_-6px_10px_-2px_rgba(255,255,255,0.8)]">
      <h2 className="text-orange-100">Menu</h2>
      <div className="menu-items rounded-xl m-[15px] space-x-6 space-y-6 justify-center text-[#4d4d4d">
        
        
        {userMenu.map((item) => (
          <div key={item.id}>
                        
            <button
              type="button"
              className="menu-item relative w-[600px] bg-orange-500 shadow-[10px_20px_10px_-2px_rgba(0,0,0,0.15),-6px_-6px_10px_-2px_rgba(255,255,255,0.8)] rounded-xl m-[15px] font-bold tracking-[1px] mx-[20px] h-[50px] flex items-center justify-center text-black m-6"
              onClick={() => handleAccordionClick(item)}
            >
               {item.name}

              <div className="arrow-icon-container" style={{ transform: `rotate(${selectedItem && selectedItem.id === item.id ? '180deg' : '0'})` }}>
              <FaChevronDown />
              </div>
            
            </button>


            {selectedItem && selectedItem.id === item.id && (
              <div className="meal-details relative w-[600px] text-orange-100  m-6">
                <p>{selectedItem.content}</p>
                <p>Price: ${selectedItem.price.toFixed(2)}</p>
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
        ))}

<script type="module" src="../src/assets"></script>
<script noModule src="../src/assets"></script>

      </div>
      <Link to="./OrderSummary">
       <button className="order-summary-button shadow-[10px_20px_10px_-2px_rgba(0,0,0,0.15),-6px_-6px_10px_-2px_rgba(255,255,255,0.8)] rounded-xl m-[15px] m-6">See your order summary</button>
     
      </Link>
    </div>
  );
};

export default UserMenu
