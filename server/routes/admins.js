const express = require('express');
const { authenticate } = require('../middleware/auth');
const adminRouter = express.Router();
const { register, login, logout, getLoggedInAdmin, getAllInfoFromRestaurant } = require('../controllers/admins');
adminRouter.post('/register', register);
adminRouter.post('/login', login);
adminRouter.post('/logout', logout);
adminRouter.get('/currentAdmin', authenticate, getLoggedInAdmin);
adminRouter.get('/myRestaurant', authenticate, getAllInfoFromRestaurant);

module.exports = adminRouter;