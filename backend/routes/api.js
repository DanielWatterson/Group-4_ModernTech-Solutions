const express = require('express');
const router = express.Router();

// Controllers
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');
const { login } = require('../controllers/authController');
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

module.exports = router;
