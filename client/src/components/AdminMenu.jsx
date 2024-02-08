import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
import CreateQrCode from "./CreateQrCode";
import AdminTables from "./AdminTables";
import { useNavigate } from "react-router-dom";
import AdminMenuModal from "./AdminMenuModal";
import axios from "axios";
import AdminEditDeleteMeal from "./AdminUpdateMeal";
import Lottie from "react-lottie";
import animationData from "../animations/hideAnimation.json";
import AdminNewMeal from "./AdminNewMeal";
import { Accordion, AccordionPanel } from "flowbite-react";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

const groupByCategory = (items) => {
  return items.reduce((groupedItems, item) => {
    (groupedItems[item.category] = groupedItems[item.category] || []).push(
      item
    );
    return groupedItems;
  }, {});
};

function AdminMenu() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { admin, loading } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminNewMealModalOpen, setIsAdminNewMealModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mealAddedCount, setMealAddedCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("starter");

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAdminNewMealModal = () => {
    setIsAdminNewMealModalOpen(true);
  };

  const closeAdminNewMealModal = () => {
    setIsAdminNewMealModalOpen(false);
  };

  const onMealAdded = () => {
    setMealAddedCount((count) => count + 1);
  };

  const handleEdit = (item, value) => {
    setAnimatingItems((prevState) => ({ ...prevState, [item._id]: true }));
    setTimeout(() => {
      setAnimatingItems((prevState) => ({ ...prevState, [item._id]: false }));
      const hideMeal = {
        restaurantId: admin.restaurantId,
        mealId: item._id,
        hide: value,
        operation: "hide",
      };
      console.log(hideMeal);
      socket.emit("connectToMenu", hideMeal);
    }, 1000);
  };
  const [animatingItems, setAnimatingItems] = useState({});

  const OrderMealHandler = (id) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      transports: ["websocket"],
    });

    socket.emit("connectToMenu", { restaurantId: admin.restaurantId });
    socket.on(`getMenuAdmin-${admin.restaurantId}`, (receivedMenu) => {
      setMenuItems(receivedMenu);
    });
  }, [mealAddedCount]);

  const groupedItems = menuItems.menu ? groupByCategory(menuItems.menu) : {};

  return (
    <div className="mx-auto flex flex-col  ">
      <div className="flex border-b justify-center">
        <button
          className={`text-black py-2 px-4 bg-grey-200 border-l border-t border-r rounded-t ${
            tab === "active"
              ? "text-black border-footerBackground bg-footerBackground/[.25]"
              : "text-gray-300"
          }`}
          onClick={() => setTab("active")}
        >
          Active Meals
        </button>
        <button
          className={`text-black py-3 px-4 bg-grey-200 border-l border-t border-r rounded-t ${
            tab === "hidden"
              ? "text-black border-footerBackground bg-footerBackground/[.25]"
              : "text-gray-300"
          }`}
          onClick={() => setTab("hidden")}
        >
          Off the menu
        </button>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="justify-end text-white bg-footerBackground hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={openAdminNewMealModal}
        >
          Add item
        </button>
      </div>


        {tab === "active" && (
          <Accordion>
            {Object.keys(groupedItems).map((category) => (
              <AccordionPanel title={category} key={category}>
                <Accordion.Title className="font-Poppins font-bold text-xl relative flex items-center justify-center">
                  {category}
                </Accordion.Title>
                <Accordion.Content className="xxs:p-1 md:p-6 xl:p-12">
                  <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 xl:grid-cols-3 p-3">
                    {groupedItems[category]
                      .filter((item) => !item.hide)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-footerBackground/[.25] rounded-xl shadow-md overflow-hidden md:grid flex flex-col h-full w-full relative"
                        >
                          {animatingItems[item._id] && (
                            <div className="absolute inset-0 z-10 h-full w-full">
                              <Lottie
                                options={{
                                  animationData,
                                  loop: false,
                                  autoplay: true,
                                }}
                                className="h-full w-full"
                              />
                            </div>
                          )}
                          <div className="p-2 flex flex-col justify-between">
                            <div>
                              <div className="uppercase tracking-wide text-sm text-footerBackground font-semibold text-center pb-2">
                                {item.category}
                              </div>
                              <div className="md:flex-shrink-0 pb-2">
                                <img
                                  className="h-48 w-full object-cover rounded-lg hover:cursor-pointer"
                                  src={item.image}
                                  alt={item.title}
                                  onClick={() => openModal(item)}
                                />
                              </div>
                              <h1
                                className="block mt-1 text-lg leading-tight font-medium text-black text-center"
                              >
                                {item.title}
                              </h1>
                              <p className="mt-2 text-gray-600">
                                {item.description}
                              </p>
                            </div>
                            <div className="mt-4 flex justify-center">
                              <button
                                onClick={() => handleEdit(item, !item.hide)}
                                className={`cursor-pointer px-3 py-2 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                                  item.hide
                                    ? "bg-green-200 hover:bg-green-300 text-black"
                                    : "bg-red-100 hover:bg-red-300 text-black"
                                }`}
                              >
                                {item.hide
                                  ? "Meal Hidden from Menu"
                                  : "Remove from menu"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Accordion.Content>
              </AccordionPanel>
            ))}
          </Accordion>
        )}


      <AdminMenuModal
        item={selectedItem}
        isOpen={isModalOpen}
        closeModal={closeModal}
      />

      <AdminNewMeal
        isAdminNewMealModalOpen={isAdminNewMealModalOpen}
        closeAdminNewMealModal={closeAdminNewMealModal}
        onMealAdded={onMealAdded}
      />

      {tab === "hidden" && (
        <Accordion>
          {Object.keys(groupedItems).map((category) => (
            <AccordionPanel title={category} key={category}>
              <Accordion.Title className="font-Poppins font-bold text-xl relative flex items-center justify-center">
                {category}
              </Accordion.Title>
              <Accordion.Content className="xxs:p-1 md:p-6 xl:p-12">
                <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 xl:grid-cols-3 p-3">
                  {groupedItems[category]
                    .filter((item) => item.hide)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-footerBackground/[.25] rounded-xl shadow-md overflow-hidden md:grid flex flex-col h-full w-full relative"
                      >
                        <div className="p-2 flex flex-col justify-between">
                          <div>
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold text-center pb-2">
                              {item.category}
                            </div>
                            <div className="md:flex-shrink-0 pb-2">
                              <img
                                className="h-48 w-full object-cover rounded-lg cursor-pointer"
                                src={item.image}
                                alt={item.title}
                                onClick={() => openModal(item)}
                              />
                            </div>
                            <a
                              href="#"
                              className="block mt-1 text-lg leading-tight font-medium text-black hover:underline text-center"
                            >
                              {item.title}
                            </a>
                            <p className="mt-2 text-gray-600">
                              {item.description}
                            </p>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <button
                              onClick={() => handleEdit(item, !item.hide)}
                              className={`cursor-pointer px-3 py-2 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                                item.hide
                                  ? "bg-green-200 hover:bg-green-300 text-black"
                                  : "bg-red-100 hover:bg-red-300 text-black"
                              }`}
                            >
                              {item.hide ? "Put back on menu" : "Hide"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Accordion.Content>
            </AccordionPanel>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default AdminMenu;
