const db = require('../config/database');

class Payroll {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT 
                e.employee_id, e.name, e.position, e.salary, e.department,
                p.hours_worked, p.leave_deductions, p.gross_salary, p.tax_amount, p.net_salary
            FROM employees e
            LEFT JOIN payroll p ON e.employee_id = p.employee_id
            ORDER BY e.employee_id
        `);
        return rows;
    }

    static async calculate(employeeId, data) {
        const { hours_worked, leave_deductions } = data;
        
        // Get employee salary
        const [employee] = await db.query(
            'SELECT salary FROM employees WHERE employee_id = ?',
            [employeeId]
        );
        
        if (!employee.length) {
            throw new Error('Employee not found');
        }
        
        const monthlySalary = employee[0].salary;
        const dailyRate = monthlySalary / 22;
        const leaveCost = dailyRate * leave_deductions;
        const grossPayAfterLeave = monthlySalary - leaveCost;
        const taxRate = 0.25;
        const taxes = grossPayAfterLeave * taxRate;
        const netPay = grossPayAfterLeave - taxes;
        
        // Save to database
        const [result] = await db.query(
            `INSERT INTO payroll 
            (employee_id, hours_worked, leave_deductions, gross_salary, tax_amount, net_salary) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            hours_worked = VALUES(hours_worked),
            leave_deductions = VALUES(leave_deductions),
            gross_salary = VALUES(gross_salary),
            tax_amount = VALUES(tax_amount),
            net_salary = VALUES(net_salary)`,
            [employeeId, hours_worked, leave_deductions, grossPayAfterLeave, taxes, netPay]
        );
        
        return {
            payroll_id: result.insertId,
            gross_pay: grossPayAfterLeave,
            tax_amount: taxes,
            net_pay: netPay
        };
    }
}

module.exports = Payroll;