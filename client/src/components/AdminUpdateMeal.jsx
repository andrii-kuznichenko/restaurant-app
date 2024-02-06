import React, { useState, useContext } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
});

function AdminEditDeleteMeal({ meal }) {
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const [mealData, setMealData] = useState(meal);
  const [message, setMessage] = useState("");

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
      const formData = new FormData();
      Object.keys(mealData).forEach((key) => {
        formData.append(key, mealData[key]);
      });

      const response = await axios.put(
        `/menu/update/${admin.restaurantId}/${meal._id}`,
        formData
      );
      setMessage("Meal updated successfully");
      navigate("/");
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

  // try {
  //   await axios.delete(`/menu/delete/${admin.restaurantId}/${meal._id}`);
  //   setMessage("Meal deleted successfully");
  //   navigate("/");
  // } catch (error) {
  //   console.error("Error deleting meal:", error);
  //   setMessage(
  //     "Error deleting meal: " +
  //       (error.response?.data?.message || error.message)
  //   );
  // }
  // };

  return (
    <div>
      <div className="flex justify-center items-center space-x-4 py-2">
        <button
          onClick={handleEdit}
          className="bg-blue-200 hover:bg-blue-300 font-bold text-black rounded-full py-1 px-3 shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Edit Meal
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-400 hover:bg-red-500 font-bold text-black rounded-full py-1 px-3 shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Delete Meal
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminEditDeleteMeal;
