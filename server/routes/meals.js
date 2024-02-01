const express = require("express");
const { authenticate, authorize } = require("../middleware/authAdmin");
const mealRouter = express.Router();
const { addMealToMenu } = require("../controllers/meal");

const upload = require("../config/multer");
mealRouter.post("/add/:restaurantId", upload.single("image"), addMealToMenu);

module.exports = mealRouter;
