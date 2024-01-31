const Admin = require("../modules/admin");
const Restaurant = require("../modules/restaurant");
const Order = require("../modules/order");

const getRestaurantInfo = async (req, res) => {
  try {
    const adminId = req.admin._id;
    // const restaurantId = req.params.restaurantId;
    const admin = await Admin.findOne({ _id: req.admin._id }).populate(
      "restaurantId"
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin.restaurantId);

    // const admin = await Admin.findById(adminId);

    // if (!admin) {
    //     return res.status(404).json({message: "Admin not found"})
    // }

    // if (!admin.restaurantId.equals(restaurantId)) {
    //     return res.status(403).json({message: "Unauthorized"})
    // }

    // const restaurant = await Restaurant.findById(restaurantId);
    // if (!restaurant) {
    //     return res.status(404).json({message: "Restaurant not found"})
    // }

    // res.json(restaurant)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create({ ...req.body });
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate(
      "menu",
      "title descriptions allergens price"
    );
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const orders = await Order.find({ restaurantId }).populate('meals.name').populate('tableNumberId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
}

module.exports = {
  getRestaurantInfo,
  createRestaurant,
  getAllRestaurants,
  getAllOrders,
};

//const getAllInfoFromRestaurant = async (req, res) => {
// try {
//     const adminId = req.admin._id;
//     const admin = await Admin.findById(adminId).populate('restaurantId');
//     if (!admin) {
//       return res.status(404).json({message: 'Admin not found'})
//     }
//     res.json(admin.restaurantId)
//   } catch (error) {
//     res.status(500).json({message: error.message});
//   }
// }
