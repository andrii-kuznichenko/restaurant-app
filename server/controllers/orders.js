const Order = require("../modules/order");


const getOrderByTableNumber = async (req, res) => {
  try {
    const {tableNumberId} = req.params;
    const restaurant = await Order.findOne({tableNumberId: tableNumberId, isClosed: false});
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getOrderByTableNumber,
};