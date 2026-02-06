const db = require('../config/database');

class Payroll {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT
                e.employee_id, e.name, e.position, e.salary, e.department,
                p.hours_worked,
                -- Live subquery for Timeoff correspondence
                (SELECT COALESCE(SUM(DATEDIFF(end_date, start_date) + 1), 0)
                 FROM leave_requests
                 WHERE employee_id = e.employee_id
                 AND status = 'Approved'
                 AND MONTH(start_date) = MONTH(CURDATE())
                ) AS leave_deductions,
                p.gross_pay, p.tax_deductions, p.net_pay
            FROM employees e
            LEFT JOIN payroll p ON e.employee_id = p.employee_id
            ORDER BY e.employee_id
        `);
        return rows;
    }

    static async calculate(employeeId, data) {
        const [employeeData] = await db.query(`
            SELECT e.salary,
            (SELECT COALESCE(SUM(DATEDIFF(end_date, start_date) + 1), 0)
             FROM leave_requests
             WHERE employee_id = e.employee_id
             AND status = 'Approved'
             AND MONTH(start_date) = MONTH(CURDATE())
            ) AS approved_leave_days
            FROM employees e
            WHERE e.employee_id = ?`,
            [employeeId]
        );

        if (employeeData.length === 0) throw new Error('Employee not found');

        const monthlySalary = parseFloat(employeeData[0].salary);
        const leaveDays = employeeData[0].approved_leave_days;

        const dailyRate = monthlySalary / 22;
        const leaveCost = dailyRate * leaveDays;
        const grossPayAfterLeave = monthlySalary - leaveCost;
        const taxes = grossPayAfterLeave * 0.25;
        const netPay = grossPayAfterLeave - taxes;

        const [result] = await db.query(
            `INSERT INTO payroll
            (employee_id, payroll_date, hours_worked, leave_deductions, base_salary, gross_pay, tax_deductions, net_pay, is_processed, processed_at)
            VALUES (?, CURDATE(), 160, ?, ?, ?, ?, ?, TRUE, NOW())
            ON DUPLICATE KEY UPDATE
            leave_deductions = VALUES(leave_deductions),
            gross_pay = VALUES(gross_pay),
            tax_deductions = VALUES(tax_deductions),
            net_pay = VALUES(net_pay),
            processed_at = NOW()`,
            [employeeId, leaveDays, monthlySalary, grossPayAfterLeave, taxes, netPay]
        );

        return result;
    }

    // Reset functionality to clear duplicates (common logic error found when refreshing page)
    static async resetAll() {
        return await db.query('TRUNCATE TABLE payroll');
    }
}

module.exports = Payroll;
