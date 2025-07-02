const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No admin token provided' });
    }

    // For now, use a simple admin token check
    // In production, you'd have proper admin user management
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

module.exports = adminAuth;