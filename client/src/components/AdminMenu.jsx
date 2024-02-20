import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";
import CreateQrCode from "./CreateQrCode";
import AdminTables from "./AdminTables";
import { useNavigate } from "react-router-dom";
import AdminMenuModal from "./AdminMenuModal";
import AdminEditDeleteMeal from "./AdminUpdateMeal";
import Lottie from "react-lottie";
import animationData from "../animations/hideAnimation.json";
import AdminNewMeal from "./AdminNewMeal";
import { Accordion, AccordionPanel } from "flowbite-react";
import { useNotification } from "../context/Notification";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import DarkModeToggle from "./darkModeToggle";

const groupByCategory = (items) => {
  return items.reduce((groupedItems, item) => {
    (groupedItems[item.category] = groupedItems[item.category] || []).push(
      item
    );
    return groupedItems;
  }, {});
};

function AdminMenu() {
  const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
    transports: ["websocket"],
  });

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
  const { notify } = useNotification();

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
              ? "text-black dark:text-gray-300  border-footerBackground bg-footerBackground/[.25]"
              : "text-gray-300 dark:text-gray-600"
          }`}
          onClick={() => setTab("active")}
        >
          Active Meals
        </button>
        <button
          className={`text-black py-3 px-4 bg-grey-200 border-l border-t border-r rounded-t ${
            tab === "hidden"
              ? "text-black dark:text-gray-300  border-footerBackground bg-footerBackground/[.25]"
              : "text-gray-300 dark:text-gray-600"
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
                <div className=" md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 xl:grid-cols-3 p-3">
                  {groupedItems[category]
                    .filter((item) => !item.hide)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-footerBackground/[.25] dark:bg-gray-800 rounded-md shadow-md overflow-hidden md:grid flex flex-col h-full w-full relative mb-2"
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
                        <div className=" flex flex-col justify-between pb-2">
                          <div>
                            <div className="md:flex-shrink-0 pb-2">
                              <img
                                className="h-48 w-full object-cover  hover:cursor-pointer"
                                src={item.image}
                                alt={item.title}
                                onClick={() => openModal(item)}
                              />
                            </div>
                            <h1 className="block mt-1 text-lg leading-tight font-medium text-black text-center dark:text-gray-300">
                              {item.title}
                            </h1>
                            <p className=" p-2 mt-2 text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <button
                              onClick={() => handleEdit(item, !item.hide)}
                              className={`relative cursor-pointer px-4 py-2 rounded-sm shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                                item.hide
                                  ? "bg-green-500 hover:bg-green-600 text-white dark:bg-green-700 dark:hover:bg-green-800"
                                  : "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
                              } hover:rotate-3`}
                              style={{ perspective: "1000px" }}
                            >
                              {item.hide
                                ? "Meal Hidden from Menu"
                                : "Remove"}
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
          {Object.keys(groupedItems)
            .map((category) => {
              const hiddenItems = groupedItems[category].filter(
                (item) => item.hide
              );
              return hiddenItems.length > 0 ? (
                <AccordionPanel title={category} key={category}>
                  <Accordion.Title className="font-Poppins font-bold text-xl relative flex items-center justify-center">
                    {category}
                  </Accordion.Title>
                  <Accordion.Content className="xxs:p-1 md:p-6 xl:p-12">
                    <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 xl:grid-cols-3 p-3">
                      {hiddenItems.map((item, index) => (
                        <div
                          key={index}
                          className="bg-footerBackground/[.25] dark:bg-gray-800 rounded-md shadow-md overflow-hidden md:grid flex flex-col h-full w-full relative"
                        >
                          <div className=" flex flex-col justify-between">
                            <div>
                              <div className="md:flex-shrink-0 pb-2">
                                <img
                                  className="h-48 w-full object-cover cursor-pointer"
                                  src={item.image}
                                  alt={item.title}
                                  onClick={() => openModal(item)}
                                />
                              </div>
                              <a
                                href="#"
                                className="block mt-1 text-lg leading-tight font-medium text-black dark:text-gray-200 hover:underline text-center"
                              >
                                {item.title}
                              </a>
                              <p className="p-2 mt-2 text-gray-600 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            <div className="mt-4 flex justify-center">
                              <button
                                onClick={() => handleEdit(item, !item.hide)}
                                className={`relative cursor-pointer px-4 py-2 rounded-sm shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                                  item.hide
                                    ? "bg-green-600 hover:bg-green-700 text-white dark:bg-green-800 dark:hover:bg-green-900"
                                    : "bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-800"
                                } hover:rotate-3`}
                                style={{ perspective: "1000px" }}
                              >
                                {item.hide
                                  ? "Return"
                                  : "Remove from menu"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Content>
                </AccordionPanel>
              ) : null;
            })
            .filter(Boolean)}
        </Accordion>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
}

export default AdminMenu;
