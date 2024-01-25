const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  QRCode: {type: String, required: [true, 'QRCode is required']},
  tableNumber: {type: Number, required: [true, 'Table number is required']},
  restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:[true, 'Restaurant reference is required']},
}, 
{timestamps: true},
);

module.exports = mongoose.model('Table', tableSchema);