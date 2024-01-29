const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  title: {type: String, required: [true, 'Meal title is required']},
  description: {type: String, required: [true, 'Description about the meal is required']},
  allergens: [String],
  price: {type: Number, required: [true, 'Price is required Nothing free in this restaurant']},
  image: {type: String, required: [true, 'Image of meal is required']},
  hide: {type: Boolean, default: false},
  category: {type: String, required: 'Category of meal is required'},
}, 
{timestamps: true},
);

mealSchema.pre('save', async function (next) {
  try {
    const options = {
      public_id: this._id,
      folder: process.env.CLOUDINARY_FOLDER_NAME,
    };
    const imagePath = this.image;
    const res = await cloudinary.uploader.upload(imagePath, options);
    this.image = res.secure_url;
    fs.unlinkSync(imagePath);
    next();
  } catch (e) {
    next(e.message);
  }
});

module.exports = mongoose.model('Meal', mealSchema);

