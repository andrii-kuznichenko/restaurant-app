const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  status: 
  {
  type: String, 
  required: [true, 'Status of order is required'],
  enum: ['in process', 'need to aceept', 'waiting for payment', 'finished', 'order could not be processed' ],
  },
  orderTIme: {type: Number},
  tableNumberId: {type: mongoose.Schema.Types.ObjectId, ref: 'Table', required:[true, 'Table reference is required']},
  meals:[{
    name:{type: mongoose.Schema.Types.ObjectId, ref:'Meal', required:[true, 'Meal in order is required']},
    quantity: {type: Number, required:[true, 'Quantity of meal in order is required']}
  }],
  totalPrice: {type: Number, required:[true, 'Total Price in order is required']},
  restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:[true, 'Restaurant reference in order is required']},
}, 
{timestamps: true},
);

module.exports = mongoose.model('Order', orderSchema);