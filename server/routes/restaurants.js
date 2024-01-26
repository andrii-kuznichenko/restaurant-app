const express = require('express');
const { authenticate, authorize } = require('../middleware/authAdmin');
const restaurantRouter = express.Router();
const { getRestaurantInfo } = require('../controllers/restaurants');


restaurantRouter.get('/myRestaurant', authenticate, getRestaurantInfo);

module.exports = restaurantRouter;