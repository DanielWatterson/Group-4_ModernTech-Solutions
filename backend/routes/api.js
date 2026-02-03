const express = require('express');
const router = express.Router();

// Import controllers
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');
const { login } = require('../controllers/authController');

// Dashboard routes
router.get('/dashboard', dashboardController.getDashboardData);
router.get('/dashboard/kpis', dashboardController.getKPIs);
router.get('/health', dashboardController.getHealth);

// Employee routes
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);

// Auth route
router.post('/login', login);

module.exports = router;
