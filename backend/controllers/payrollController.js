const Payroll = require('../models/Payroll');

// 1. Fetches data to show on the table (including leave days from Timeoff)
exports.getPayrollData = async (req, res) => {
    try {
        const data = await Payroll.findAll();
        res.json(data);
    } catch (error) {
        console.error("Fetch Payroll Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. RUN SIMULATION: Processes all employees and syncs with Timeoff
exports.calculateAll = async (req, res) => {
    try {
        // We fetch the current list of employees
        const employees = await Payroll.findAll();

        if (!employees || employees.length === 0) {
            return res.status(404).json({ error: "No employees found to process" });
        }

        // For every employee, run the Model.calculate function.
        // This function inside the model is what looks at the leave_requests table.
        const promises = employees.map(emp => {
            return Payroll.calculate(emp.employee_id);
        });

        // Execute all calculations
        await Promise.all(promises);

        res.json({
            success: true,
            message: `Payroll simulated successfully. Leave days have been synced from Timeoff.`
        });
    } catch (error) {
        console.error("Payroll Calculation Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. RESET: Wipes the payroll table clean to avoid duplicates
exports.resetPayroll = async (req, res) => {
    try {
        // This calls the static resetAll method in your model
        await Payroll.resetAll();

        res.json({
            success: true,
            message: "Payroll database has been reset. You can now run a fresh simulation."
        });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ error: error.message });
    }
};
