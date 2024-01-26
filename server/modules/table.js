const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  QRCode: {type: String, required: [true, 'QRCode is required'], unique: true},
  tableNumber: {type: Number, required: [true, 'Table number is required'], unique: false},
  restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:[true, 'Restaurant reference is required'], unique: false},
}, 
{timestamps: true},
);
tableSchema.index({ tableNumber: 1, restaurantId: 1 }, { unique: [true, 'Table with this number already exist in this restaurant'] })
tableSchema.path('QRCode').validate(async value => {
  const QRCodeCount = await mongoose.models.Table.countDocuments({ QRCode: value });
  return !QRCodeCount;
}, 'QRCode already exists');

module.exports = mongoose.model('Table', tableSchema);