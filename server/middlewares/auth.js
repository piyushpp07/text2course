import jwt from 'jsonwebtoken';

export const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.userId = decoded.id;
      console.log(`[AUTH] JWT verified: ${req.userId}`);
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }
  
  res.status(401).json({ success: false, message: 'No token provided' });
};

export const attachUser = (req, res, next) => {
  // Keeping this for compatibility with other routes if needed, 
  // but userId is already set in checkJwt
  next();
};
