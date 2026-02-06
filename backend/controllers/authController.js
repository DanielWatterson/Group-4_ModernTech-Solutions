const db = require('../config/database');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    // This is a direct database query to match SQL structure
    const [users] = await db.query(
      `SELECT user_id, name, role, department, email, avatar, password_hash
      FROM users
      WHERE email = ?
      LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Check password
    if (user.password_hash !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Return user data (exclude password)
    res.json({
      success: true,
      data: {
        id: user.user_id,
        name: user.name,
        role: user.role,
        department: user.department,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
};
