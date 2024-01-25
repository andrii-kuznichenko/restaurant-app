import React, { useState, useEffect } from 'react';
/*import axios from 'axios';*/
import mockData from '../assets/mockData.json';
import './UserMenu.css';

const UserMenu = () => {
  const [usermenu, setUserMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };
  
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
setLoading(false);

}, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-menu-container">
      <h2>User Menu</h2>
      <div className="menu-items">
        {usermenu.map((item, index) => (
          <div key={item.id}>
            <button
              type="button"
              className={`w-full p-8 font-medium text-gray-900 border border-b-0 border-gray-400 focus:ring-7 focus:ring-gray-500 hover:bg-gray-100 gap-8 ${
                activeAccordion === index ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleAccordionClick(index)}
            >
              {item.name}
            </button>
            {activeAccordion === index && (
              <div className="p-10 border border-b-0 border-gray-400">
                <p className="mb-4 text-gray-700">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMenu
