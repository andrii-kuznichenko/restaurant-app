const express = require("express");
const { authenticate, authorize } = require("../middleware/authAdmin");
const restaurantRouter = express.Router();
const {
  getRestaurantInfo,
  createRestaurant,
  getAllRestaurants,
  getAllOrders,
  getRestaurantById,
  updateRestaurantLogo,
  updateRestaurantInfo,
} = require("../controllers/restaurants");

const upload = require("../config/multer");

restaurantRouter.post("/", createRestaurant);
restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/orders/:restaurantId", getAllOrders)
restaurantRouter.get("/myrestaurant", getRestaurantInfo);
restaurantRouter.get("/restaurant/:id", getRestaurantById);
restaurantRouter.put("/restaurant/logo/:id", upload.single("image"), updateRestaurantLogo);
restaurantRouter.put("/restaurant/info/:restaurantId", updateRestaurantInfo)


module.exports = restaurantRouter;
