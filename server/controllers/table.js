const Table = require('../modules/table');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const dayInMilliseconds = 24 * 60 * 60 * 1000;
const addTable = async (req, res) => {
  try {
    const newTable = await Table.create(req.body);
    const tablePayload = {
      _id: newTable._id,
      QRCode: newTable.QRCode,
      tableNumber: newTable.tableNumber,
      restaurantId: newTable.restaurantId,
    };
    const tableToken = jwt.sign(tablePayload, SECRET);
    res
      .status(201)
      .cookie('accessToken', tableToken, {
        httpOnly: true,
        expires: new Date(Date.now() + dayInMilliseconds),
      })
      .json({ message: 'table created!', table: tablePayload });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { _id, tableNumber, restaurantId } = req.body;
    if (!_id || !tableNumber || !restaurantId) {
      res.status(400).json({ message: 'Invalid Login Attempt' });
    } else {
      const tableDoc = await Table.findOne({ _id });
      console.log('TABLE RECORD', tableDoc._id, tableDoc.tableNumber, restaurantId);
      if (!tableDoc) {
        res.status(400).json({ message: 'Invalid Login Attempt' });
      } else {
        const tablePayload = {
          _id: tableDoc._id,
          QRCode: tableDoc.QRCode,
          tableNumber: tableDoc.tableNumber,
          restaurantId: tableDoc.restaurantId,
        };
          const tableToken = jwt.sign(tablePayload, SECRET);
          res
            .cookie('accessToken', tableToken, {
              httpOnly: true,
              expires: new Date(Date.now() + dayInMilliseconds),
            })
            .json({ message: 'table loggedin!', table: tablePayload });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.json({ message: 'You have Successfully logged out!' });
};
const getLoggedInTable = async (req, res) => {
  try {
    // req.user is created in the auth middleware
    const table = await Table.findOne({ _id: req.table._id });
    res.json({ table });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addTable,
  login,
  logout,
  getLoggedInTable,
};