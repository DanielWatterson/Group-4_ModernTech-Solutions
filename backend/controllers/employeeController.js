// backend/controllers/employeeController.js
const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        console.error('Employee Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch employees'
        });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'Employee not found'
            });
        }
        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('Employee Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch employee'
        });
    }
};