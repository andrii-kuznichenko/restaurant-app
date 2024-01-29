const mongoose = require('mongoose');
const Meal = mongoose.model

const restaurantSchema = new mongoose.Schema({
  title: {type: String, required: [true, 'Restaurant title is required']},
  openTime: {type: String, required: [true, 'Open hour is required']},
  closeTime: {type: String, required: [true, 'Close hour is required']},
  weekends: [{type: String, enum:['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}],
  information: {type: String, required: [true, 'Information about restaurant is required']},
  currency: {type: String, required: [true, 'currency']},
  menu: [{type: mongoose.Schema.Types.ObjectId, ref: 'Meal'}]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);