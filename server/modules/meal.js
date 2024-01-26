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

module.exports = mongoose.model('Meal', mealSchema);