import jwt from 'jsonwebtoken';
import logger from './logger.js';

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Access denied: ${req.user.role} is not authorized to access this resource`);
    return res.status(403).json({ error: `Access denied: ${req.user.role} is not authorized to access this`});
  }
  next();
};
