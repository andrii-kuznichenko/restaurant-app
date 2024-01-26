const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  title: {type: String, required: [true, 'Restaurant title is required']},
  openTime: {type: String, required: [true, 'Open hour is required']},
  closeTime: {type: String, required: [true, 'Close hour is required']},
  weekends: [{type: String,  required: [true, 'Weekends is required'], enum:['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}],
  information: {type: String, required: [true, 'Information about restaurant is required']},
  currency: {type: String, required: [true, 'Currency is required']},
  menu: [{type: mongoose.Schema.Types.ObjectId, ref: 'Meal'}]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);