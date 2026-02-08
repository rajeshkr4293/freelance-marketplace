const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * REGISTER USER
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'All fields (name, email, password, role) are required'
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 5. Response
    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * LOGIN USER (JWT ACCESS TOKEN)
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // 2. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // 3. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Response
    res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
