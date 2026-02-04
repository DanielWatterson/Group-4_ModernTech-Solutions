const Payroll = require('../models/Payroll');

exports.getPayrollData = async (req, res) => {
    try {
        const data = await Payroll.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.calculateAll = async (req, res) => {
    try {
        const employees = await Payroll.findAll();

        // Loop through all employees and calculate/save their payroll
        const promises = employees.map(emp => {
            return Payroll.calculate(emp.employee_id, {
                // Using existing hours/leave or defaults if they are null
                hours_worked: emp.hours_worked || 160,
                leave_deductions: emp.leave_deductions || 0
            });
        });

        await Promise.all(promises);
        res.json({ message: "All payrolls calculated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
