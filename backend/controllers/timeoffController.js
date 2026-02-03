<<<<<<< HEAD
const Timeoff = require('../models/Timeoff');

// For HR dashboard: get all time off requests
exports.getAllTimeoffs = async (req, res, next) => {
  try {
    const rows = await Timeoff.getAllTimeoffs();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Update the status of a time off request
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Matches /timeoff/:id/status
    const { status } = req.body;

    const updated = await Timeoff.updateTimeoffStatus(id, status);
    if (!updated) return res.status(404).json({ message: 'Time off request not found' });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Optional: Get time off requests by employee (if you want to use it)
exports.getEmployeeTimeoffs = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const rows = await Timeoff.getTimeoffsByEmployee(employeeId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
=======
const TimeOff = require('../models/Timeoff');

exports.getTimeOffData = async (req, res) => {
    try {
        const requests = await TimeOff.getAllRequests();
        const balances = await TimeOff.getBalances();
        res.json({ requests, balances });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await TimeOff.updateStatus(id, status);
        res.json({ message: `Request ${status} successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitRequest = async (req, res) => {
    try {
        const requestId = await TimeOff.createRequest(req.body);
        res.status(201).json({ message: 'Request submitted', id: requestId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
>>>>>>> 64f1ab6 (Added the backend for TimeOff and PayRoll(Models, Controllers,upadted the Front-End))
};
