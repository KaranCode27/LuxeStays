import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // First, ask the database if a user with this email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Command the database to create a new User document
    // (Notice we don't manually hash here because we wrote a 'pre-save' hook in the User model to do it automatically!)
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    if (user) {
      // Create a secure cookie token for the new user so they are instantly logged in
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Successfully registered and logged in!'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user. We must explicitly ask for the password field because we set `select: false` in the model schema!
    const user = await User.findOne({ email }).select('+password').populate('wishlist', 'name location images pricePerNight starRating');

    // 2. If user exists, use the custom `matchPassword` method we built in the User Model to compare the hash
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  // To "logout" using HttpOnly cookies, we simply overwrite the 'jwt' cookie with nothing, and make it expire immediately
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile data
// @route   GET /api/v1/auth/profile
// @access  Private (Needs Token)
export const getUserProfile = async (req, res) => {
  // Since this route will be protected by our authMiddleware, we already securely have `req.user`
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name location images pricePerNight starRating');

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        wishlist: user.wishlist
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
