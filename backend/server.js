// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const apiRoutes = require('./routes/api');

// Use API routes
app.use('/api', apiRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend is working!',
        timestamp: new Date().toISOString(),
        database: 'MySQL'
    });
});

// Database health check
app.get('/api/health-check', async (req, res) => {
    try {
        const db = require('./config/database');
        const [result] = await db.query('SELECT 1 as status, NOW() as timestamp');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: result[0].timestamp
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'ModernTech HR API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            dashboard: '/api/dashboard',
            employees: '/api/employees',
            payroll: '/api/payroll',
            performance: '/api/performance',
            timeoff: '/api/timeoff',
            test: '/api/test',
            'health-check': '/api/health-check'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        availableEndpoints: [
            'GET /api/employees',
            'GET /api/employees/:id',
            'GET /api/dashboard',
            'GET /api/health',
            'GET /api/performance',
            'GET /api/payroll',
            'GET /api/timeoff'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`👥 Employees: http://localhost:${PORT}/api/employees`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔄 Test: http://localhost:${PORT}/api/test`);
});