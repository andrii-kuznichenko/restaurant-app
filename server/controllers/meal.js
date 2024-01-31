const Restaurant = require('../models/restaurant'); // Import the Restaurant model
const Meal = require('../models/meal'); // Import the Meal model

const addMealToMenu = async (req, res) => {
    try {
        // Create a new meal from the request body
        const newMeal = new Meal(req.body);

        // Save the meal
        const savedMeal = await newMeal.save();

        // Add the meal to the restaurant's menu
        const restaurantId = req.params.restaurantId; // Assuming the restaurant ID is passed in the URL
        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { menu: savedMeal._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json(savedMeal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addMealToMenu
  };
