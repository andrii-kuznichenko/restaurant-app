const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const admin = await jwt.verify(accessToken, SECRET);
      req.admin = admin;
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { authenticate };