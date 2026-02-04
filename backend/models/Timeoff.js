const db = require('../config/database');

<<<<<<< HEAD
class Timeoff {
  // Create a new time off request
  static async requestTimeoff(employeeId, data) {
    const { start_date, end_date, leave_type, reason } = data;

    const [result] = await db.query(
      `INSERT INTO leave_requests
        (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [employeeId, leave_type, start_date, end_date, reason]
    );

    return {
      leave_id: result.insertId,
      employee_id: employeeId,
      leave_type,
      start_date,
      end_date,
      reason,
      status: 'Pending'
    };
  }

  // Get all time off requests (for HR dashboard)
  static async getAllTimeoffs() {
    const [rows] = await db.query(
      `SELECT lr.leave_id, lr.employee_id, e.name, lr.leave_type, lr.start_date, lr.end_date, lr.reason, lr.status
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.employee_id
       ORDER BY lr.start_date DESC`
    );
    return rows;
  }

  // Update status (Approved / Denied)
  static async updateTimeoffStatus(leaveId, status) {
    const [result] = await db.query(
      `UPDATE leave_requests
       SET status = ?
       WHERE leave_id = ?`,
      [status, leaveId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Timeoff;
=======
const TimeOff = {
    // Fetch all leave requests with employee names
    getAllRequests: async () => {
        const [rows] = await db.query(`
            SELECT lr.*, e.name
            FROM leave_requests lr
            JOIN employees e ON lr.employee_id = e.employee_id
            ORDER BY lr.requested_at DESC
        `);
        return rows;
    },

    // Fetch balances for all employees
    getBalances: async () => {
        const [rows] = await db.query(`
            SELECT lb.*, e.name
            FROM leave_balances lb
            JOIN employees e ON lb.employee_id = e.employee_id
        `);
        return rows;
    },

    // Update the status (The DB Trigger will handle balance deduction on 'Approved')
    updateStatus: async (leaveId, status, processedBy = 1) => {
        const [result] = await db.query(
            'UPDATE leave_requests SET status = ?, processed_by = ?, processed_at = NOW() WHERE leave_id = ?',
            [status, processedBy, leaveId]
        );
        return result;
    },

    // Create a new request
    createRequest: async (data) => {
        const { employee_id, leave_type, start_date, end_date, reason } = data;
        const [result] = await db.query(
            'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)',
            [employee_id, leave_type, start_date, end_date, reason]
        );
        return result.insertId;
    }
};

module.exports = TimeOff;
>>>>>>> 64f1ab6 (Added the backend for TimeOff and PayRoll(Models, Controllers,upadted the Front-End))
