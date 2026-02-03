// backend/models/Employee.js
const db = require('../config/database');

class Employee {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM employees ORDER BY employee_id');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
        return rows[0];
    }

    static async getDashboardStats() {
        const [rows] = await db.query(`
            SELECT 
                COUNT(*) as total_employees,
                COUNT(DISTINCT department) as total_departments,
                AVG(salary) as avg_salary,
                MAX(salary) as max_salary,
                MIN(salary) as min_salary
            FROM employees
        `);
        return rows[0];
    }

    static async getDepartmentStats() {
        const [rows] = await db.query(`
            SELECT 
                department,
                COUNT(*) as employee_count,
                AVG(salary) as avg_salary
            FROM employees 
            GROUP BY department 
            ORDER BY employee_count DESC
        `);
        return rows;
    }

    static async getRecentJoiners(limit = 5) {
        const [rows] = await db.query(`
            SELECT * FROM employees 
            ORDER BY employee_id DESC 
            LIMIT ?
        `, [limit]);
        return rows;
    }
}

module.exports = Employee;