const Order = require("../modules/order");

const getOrderByTableNumber = async (req, res) => {
  try {
    const { tableNumberId } = req.params;
    const restaurant = await Order.findOne({
      tableNumberId: tableNumberId,
      isClosed: false,
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderByDate = async (req, res) => {
  try {
    const { dateStart, dateFinish } = req.params;
    const startDate = new Date(dateStart);
    startDate.setUTCHours(0, 0, 0, 0);

    // Start of the next day
    const endDate = new Date(dateFinish);
    endDate.setUTCHours(23, 59, 59, 999);
    const order = await Order.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("meals.name").populate({path: "tableNumberId", select: "tableNumber"}).sort({createdAt: -1});
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrderByTableNumber,
  getOrderByDate,
};
