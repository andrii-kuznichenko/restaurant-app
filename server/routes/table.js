const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const authRouter = express.Router();
const { addTable, login, logout, getLoggedInTable, getAllTables, saveQrCode, updateTableQr } = require('../controllers/table');
authRouter.post('/addTable', addTable);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/currentTable', authenticate, getLoggedInTable);
authRouter.get('/tables/:restaurantId', getAllTables)
authRouter.post('/tables/qr-codes', saveQrCode)
authRouter.post('/tables/update-qr-code', updateTableQr)

module.exports = authRouter;