import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes: Ensures a user is logged in
export const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Decode and verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database based on the userId payload inside the token, 
      // but without returning their password hash
      req.user = await User.findById(decoded.userId).select('-password');

      next(); // Bouncer allows them to proceed to the route
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware: Ensures a user also has the 'admin' role
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
