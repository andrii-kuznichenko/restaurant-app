import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminMenu() {
  const { admin, loading } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    socket.emit("connectToMenu", { restaurantId: admin.restaurantId });
    socket.on(`getMenuAdmin-${admin.restaurantId}`, (receivedMenu) => {
      console.log(receivedMenu);
      setMenuItems(receivedMenu);
    });
  }, []);

  const [tab, setTab] = useState("active");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Menu</h1>
      <div>
        <button className="mr-4" onClick={() => setTab("active")}>
          Active Meals
        </button>
        <button onClick={() => setTab("hidden")}>Hidden Meals</button>
      </div>
      {tab === "active"
        ? menuItems?.length !== 0 &&
          menuItems.menu
            .filter((item) => !item.hide)
            .map((item, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-300 rounded"
              >
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.title}
                  onChange={(e) => handleEdit(index, "title", e.target.value)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Price
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.price}
                  onChange={(e) => handleEdit(index, "price", e.target.value)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Image
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.image}
                  onChange={(e) => handleEdit(index, "image", e.target.value)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Hide
                </label>
                <input
                  type="checkbox"
                  className="mr-2 leading-tight"
                  defaultChecked={item.hide}
                  onChange={(e) => handleEdit(index, "hide", e.target.checked)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Category
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.category}
                  onChange={(e) =>
                    handleEdit(index, "category", e.target.value)
                  }
                />
              </div>
            ))
        : menuItems?.length !== 0 &&
          menuItems.menu
            .filter((item) => item.hide)
            .map((item, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-300 rounded"
              >
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.title}
                  onChange={(e) => handleEdit(index, "title", e.target.value)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Price
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.price}
                  onChange={(e) => handleEdit(index, "price", e.target.value)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Image
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.image}
                  onChange={(e) => handleEdit(index, "image", e.target.value)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Hide
                </label>
                <input
                  type="checkbox"
                  className="mr-2 leading-tight"
                  defaultChecked={item.hide}
                  onChange={(e) => handleEdit(index, "hide", e.target.checked)}
                />

                <label className="block text-sm font-bold mb-2 mt-4">
                  Category
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={item.category}
                  onChange={(e) =>
                    handleEdit(index, "category", e.target.value)
                  }
                />
              </div>
            ))}
    </div>
  );
}

export default AdminMenu;
