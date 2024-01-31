const express = require("express");
const { authenticate, authorize } = require("../middleware/authAdmin");
const mealRouter = express.Router();
const {
    addMealToMenu
  
} = require("../controllers/meal");


mealRouter.post("/",  addMealToMenu);

module.exports = restaurantRouter;