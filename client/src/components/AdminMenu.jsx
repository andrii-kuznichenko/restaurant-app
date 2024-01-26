import React, { useState, useEffect } from "react";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    // Placeholder: replace with actual code
    fetch("/api/menuItems")
      .then((response) => response.json())
      .then((data) => setMenuItems(data));
  }, []);

  const handleAdd = () => {
    // Placeholder: replace with actual code
    fetch("/api/menuItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem, visible: true }),
    })
      .then((response) => response.json())
      .then((data) => setMenuItems((oldMenuItems) => [...oldMenuItems, data]));

    setNewItem("");
  };

  const handleEdit = (index, name) => {
    // Placeholder: replace with actual code
    fetch(`/api/menuItems/${menuItems[index]._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index] = updatedItem;
        setMenuItems(newMenuItems);
      });
  };

  const handleRemove = (index) => {
    // Placeholder: replace with actual code
    fetch(`/api/menuItems/${menuItems[index]._id}`, {
      method: "DELETE",
    }).then(() => {
      const newMenuItems = [...menuItems];
      newMenuItems.splice(index, 1);
      setMenuItems(newMenuItems);
    });
  };

  const handleToggleVisibility = (index) => {
    // Placeholder: replace with actual code
    fetch(`/api/menuItems/${menuItems[index]._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !menuItems[index].visible }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index] = updatedItem;
        setMenuItems(newMenuItems);
      });
  };

  return (
    <div>
      <h1>Admin Menu</h1>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <button onClick={handleAdd}>Add item</button>
      {menuItems.map((item, index) => (
        <div key={index}>
          <input
            defaultValue={item.name}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button onClick={() => handleEdit(index, newItem)}>Edit</button>
          <button onClick={() => handleToggleVisibility(index)}>
            {item.visible ? "Hide" : "Show"}
          </button>
          <button onClick={() => handleRemove(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default AdminMenu;
