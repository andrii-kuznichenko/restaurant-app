const express = require("express");
const { authenticate, authorize } = require("../middleware/authAdmin");
const restaurantRouter = express.Router();
const {
  getRestaurantInfo,
  createRestaurant,
  getAllRestaurants,
  getAllOrders,
  getRestaurantById
} = require("../controllers/restaurants");


restaurantRouter.post("/", createRestaurant);
restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/orders/:restaurantId", getAllOrders)
restaurantRouter.get("/myRestaurant", getRestaurantInfo);
restaurantRouter.get("/restaurant/:id", getRestaurantById);

module.exports = restaurantRouter;
