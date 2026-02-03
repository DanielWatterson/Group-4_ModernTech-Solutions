// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const apiRoutes = require('./routes/api');

// Use API routes
app.use('/api', apiRoutes);

// Test route (keep your existing one)
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'ModernTech HR API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            dashboard: '/api/dashboard',
            employees: '/api/employees',
            test: '/api/test'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`👥 Employees: http://localhost:${PORT}/api/employees`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});