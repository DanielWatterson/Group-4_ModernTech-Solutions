const Payroll = require('../models/Payroll');

exports.getPayrollData = async (req, res) => {
    try {
        const data = await Payroll.findAll();
        res.json(data);
    } catch (error) {
        console.error("Fetch Payroll Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateAll = async (req, res) => {
    try {
        // Fetch all employees (including those without current payroll records)
        const employees = await Payroll.findAll();

        if (!employees || employees.length === 0) {
            return res.status(404).json({ error: "No employees found to process" });
        }

        // Map through all employees and trigger the calculation logic
        const promises = employees.map(emp => {
            return Payroll.calculate(emp.employee_id, {
                // Default to 160 hours / 0 leave if no data exists in payroll table yet
                hours_worked: emp.hours_worked || 160,
                leave_deductions: emp.leave_deductions || 0
            });
        });

        // Execute all calculations in parallel
        await Promise.all(promises);

        res.json({
            success: true,
            message: `Payroll processed successfully for ${employees.length} employees.`
        });
    } catch (error) {
        console.error("Payroll Calculation Error:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.resetPayroll = async (req, res) => {
    try {
        await Payroll.resetAll();
        res.json({ success: true, message: "All payroll records have been cleared." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
