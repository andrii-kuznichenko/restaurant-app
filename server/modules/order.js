const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  status: 
  {
  type: String, 
  enum: ['in process', 'need to accept', 'waiting for payment', 'finished', 'order could not be processed'],
  default: 'need to accept'
  },
  orderTime: {type: Number},
  tableNumberId: {type: mongoose.Schema.Types.ObjectId, ref: 'Table', required:[true, 'Table reference is required']},
  meals:[{
    name:{type: mongoose.Schema.Types.ObjectId, ref:'Meal', required:[true, 'Meal in order is required']},
    quantity: {type: Number, required:[true, 'Quantity of meal in order is required']}
  }],
  totalPrice: {type: Number, required:[true, 'Total Price in order is required']},
  restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:[true, 'Restaurant reference in order is required']},
  isClosed: {type: Boolean, default: false},
}, 
{timestamps: true},
);

module.exports = mongoose.model('Order', orderSchema);