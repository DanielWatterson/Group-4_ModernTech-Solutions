// backend/routes/api.js
const express = require('express');
const router = express.Router();

// Import controllers
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');

// Dashboard routes
router.get('/dashboard', dashboardController.getDashboardData);
router.get('/dashboard/kpis', dashboardController.getKPIs);
router.get('/health', dashboardController.getHealth);

// Employee routes
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);

module.exports = router;