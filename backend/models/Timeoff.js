// backend/models/Timeoff.js
const db = require('../config/database');

const TimeOff = {
    // Fetch all leave requests with employee names
    getAllRequests: async () => {
        try {
            const [rows] = await db.query(`
                SELECT lr.*, e.name as employee_name, e.department
                FROM leave_requests lr
                JOIN employees e ON lr.employee_id = e.employee_id
                ORDER BY lr.requested_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('TimeOff.getAllRequests Error:', error);
            throw error;
        }
    },
    getAttendance: async () => {
    const [rows] = await db.query(`
        SELECT a.*, e.name as employee_name
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
        ORDER BY a.date DESC
    `);
    return rows;
},
    // Fetch balances for all employees
    getBalances: async () => {
        try {
            const [rows] = await db.query(`
                SELECT lb.*, e.name as employee_name, e.department
                FROM leave_balances lb
                JOIN employees e ON lb.employee_id = e.employee_id
            `);
            return rows;
        } catch (error) {
            console.error('TimeOff.getBalances Error:', error);
            throw error;
        }
    },

    // Update the status (The DB Trigger will handle balance deduction on 'Approved')
    updateStatus: async (leaveId, status, processedBy = 1) => {
        try {
            const [result] = await db.query(
                'UPDATE leave_requests SET status = ?, processed_by = ?, processed_at = NOW() WHERE leave_id = ?',
                [status, processedBy, leaveId]
            );
            return result;
        } catch (error) {
            console.error('TimeOff.updateStatus Error:', error);
            throw error;
        }
    },

    // Create a new request
      createRequest: async (data) => {
        try {
            const { employee_id, leave_type, start_date, end_date, reason } = data;
            const [result] = await db.query(
                'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)',
                [employee_id, leave_type, start_date, end_date, reason]
            );
            return result.insertId;
        } catch (error) {
            console.error('TimeOff.createRequest Error:', error);
            throw error;
        }
    },
    // Add these inside the TimeOff object
     deleteRequest: async (leaveId) => {
         return await db.query('DELETE FROM leave_requests WHERE leave_id = ?', [leaveId]);
    },

    clearPendingRequests: async () => {
    return await db.query("DELETE FROM leave_requests WHERE status = 'Pending'");
}
};

module.exports = TimeOff;
