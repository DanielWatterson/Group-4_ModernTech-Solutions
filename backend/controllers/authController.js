// backend/controllers/authController.js
const User = require('../models/User.js');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findByEmailAndPassword(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return only the needed data
    res.json({
      name: user.name,
      role: user.role,
      department: user.department,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
