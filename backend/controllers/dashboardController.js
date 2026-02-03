// backend/controllers/dashboardController.js
const Dashboard = require('../models/Dashboard');
const db = require('../config/database');

exports.getDashboardData = async (req, res) => {
    try {
        const dashboardData = await Dashboard.getOverview();
        res.json({
            success: true,
            data: dashboardData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Dashboard Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data',
            message: error.message
        });
    }
};

exports.getKPIs = async (req, res) => {
    try {
        const kpiData = await Dashboard.getKPI();
        res.json({
            success: true,
            data: kpiData
        });
    } catch (error) {
        console.error('KPI Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch KPI data'
        });
    }
};

exports.getHealth = async (req, res) => {
    try {
        // Test database connection
        const [dbTest] = await db.query('SELECT 1 as test');
        
        res.json({
            status: 'healthy',
            database: dbTest[0].test === 1 ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};