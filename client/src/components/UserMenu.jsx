import React, { useState, useEffect } from 'react';
/*import axios from 'axios';*/
import mockData from '../assets/data/mockData.json';
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
              className={`w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3 ${
                activeAccordion === index ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleAccordionClick(index)}
            >
              {item.name}
            </button>
            {activeAccordion === index && (
              <div className="p-5 border border-b-0 border-gray-200">
                <p className="mb-2 text-gray-500">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMenu
