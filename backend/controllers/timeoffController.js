// backend/controllers/timeoffController.js
const TimeOff = require('../models/Timeoff');

exports.getTimeOffData = async (req, res) => {
    try {
        const requests = await TimeOff.getAllRequests();
        const balances = await TimeOff.getBalances();
        const attendance = await TimeOff.getAttendance();

        res.json({
            success: true,
            requests,
            balances,
            attendance
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

// In backend/controllers/timeoffController.js - submitRequest function
exports.submitRequest = async (req, res) => {
    try {
        // Allow status to be passed in request body
        const { employee_id, leave_type, start_date, end_date, reason, status = 'Pending' } = req.body;

        const requestId = await TimeOff.createRequest({
            employee_id,
            leave_type,
            start_date,
            end_date,
            reason,
            status // Pass status to model
        });

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

exports.deleteRequest = async (req, res) => {
    try {
        await TimeOff.deleteRequest(req.params.id);
        res.json({
            success: true,
            message: 'Record deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.clearPending = async (req, res) => {
    try {
        await TimeOff.clearPendingRequests();
        res.json({
            success: true,
            message: 'All pending requests cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
