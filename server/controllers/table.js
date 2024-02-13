const Table = require('../modules/table');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const dayInMilliseconds = 24 * 60 * 60 * 1000;
const cloudinary = require('../config/cloudinary');

const addTable =  async (req, res) => {
  try {
    console.log(req.body);
    const newTable = await Table.create(req.body);
    const tablePayload = {
      _id: newTable._id,
      QRCode: newTable.QRCode,
      tableNumber: newTable.tableNumber,
      restaurantId: newTable.restaurantId,
      role: newTable.role,
    };
    const tableToken = jwt.sign(tablePayload, SECRET);
    res
      .status(201)
      // .cookie('accessToken', tableToken, {
      //   httpOnly: true,
      //   // // expires: new Date(Date.now() + dayInMilliseconds),
      // })
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
          role: tableDoc.role,
        };
          const tableToken = jwt.sign(tablePayload, SECRET);
          res
            .cookie('accessToken', tableToken, {
              httpOnly: true,
              expires: new Date(Date.now() + dayInMilliseconds),
              sameSite: 'strict',
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

const getAllTables = async (req, res) => {
  try {
      const { restaurantId } = req.params;
      const tables = await Table.find({ restaurantId: restaurantId });
      res.json(tables);
  } catch (error) {
      res.status(500).send('Server error');
  }
};

const saveQrCode = async (req, res) => {

  try {
    const result = await cloudinary.uploader.upload(req.body.imageData, {folder: "qr-codes",});
    res.json({url: result.secure_url})
    console.log(result.secure_url)
    
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).send("Error uploading image.")
  }
}

const updateTableQr = async (req, res) => {
  const { tableId, qrCodeUrl } = req.body;

  if (!tableId || !qrCodeUrl) {
    return res.status(400).send('Table ID and QR code URL are required.');
  }

  try {
    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { QRCode: qrCodeUrl },
      { new: true }
    );
    if (!updatedTable) {
      return res.status(404).send('Table not found.');
    }
    res.json(updatedTable);
  } catch (error) {
    console.error("Error updating table:", error);
    res.status(500).send('Error updating table.');
  }
}


module.exports = {
  addTable,
  login,
  logout,
  getLoggedInTable,
  getAllTables,
  saveQrCode,
  updateTableQr
};