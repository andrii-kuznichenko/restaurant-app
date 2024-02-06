const express = require("express");
const { authenticate} = require("../middleware/auth");
const orderRouter = express.Router();
const {
  getOrderByTableNumber
} = require("../controllers/orders");

orderRouter.use(authenticate);
orderRouter.get("/:tableNumberId", getOrderByTableNumber);

module.exports = orderRouter;