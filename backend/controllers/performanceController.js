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
exports.createPerformance = async (req, res) => {
    try {
        const {
            employee_id,
            review_date,
            score,
            status,
            reviewed_by,
            comments
        } = req.body;

        const performance = await Performance.create({
            employee_id,
            review_date,
            score,
            status,
            reviewed_by,
            comments
        });

        res.status(201).json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Performance Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create performance record',
            message: error.message
        });
    }
};
exports.updatePerformance = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);

        if (!performance) {
            return res.status(404).json({
                success: false,
                error: 'Performance record not found'
            });
        }

        await performance.update(req.body);

        res.json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Performance Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update performance record',
            message: error.message
        });
    }
};
