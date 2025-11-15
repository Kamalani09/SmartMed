// backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validate email format
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

// Allowed roles
const allowedRoles = ["customer", "owner", "vendor"];

// ==================================================
// REGISTER USER
// ==================================================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, shopName, license, gst, role } = req.body;

    // Required fields
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required.' });

    if (!validateEmail(email))
      return res.status(400).json({ message: 'Invalid email format.' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });

    if (!role || !allowedRoles.includes(role))
      return res.status(400).json({ message: 'Invalid role. Role must be customer, owner, or vendor.' });

    // Check if user exists
    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists. Please log in.' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashed,
      phone,
      address,
      shopName,
      license,
      gst,
      role
    });

    await user.save();

    // Token
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Response
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};


// ==================================================
// LOGIN USER (ROLE-BASED)
// ==================================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    if (!role || !allowedRoles.includes(role))
      return res.status(400).json({ message: 'Invalid role.' });

    // Check user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password.' });

    // Check role (IMPORTANT!)
    if (user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}. You cannot log in as ${role}.`
      });
    }

    // Generate JWT
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};
