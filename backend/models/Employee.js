// backend/models/Employee.js
const db = require('../config/database');

class Employee {
    // GET ALL EMPLOYEES
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM employees ORDER BY employee_id');
            return rows;
        } catch (error) {
            console.error('Employee.findAll Error:', error);
            throw error;
        }
    }

    // GET BY ID
    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Employee.findById Error:', error);
            throw error;
        }
    }

    // GET DASHBOARD STATS
    static async getDashboardStats() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    COUNT(*) as total_employees,
                    COUNT(DISTINCT department) as total_departments,
                    AVG(salary) as avg_salary,
                    MAX(salary) as max_salary,
                    MIN(salary) as min_salary,
                    SUM(salary) as total_salary
                FROM employees
            `);
            return rows[0];
        } catch (error) {
            console.error('Employee.getDashboardStats Error:', error);
            throw error;
        }
    }

    // GET DEPARTMENT STATS
    static async getDepartmentStats() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    department,
                    COUNT(*) as employee_count,
                    AVG(salary) as avg_salary,
                    SUM(salary) as total_salary
                FROM employees 
                GROUP BY department 
                ORDER BY employee_count DESC
            `);
            return rows;
        } catch (error) {
            console.error('Employee.getDepartmentStats Error:', error);
            throw error;
        }
    }

    // GET RECENT JOINERS
    static async getRecentJoiners(limit = 5) {
        try {
            const [rows] = await db.query(`
                SELECT * FROM employees 
                ORDER BY recruitment_date DESC 
                LIMIT ?
            `, [limit]);
            return rows;
        } catch (error) {
            console.error('Employee.getRecentJoiners Error:', error);
            throw error;
        }
    }

    // GET EMPLOYEES BY DEPARTMENT
    static async getByDepartment(department) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM employees WHERE department = ? ORDER BY name',
                [department]
            );
            return rows;
        } catch (error) {
            console.error('Employee.getByDepartment Error:', error);
            throw error;
        }
    }
}

module.exports = Employee;