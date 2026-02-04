const express = require('express');
const router = express.Router();

// Controllers
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);
router.get('/dashboard/kpis', dashboardController.getKPIs);
router.get('/health', dashboardController.getHealth);

// Employees
router.get('/employees/:id', employeeController.getEmployeeById);

module.exports = router;
