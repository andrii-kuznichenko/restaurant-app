import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
import CreateQrCode from "./CreateQrCode";
import AdminTables from "./AdminTables";
import { useNavigate } from "react-router-dom";
import AdminMenuModal from "./AdminMenuModal";
import axios from "axios";
import AdminEditDeleteMeal from "./AdminUpdateMeal";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminMenu() {
  const { admin, loading } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (item, value) => {
    const hideMeal = {
      restaurantId: admin.restaurantId,
      mealId: item._id,
      hide: value,
      operation: "hide",
    };
    console.log(hideMeal);
    socket.emit("connectToMenu", hideMeal);
  };

  const OrderMealHandler = (id) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    socket.emit("connectToMenu", { restaurantId: admin.restaurantId });
    socket.on(`getMenuAdmin-${admin.restaurantId}`, (receivedMenu) => {
      setMenuItems(receivedMenu);
    });
  }, []);

  return (
    <div className="mx-auto m-3 mt-16">
      <div className="flex border-b">
        <button
          className={`text-black py-2 px-4 bg-grey-200 border-l border-t border-r rounded-t ${
            tab === "active"
              ? "text-black border-green-500 bg-green-200"
              : "text-gray-500"
          }`}
          onClick={() => setTab("active")}
        >
          Active Meals
        </button>
        <button
          className={`text-black py-3 px-4 bg-grey-200 border-l border-t border-r rounded-t ${
            tab === "hidden"
              ? "text-black border-green-500 bg-green-200"
              : "text-gray-500"
          }`}
          onClick={() => setTab("hidden")}
        >
          Off the menu
        </button>
      </div>
      <div className="mx-auto m-3 md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 xl:grid-cols-3">
        {tab === "active" &&
          menuItems.menu
            ?.filter((item) => !item.hide)
            ?.map((item, index) => (
              <div
                key={index}
                className="mx-auto bg-green-100 rounded-xl shadow-md overflow-hidden m-3 md:grid flex flex-col h-full w-full"
              >
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold text-center pb-2">
                    {item.category}
                  </div>
                  <div className="md:flex-shrink-0 pb-2">
                    <img
                      className="h-48 w-full object-cover rounded-lg"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>
                  <a
                    href="#"
                    className="block mt-1 text-lg leading-tight font-medium text-black hover:underline text-center"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEdit(item, !item.hide)}
                      className={`cursor-pointer px-4 py-2 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                        item.hide
                          ? "bg-green-200 hover:bg-green-300 text-black"
                          : "bg-red-200 hover:bg-red-300 text-black"
                      }`}
                    >
                      {item.hide ? "Meal Hidden from Menu" : "Remove from menu"}
                    </button>
                    <button
                      onClick={() => openModal(item)}
                      className="bg-green-200 hover:bg-green-300 text-black font-bold py-2 px-4 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      Meal Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

        <AdminMenuModal
          item={selectedItem}
          isOpen={isModalOpen}
          closeModal={closeModal}
        />

        {tab === "hidden" &&
          menuItems.menu
            .filter((item) => item.hide)
            .map((item, index) => (
              <div
                key={index}
                className="mx-auto bg-green-100 rounded-xl shadow-md overflow-hidden m-3 md:grid flex flex-col h-full w-full"
              >
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold text-center pb-2">
                    {item.category}
                  </div>
                  <div className="md:flex-shrink-0 pb-2">
                    <img
                      className="h-48 w-full object-cover rounded-lg"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>
                  <a
                    href="#"
                    className="block mt-1 text-lg leading-tight font-medium text-black hover:underline text-center"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEdit(item, !item.hide)}
                      className={`cursor-pointer px-4 py-2 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                        item.hide
                          ? "bg-green-200 hover:bg-green-300 text-black"
                          : "bg-red-200 hover:bg-red-300 text-black"
                      }`}
                    >
                      {item.hide ? "Put back on menu" : "Hide"}
                    </button>
                    <button
                      onClick={() => openModal(item)}
                      className="bg-green-200 hover:bg-green-300 text-black font-bold py-2 px-4 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      Meal Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default AdminMenu;
