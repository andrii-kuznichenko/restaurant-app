const mongoose = require("mongoose");
// const cloudinary = require('../config/cloudinary');
// const fs = require('fs');

const restaurantSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Restaurant title is required"] },
  openTime: {
    type: {
      Monday: { type: String, default: "00:00", required: false },
      Tuesday: { type: String, default: "00:00", required: false },
      Wednesday: { type: String, default: "00:00", required: false },
      Thursday: { type: String, default: "00:00", required: false },
      Friday: { type: String, default: "00:00", required: false },
      Saturday: { type: String, default: "00:00", required: false },
      Sunday: { type: String, default: "00:00", required: false },
    },
    required: false,
    _id: false,
  },
  closeTime: {
    type: {
      Monday: { type: String, default: "00:00", required: false },
      Tuesday: { type: String, default: "00:00", required: false },
      Wednesday: { type: String, default: "00:00", required: false },
      Thursday: { type: String, default: "00:00", required: false },
      Friday: { type: String, default: "00:00", required: false },
      Saturday: { type: String, default: "00:00", required: false },
      Sunday: { type: String, default: "00:00", required: false },
    },
    required: [false, "Close hour is required"],
    _id: false,
  },
  weekends: [
    {
      type: String,
      required: [false, "Weekends is required"],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  ],
  information: {
    type: String,
    required: [true, "Information about restaurant is required"],
  },
  currency: { type: String, required: [true, "Currency is required"] },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
  logo: {
    type: String,
    required: false,
    default:
      "https://res.cloudinary.com/ddoeaay7c/image/upload/v1707763851/Default-Logo_ylhopo.png",
  }, // Add your default logo URL here
  socials: {
    facebook: { type: String, required: false },
    instagram: { type: String, required: false },
    tiktok: { type: String, required: false },
  },
});

// restaurantSchema.pre('save', async function (next) {
//   if (this.isModified('logo') && this.logo !== 'default_logo_url') {
//     try {
//       const options = {
//         public_id: `restaurant_logo_${this._id}`,
//         folder: process.env.CLOUDINARY_FOLDER_NAME,
//       };
//       const imagePath = this.logo;
//       const res = await cloudinary.uploader.upload(imagePath, options);
//       this.logo = res.secure_url;
//       // If local file, consider deleting after upload
//       // fs.unlinkSync(imagePath);
//       next();
//     } catch (e) {
//       console.error("Error uploading to Cloudinary:", e)
//       next(e);
//     }
//   } else {
//     next();
//   }
// });

module.exports = mongoose.model("Restaurant", restaurantSchema);
