const db = require('../config/database');

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
