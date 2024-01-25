const express = require('express');
const { authenticate } = require('../middleware/auth');
const adminRouter = express.Router();
const { register, login, logout, getLoggedInAdmin } = require('../controllers/admins');
adminRouter.post('/register', register);
adminRouter.post('/login', login);
adminRouter.post('/logout', logout);
adminRouter.get('/currentAdmin', authenticate, getLoggedInAdmin);

module.exports = adminRouter;