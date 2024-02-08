import React, { useState, useContext } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";

function AdminNewMeal({
  isAdminNewMealModalOpen,
  closeAdminNewMealModal,
  onMealAdded,
}) {
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const [mealData, setMealData] = useState({
    title: "",
    description: "",
    allergens: "",
    price: "",
    image: null,
    hide: false,
    category: "",
  });
  const [message, setMessage] = useState("");

  console.log(admin.restaurantId);

  const handleChange = (e) => {
    setMealData({ ...mealData, [e.target.name]: e.target.value });
    console.log(mealData.title);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMealData({ ...mealData, image: e.target.files[0] });
    }
  };

  const handleHide = (e) => {
    setMealData({ ...mealData, hide: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mealData.title.trim()) {
      setMessage("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", mealData.title.trim());
    formData.append("description", mealData.description);
    formData.append("allergens", mealData.allergens);
    formData.append("price", mealData.price);
    if (mealData.image) {
      formData.append("image", mealData.image);
    }
    formData.append("hide", mealData.hide);
    formData.append("category", mealData.category);

    try {
      const response = await axios.post(
        `/menu/add/${admin.restaurantId}`,
        formData
      );
      setMessage("Meal added successfully");
      setMealData({
        title: "",
        description: "",
        allergens: "",
        price: "",
        image: null,
        hide: false,
        category: "",
      });
    } catch (error) {
      console.error("Error adding meal:", error);
      setMessage(
        "Error adding meal: " + (error.response?.data?.message || error.message)
      );
    }
    // navigate("/")
    onMealAdded();
  };

  if (!isAdminNewMealModalOpen) return null;

  return (
  
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="modal-content bg-white p-4 rounded-lg flex flex-col justify-center">
        <div>
          <h2 className="text-center">Add a New Meal</h2>
          <form onSubmit={handleSubmit} className="max-w-l mx-auto flex flex-row gap-4 p-10">
            <div className="w-1/2">
            <div className="mb-5">
              <label
                for="title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Meal Title
              </label>
              <input
                type="text"
                name="title"
                value={mealData.title}
                onChange={handleChange}
                placeholder="Meal Title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="mb-5">
              <label
                for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                name="description"
                value={mealData.description}
                onChange={handleChange}
                placeholder="Meal Description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
            <div className="mb-5">
              <label
                for="allergens"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Allergens
              </label>
              <input
                type="text"
                name="allergens"
                value={mealData.allergens}
                onChange={handleChange}
                placeholder="Allergens (comma separated)"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="mb-5">
              <label
                for="price"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Price
              </label>

              <input
                type="number"
                name="price"
                value={mealData.price}
                onChange={handleChange}
                placeholder="Price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            </div>
            <div className="w-1/2">
            <div className="mb-5">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="user_avatar"
              >
                Upload file
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                accept="image/*"
                aria-describedby="user_avatar_help"
              />
            </div>
            <div className="mb-5">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                value={mealData.category}
                onChange={handleChange}
                placeholder="Category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="hide"
                  checked={mealData.hide}
                  onChange={handleHide}
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                
                />
              </div>
              <label
                for="remember"
                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Hide from menu
              </label>
            </div>
{/* 
            <label>
              Hide Meal:
              <input
                type="checkbox"
                name="hide"
                checked={mealData.hide}
                onChange={handleHide}
                className="border-4"
              />
            </label> */}
            <button type="submit" className="text-white bg-footerBackground hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Add Meal
            </button>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
        <button onClick={closeAdminNewMealModal} className="m-4">
          Close
        </button>
      </div>
    </div>
  );
}

export default AdminNewMeal;

// FORM ANDRII //

{
  /* <div className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="small" value="Small input" />
        </div>
        <TextInput id="small" type="text" sizing="sm" />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="base" value="Base input" />
        </div>
        <TextInput id="base" type="text" sizing="md" />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="large" value="Large input" />
        </div>
        <TextInput id="large" type="text" sizing="lg" />
      </div>
    </div> */
}

// FORM ANDRII //
