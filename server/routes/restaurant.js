const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const restaurantRouter = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
} = require('../controllers/restaurant');

restaurantRouter.use(authenticate);
restaurantRouter.use(authorize('admin'));
restaurantRouter.post('/', createRestaurant);
restaurantRouter.get('/', getAllRestaurants);
module.exports = restaurantRouter;