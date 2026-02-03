// backend/models/Dashboard.js
const Employee = require('./Employee');
const Performance = require('./Performance');

class Dashboard {
    static async getOverview() {
        try {
            // Get all stats in parallel
            const [employeeStats, performanceStats, departmentStats, performanceDistribution] = await Promise.all([
                Employee.getDashboardStats(),
                Performance.getDashboardStats(),
                Employee.getDepartmentStats(),
                Performance.getPerformanceDistribution()
            ]);

            return {
                employee_stats: employeeStats,
                performance_stats: performanceStats,
                department_stats: departmentStats,
                performance_distribution: performanceDistribution
            };
        } catch (error) {
            console.error('Dashboard model error:', error);
            throw error;
        }
    }

    static async getKPI() {
        try {
            const [employeeCount] = await db.query('SELECT COUNT(*) as total FROM employees');
            const [performanceAvg] = await db.query('SELECT AVG(score) as avg_score FROM performance_reviews');
            const [departments] = await db.query('SELECT COUNT(DISTINCT department) as total FROM employees');
            
            return {
                total_employees: employeeCount[0].total || 0,
                avg_performance: Math.round(performanceAvg[0].avg_score || 0),
                total_departments: departments[0].total || 0
            };
        } catch (error) {
            console.error('KPI model error:', error);
            throw error;
        }
    }
}

module.exports = Dashboard;