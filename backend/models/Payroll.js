const db = require('../config/database');

class Payroll {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT
                e.employee_id, e.name, e.position, e.salary, e.department,
                p.hours_worked, p.leave_deductions,
                p.gross_pay, p.tax_deductions, p.net_pay
            FROM employees e
            LEFT JOIN payroll p ON e.employee_id = p.employee_id
            ORDER BY e.employee_id
        `);
        return rows;
    }

    static async calculate(employeeId, data) {
        const { hours_worked, leave_deductions } = data;

        // 1. Get employee salary from the employees table
        const [employee] = await db.query(
            'SELECT salary FROM employees WHERE employee_id = ?',
            [employeeId]
        );

        if (!employee.length) {
            throw new Error('Employee not found');
        }

        // 2. Perform Calculations
        const monthlySalary = parseFloat(employee[0].salary);
        const dailyRate = monthlySalary / 22;
        const leaveCost = dailyRate * (leave_deductions || 0);
        const grossPayAfterLeave = monthlySalary - leaveCost;
        const taxRate = 0.25;
        const taxes = grossPayAfterLeave * taxRate;
        const netPay = grossPayAfterLeave - taxes;

        // 3. Save to database using your specific schema column names
        // Note: Included payroll_date, base_salary, and is_processed to satisfy NOT NULL constraints
        const [result] = await db.query(
            `INSERT INTO payroll
            (employee_id, payroll_date, hours_worked, leave_deductions, base_salary, gross_pay, tax_deductions, net_pay, is_processed, processed_at)
            VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?, TRUE, NOW())
            ON DUPLICATE KEY UPDATE
            hours_worked = VALUES(hours_worked),
            leave_deductions = VALUES(leave_deductions),
            gross_pay = VALUES(gross_pay),
            tax_deductions = VALUES(tax_deductions),
            net_pay = VALUES(net_pay),
            is_processed = TRUE,
            processed_at = NOW()`,
            [employeeId, hours_worked, leave_deductions, monthlySalary, grossPayAfterLeave, taxes, netPay]
        );

        return {
            payroll_id: result.insertId || null,
            gross_pay: grossPayAfterLeave,
            tax_amount: taxes,
            net_pay: netPay
        };
    }
}

module.exports = Payroll;
