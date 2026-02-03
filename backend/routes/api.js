const express = require('express');
const router = express.Router();

// Controllers
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');
const timeoffController = require('../controllers/timeoffController');

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);
router.get('/dashboard/kpis', dashboardController.getKPIs);
router.get('/health', dashboardController.getHealth);

// Employees
router.get('/employees/:id', employeeController.getEmployeeById);

// Time Off
router.get('/timeoff', timeoffController.getAllTimeoffs);         // HR: get all requests
router.put('/timeoff/:id/status', timeoffController.updateStatus); // Approve/Deny

module.exports = router;
