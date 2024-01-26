const express = require('express');
const { authenticate } = require('../middleware/auth');
const authRouter = express.Router();
const { addTable, login, logout, getLoggedInTable } = require('../controllers/table');
authRouter.post('/addTable', addTable);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/currentTable', authenticate, getLoggedInTable);

module.exports = authRouter;