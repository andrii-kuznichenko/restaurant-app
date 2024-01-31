// with req.file.path

const Restaurant = require("../modules/restaurant");
const Meal = require("../modules/meal");

const addMealToMenu = async (req, res) => {
  try {
    console.log('MULTER FILE?', req.file.path ? "Yes" : "No file");
    console.log("File path:", req.file.path);

    const newMealData = {
        ...req.body,
        image: req.file ? req.file.path : null
      };

    const newMeal = new Meal(newMealData);
    

    const savedMeal = await newMeal.save();

    const restaurantId = req.params.restaurantId;
    await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { menu: savedMeal._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json(savedMeal);
    console.log("Meal created")
  } catch (error) {
    console.error("Error in addMealToMenu:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMealToMenu,
};
