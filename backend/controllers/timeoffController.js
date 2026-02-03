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
};
