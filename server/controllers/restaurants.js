const Admin = require("../modules/admin");
const Restaurant = require("../modules/restaurant");
const Order = require("../modules/order");
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
}

const updateRestaurantLogo = async (req, res) => {
  try {
    console.log('MULTER FILE?', req.file ? "Yes" : "No file");
    if (req.file) {
      console.log("File path:", req.file.path);

      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "your_folder_name_here", 
      });

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        { $set: { logo: result.secure_url } }, 
        { new: true, useFindAndModify: false }
      );

      if (!updatedRestaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      console.log("Restaurant logo updated");
      res.status(200).json(updatedRestaurant);
    } else {
      throw new Error('No file uploaded');
    }
  } catch (error) {
    console.error("Error in updateRestaurantLogo:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateRestaurantInfo = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const updateData = req.body;
    console.log(`Updating restaurant ID: ${restaurantId}`, updateData);
    // Find the restaurant by ID and update it
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true });

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant updated successfully', updatedRestaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
};

module.exports = {
  getRestaurantInfo,
  createRestaurant,
  getAllRestaurants,
  getAllOrders,
  getRestaurantById,
  updateRestaurantLogo,
  updateRestaurantInfo,
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
