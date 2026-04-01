const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // The token string usually comes in as "Bearer <token>"
    const decodedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Verify using secret
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET || 'fallback_secret');
    
    // Add user from payload
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
