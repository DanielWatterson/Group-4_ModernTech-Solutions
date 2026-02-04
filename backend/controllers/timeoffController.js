// backend/controllers/timeoffController.js
const TimeOff = require('../models/Timeoff');

exports.getTimeOffData = async (req, res) => {
    try {
        const requests = await TimeOff.getAllRequests();
        const balances = await TimeOff.getBalances();
        res.json({ 
            success: true,
            requests, 
            balances 
        });
    } catch (error) {
        console.error('TimeOff Controller Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch time off data',
            message: error.message 
        });
    }
};

exports.getLeaveBalances = async (req, res) => {
    try {
        const balances = await TimeOff.getBalances();
        res.json({ 
            success: true,
            data: balances 
        });
    } catch (error) {
        console.error('TimeOff Controller Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch leave balances',
            message: error.message 
        });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await TimeOff.updateStatus(id, status);
        res.json({ 
            success: true,
            message: `Request ${status} successfully` 
        });
    } catch (error) {
        console.error('TimeOff Controller Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update request status',
            message: error.message 
        });
    }
};

exports.submitRequest = async (req, res) => {
    try {
        const requestId = await TimeOff.createRequest(req.body);
        res.status(201).json({ 
            success: true,
            message: 'Request submitted', 
            id: requestId 
        });
    } catch (error) {
        console.error('TimeOff Controller Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to submit request',
            message: error.message 
        });
    }
};