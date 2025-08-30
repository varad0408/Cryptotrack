const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = null;
  const header = req.header('Authorization');

  // Keep your existing logic to get token from header
  if (header && header.startsWith('Bearer ')) {
    token = header.slice(7).trim();
  } 
  // ADDED: If not in header, check URL query (for file downloads)
  else if (req.query.token) {
    token = req.query.token;
  }

  // This part remains unchanged
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};