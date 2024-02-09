import React, { useState, useContext } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import DarkModeToggle from "./darkModeToggle";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminEditDeleteMeal({ meal }) {
  const { admin } = useContext(AuthContext);
  const [mealData, setMealData] = useState(meal);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setMealData({ ...mealData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMealData({ ...mealData, image: e.target.files[0] });
    }
  };

  const handleHide = (e) => {
    setMealData({ ...mealData, hide: e.target.checked });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const updateMeal = {
        restaurantId: admin.restaurantId,
        mealId: meal._id,
        operation: "update",
        ...mealData,
      };
      console.log("1111", updateMeal);

      socket.emit("connectToMenu", updateMeal);

      setMessage("Meal updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating meal:", error);
      setMessage(
        "Error updating meal: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  const handleDelete = () => {
    if (!meal || !meal._id) {
      console.error("Meal or meal._id is undefined");
      setMessage("Error deleting meal: Meal or meal._id is undefined");
      return;
    }

    if (window.confirm("Are you sure you want to delete this meal?")) {
      const deleteMeal = {
        restaurantId: admin.restaurantId,
        mealId: meal._id,
        operation: "delete",
      };
      console.log(deleteMeal);
      socket.emit("connectToMenu", deleteMeal);
    }
  };

  return (
    <div className={isEditing ? "" : "flex justify-between"}>
      <div>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="bg-green-200 text-black font-semibold rounded-full py-1 px-2 shadow-md transition duration-500 ease-in-out transform hover:bg-green-300 hover:-translate-y-1 hover:scale-110 dark:bg-green-700 dark:text-white"
          >
            Edit Meal
          </button>
        )}
        {isEditing && (
          <form onSubmit={handleEdit} className="mt-4 w-full">
            <label className="block">
              <span className="text-gray-700 flex justify-center">Name:</span>
              <input
                type="text"
                name="title"
                value={mealData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 flex justify-center">Description:</span>
              <input
                type="text"
                name="description"
                value={mealData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 flex justify-center">Price:</span>
              <input
                type="number"
                name="price"
                value={mealData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 flex justify-center">Allergens:</span>
              <input
                type="text"
                name="allergens"
                value={mealData.allergens}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>

            <div className="flex justify-center">
              <input
                type="submit"
                value="Submit"
                className="mt-2 bg-footerBackground/[.55]  hover:bg-footerBackground/[.95]  hover:cursor-pointer hover:text-black text-white font-bold py-1 px-3 rounded-full shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              />
            </div>
          </form>
        )}
      </div>
      {!isEditing && (
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white font-semibold rounded-full py-1 px-2 shadow-md transition duration-500 ease-in-out transform hover:bg-red-700 hover:-translate-y-1 hover:scale-110 dark:bg-red-700 dark:text-white"
        >
          Delete Meal
        </button>
      )}
    </div>
  );
}

export default AdminEditDeleteMeal;
