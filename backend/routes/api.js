// backend/routes/api.js
const express = require('express');
const router = express.Router();

// Controllers
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');
const payrollController = require('../controllers/payrollController');
const timeoffController = require('../controllers/timeoffController');

// ========== TEST ROUTES ==========
router.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

router.get('/debug', async (req, res) => {
    try {
        const db = require('../config/database');
        const [employees] = await db.query('SELECT COUNT(*) as count FROM employees');
        const [performance] = await db.query('SELECT COUNT(*) as count FROM performance_reviews');
        
        res.json({
            success: true,
            database: 'connected',
            employees: employees[0].count,
            performance_reviews: performance[0].count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== DASHBOARD ROUTES ==========
router.get('/health', dashboardController.getHealth);
router.get('/dashboard', dashboardController.getDashboardData);
router.get('/dashboard/kpis', dashboardController.getKPIs);

// ========== EMPLOYEE ROUTES ==========
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);

// ========== PAYROLL ROUTES ==========
router.get('/payroll', payrollController.getPayrollData);
router.post('/payroll/calculate', payrollController.calculateAll);

// ========== TIME OFF ROUTES ==========
router.get('/timeoff', timeoffController.getTimeOffData);
router.get('/timeoff/balances', timeoffController.getLeaveBalances);

// ========== PERFORMANCE ROUTES ==========
router.get('/performance', async (req, res) => {
    try {
        const db = require('../config/database');
        const [rows] = await db.query(`
            SELECT pr.*, e.name as employee_name, e.department 
            FROM performance_reviews pr
            JOIN employees e ON pr.employee_id = e.employee_id
            ORDER BY pr.review_date DESC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Performance route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch performance data',
            message: error.message
        });
    }
});

module.exports = router;