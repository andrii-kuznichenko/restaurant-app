import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
import CreateQrCode from "./CreateQrCode";
import AdminTables from "./AdminTables";

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

      {tab === "active" &&
        menuItems.menu
          .filter((item) => !item.hide)
          .map((item, index) => (
            <div
              key={index}
              className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    {item.category}
                  </div>
                  <a
                    href="#"
                    className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 text-gray-500">{item.description}</p>
                  <div className="mt-4">
                    <label className="font-bold text-xl mb-2">Hide</label>
                    <input
                      type="checkbox"
                      className="mr-2 leading-tight"
                      defaultChecked={item.hide}
                      onChange={(e) =>
                        handleEdit(index, "hide", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

      {tab === "hidden" &&
        menuItems.menu
          .filter((item) => item.hide)
          .map((item, index) => (
            <div
              key={index}
              className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    {item.category}
                  </div>
                  <a
                    href="#"
                    className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 text-gray-500">{item.description}</p>
                  <div className="mt-4">
                    <label className="font-bold text-xl mb-2">Hide</label>
                    <input
                      type="checkbox"
                      className="mr-2 leading-tight"
                      defaultChecked={item.hide}
                      onChange={(e) =>
                        handleEdit(index, "hide", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}

export default AdminMenu;
