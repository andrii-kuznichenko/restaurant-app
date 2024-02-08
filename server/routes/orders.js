const express = require("express");
const orderRouter = express.Router();
const {
  getOrderByTableNumber,
  getOrderByDate
} = require("../controllers/orders");

orderRouter.get("/:tableNumberId", getOrderByTableNumber);
orderRouter.get("/date/:dateStart/:dateFinish", getOrderByDate)

module.exports = orderRouter;