import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/menuItems")
      .then((response) => response.json())
      .then((data) => setMenuItems(data));
  }, []);

  const handleEdit = (index, prop, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][prop] = value;
    setMenuItems(updatedItems);
    fetch(`http://localhost:4000/api/menuItems/${updatedItems[index]._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItems[index]),
    });
  };

  return (
    <div>
      <h1>Admin Menu</h1>
      {menuItems.map((item, index) => (
        <div key={index}>
          <label>Title</label>
          <input
            defaultValue={item.title}
            onChange={(e) => handleEdit(index, "title", e.target.value)}
          />

          <label>Description</label>
          <input
            defaultValue={item.description}
            onChange={(e) => handleEdit(index, "description", e.target.value)}
          />

          <label>Allergens</label>
          <input
            defaultValue={item.allergens.join(", ")}
            onChange={(e) =>
              handleEdit(index, "allergens", e.target.value.split(", "))
            }
          />

          <label>Price</label>
          <input
            defaultValue={item.price}
            onChange={(e) => handleEdit(index, "price", e.target.value)}
          />

          <label>Image</label>
          <input
            defaultValue={item.image}
            onChange={(e) => handleEdit(index, "image", e.target.value)}
          />

          <label>Hide</label>
          <input
            type="checkbox"
            defaultChecked={item.hide}
            onChange={(e) => handleEdit(index, "hide", e.target.checked)}
          />

          <label>Category</label>
          <input
            defaultValue={item.category}
            onChange={(e) => handleEdit(index, "category", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default AdminMenu;
