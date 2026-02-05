// backend/models/User.js
const db = require('../config/database.js');

const User = {
  // Find a user by email and password
  findByEmailAndPassword: async (email, password) => {
    try {
      const sql = `SELECT id, name, role, department, email, avatar 
                   FROM users 
                   WHERE email = ? AND password_hash = ? 
                   LIMIT 1`;
      const [rows] = await db.query(sql, [email, password]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = User;
