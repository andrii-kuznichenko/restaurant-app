import React, { useState, useContext } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";

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
  
      const response = await axios.put(`/menu/update/${admin.restaurantId}/${meal._id}`, formData);
      setMessage('Meal updated successfully');
      navigate("/");
    } catch (error) {
      console.error('Error updating meal:', error);
      setMessage('Error updating meal: ' + (error.response?.data?.message || error.message));
    }
  };
  const handleDelete = async () => {
    if (!meal || !meal._id) {
      console.error("Meal or meal._id is undefined");
      setMessage("Error deleting meal: Meal or meal._id is undefined");
      return;
    }

    try {
      await axios.delete(`/menu/delete/${admin.restaurantId}/${meal._id}`);
      setMessage("Meal deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting meal:", error);
      setMessage(
        "Error deleting meal: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handleEdit}
          className="bg-orange-300 font-bold text-black hover:bg-black hover:text-white rounded-lg p-0.5"
        >
          Edit Meal
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 font-bold text-black hover:bg-black hover:text-red-600 hover:text-white rounded-lg p-0.5"
        >
          Delete Meal
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminEditDeleteMeal;
