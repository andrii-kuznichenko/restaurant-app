const Admin = require("../modules/admin");
const Restaurant = require("../modules/restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const dayInMilliseconds = 24 * 60 * 60 * 1000;



// REGISTER WITH NEW RESTAURANT DOCUMENT 
const register = async (req, res) => {
  try {
    const defaultRestaurant = {
      title: "Name of your restaurant",
      openTime: {
        Monday: "00:00",
        Tuesday: "00:00",
        Wednesday: "00:00",
        Thursday: "00:00",
        Friday: "00:00",
        Saturday: "00:00",
        Sunday: "00:00",
      },
      closeTime: {
        Monday: "00:00",
        Tuesday: "00:00",
        Wednesday: "00:00",
        Thursday: "00:00",
        Friday: "00:00",
        Saturday: "00:00",
        Sunday: "00:00",
      },
      weekends: [],
      information: "Details about your restaurant",
      currency: "EUR",
    };

    const newRestaurant = new Restaurant(defaultRestaurant);
    const savedRestaurant = await newRestaurant.save();

    const adminData = { ...req.body, restaurantId: savedRestaurant._id };

    const newAdmin = await Admin.create(adminData); // before: const newAdmin = await Admin.create(adminData);
    const adminPayload = {
      _id: newAdmin._id,
      email: newAdmin.email,
      username: newAdmin.username,
      role: newAdmin.role,
      restaurantId: newAdmin.restaurantId
    };
    const adminToken = jwt.sign(adminPayload, SECRET);
    res
      .status(201)
      .cookie("accessToken", adminToken, {
        httpOnly: true,
        expires: new Date(Date.now() + dayInMilliseconds),
      })
      .json({ message: "admin user created!", admin: adminPayload });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Invalid Login Attempt" });
    } else {
      const adminDoc = await Admin.findOne({ email });
      console.log("ADMIN RECORD", adminDoc.email, adminDoc.password, password);
      if (!adminDoc) {
        res.status(400).json({ message: "Invalid Login Attempt" });
      } else {
        // user doc with email is found!
        const isPasswordValid = await bcrypt.compare(
          password,
          adminDoc.password
        );
        if (!isPasswordValid) {
          res.status(400).json({ message: "Invalid Login Attempt" });
        } else {
          const adminPayload = {
            _id: adminDoc._id,
            email: adminDoc.email,
            login: adminDoc.login,
            role: adminDoc.role,
            restaurantId: adminDoc.restaurantId
          };
          const adminToken = jwt.sign(adminPayload, SECRET);
          res
            .cookie("accessToken", adminToken, {
              httpOnly: true,
              expires: new Date(Date.now() + dayInMilliseconds),
            })
            .json({ message: "admin logged in!", admin: adminPayload });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "You have Successfully logged out!" });
};
const getLoggedInAdmin = async (req, res) => {
  try {
    // req.admin is created in the auth middleware
    const admin = await Admin.findOne({ _id: req.admin._id }).select(
      "-password"
    );
    res.json({ admin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getLoggedInAdmin,
};
