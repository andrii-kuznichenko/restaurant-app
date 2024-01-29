import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetch('/api/menuItems')
      .then(response => response.json())
      .then(data => setMenuItems(data));
  }, []);

  const handleAdd = () => {
    const newItemData = { name: newItem, visible: true };
    socket.emit('addMenuItem', newItemData);
    setNewItem('');
  };

  const handleEdit = (index, name) => {
    const updatedItem = { ...menuItems[index], name };
    socket.emit('editMenuItem', updatedItem); 
  };

  const handleRemove = index => {
    socket.emit('removeMenuItem', menuItems[index]); 
  };

  const handleToggleVisibility = index => {
    const updatedItem = { ...menuItems[index], visible: !menuItems[index].visible };
    socket.emit('toggleMenuItemVisibility', updatedItem);
  };

  return (
    <div>
      <h1>Admin Menu</h1>
      <input value={newItem} onChange={e => setNewItem(e.target.value)} />
      <button onClick={handleAdd}>Add item</button>
      {menuItems.map((item, index) => (
        <div key={index}>
          <input defaultValue={item.name} onChange={e => handleEdit(index, e.target.value)} />
          <button onClick={() => handleEdit(index, newItem)}>
            Edit
          </button>
          <button onClick={() => handleToggleVisibility(index)}>
            {item.visible ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => handleRemove(index)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminMenu;