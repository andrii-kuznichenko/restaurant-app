const express = require("express");
const { authenticate, authorize } = require("../middleware/authAdmin");
const restaurantRouter = express.Router();
const {
  getRestaurantInfo,
  createRestaurant,
  getAllRestaurants,
} = require("../controllers/restaurants");

restaurantRouter.use(authenticate);
restaurantRouter.use(authorize("admin"));
restaurantRouter.post("/", createRestaurant);
restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/myRestaurant", getRestaurantInfo);

module.exports = restaurantRouter;
