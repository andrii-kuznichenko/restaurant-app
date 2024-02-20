const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const auth = await jwt.verify(accessToken, SECRET);
      req.table = auth;
      console.log('auth', auth);
      next();
    } else {
      console.log('acces');
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    // We're expecting that previous middleware has put the user object on the request object
    // Given that, we can just inspect their role.
    console.log(req.table, role);
    if (req.table.role === role) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

module.exports = { authenticate, authorize };