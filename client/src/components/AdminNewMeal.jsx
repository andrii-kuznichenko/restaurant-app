import React, { useState, useContext } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";

function AdminNewMeal() {
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
        setMessage('Title is required');
        return;
    }

    const formData = new FormData();
    formData.append('title', mealData.title.trim());
    formData.append('description', mealData.description);
    formData.append('allergens', mealData.allergens);
    formData.append('price', mealData.price);
    if (mealData.image) {
        formData.append('image', mealData.image);
    }
    formData.append('hide', mealData.hide);
    formData.append('category', mealData.category);

    try {
        const response = await axios.post(
            `/menu/add/${admin.restaurantId}`, 
            formData
            
        );
        setMessage('Meal added successfully');
        setMealData({
            title: '',
            description: '',
            allergens: '',
            price: '',
            image: null,
            hide: false,
            category: '',
        });
    } catch (error) {
        console.error('Error adding meal:', error);
        setMessage('Error adding meal: ' + (error.response?.data?.message || error.message));
    }
    navigate("/")
};

  return (
    <div>
      <h2>Add a New Meal</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={mealData.title}
          onChange={handleChange}
          placeholder="Meal Title"
          className="border-4"
        />
        <textarea
          name="description"
          value={mealData.description}
          onChange={handleChange}
          placeholder="Meal Description"
          className="border-4"
        ></textarea>
        <input
          type="text"
          name="allergens"
          value={mealData.allergens}
          onChange={handleChange}
          placeholder="Allergens (comma separated)"
          className="border-4"
        />
        <input
          type="number"
          name="price"
          value={mealData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border-4"
        />
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="border-4"
          accept="image/*"
        />
        <input
          type="text"
          name="category"
          value={mealData.category}
          onChange={handleChange}
          placeholder="Category"
          className="border-4"
        />
        <label>
          Hide Meal:
          <input
            type="checkbox"
            name="hide"
            checked={mealData.hide}
            onChange={handleHide}
            className="border-4"
          />
        </label>
        <button type="submit" className="border-4 hover:bg-blue-500">
          Add Meal
        </button>
      </form>
      {message && <p>{message}</p>}
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
