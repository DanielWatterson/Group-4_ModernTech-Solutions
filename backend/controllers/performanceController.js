// backend/controllers/performanceController.js
const Performance = require('../models/Performance');

exports.getAllPerformance = async (req, res) => {
    try {
        const performance = await Performance.findAll();
        res.json({
            success: true,
            count: performance.length,
            data: performance
        });
    } catch (error) {
        console.error('Performance Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch performance data',
            message: error.message
        });
    }
};

exports.getPerformanceById = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({
                success: false,
                error: 'Performance record not found'
            });
        }
        res.json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Performance Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch performance data'
        });
    }
};