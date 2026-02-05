const db = require('../config/database.js');

const User = {
  // Find a user by email and password
  findByEmailAndPassword: async (email, password) => {
    try {
      const sql = `SELECT user_id as id, name, role, department, email, avatar 
                   FROM users 
                   WHERE email = ? AND password_hash = ? 
                   LIMIT 1`;
      const [rows] = await db.query(sql, [email, password]);
      return rows[0] || null;
    } catch (err) {
      console.error('User model error:', err);
      throw err;
    }
  },

  // Get all users (for debugging)
  findAll: async () => {
    try {
      const [rows] = await db.query('SELECT user_id, name, email, role FROM users');
      return rows;
    } catch (err) {
      console.error('User findAll error:', err);
      throw err;
    }
  }
};

module.exports = User;