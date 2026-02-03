// backend/models/Performance.js
const db = require('../config/database');

class Performance {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT pr.*, e.name as employee_name, e.department 
            FROM performance_reviews pr
            JOIN employees e ON pr.employee_id = e.employee_id
            ORDER BY pr.review_date DESC
        `);
        return rows;
    }

    static async getDashboardStats() {
        const [rows] = await db.query(`
            SELECT 
                AVG(score) as avg_score,
                MAX(score) as max_score,
                MIN(score) as min_score,
                COUNT(*) as total_reviews
            FROM performance_reviews
        `);
        return rows[0];
    }

    static async getTopPerformers(limit = 5) {
        const [rows] = await db.query(`
            SELECT pr.*, e.name as employee_name, e.department 
            FROM performance_reviews pr
            JOIN employees e ON pr.employee_id = e.employee_id
            ORDER BY pr.score DESC 
            LIMIT ?
        `, [limit]);
        return rows;
    }

    static async getPerformanceDistribution() {
        const [rows] = await db.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM performance_reviews
            GROUP BY status
            ORDER BY FIELD(status, 'Excellent', 'Good', 'Average', 'Poor')
        `);
        return rows;
    }
}

module.exports = Performance;