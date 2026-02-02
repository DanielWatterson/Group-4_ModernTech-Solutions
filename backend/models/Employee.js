const db = require('../config/database');

class Employee {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM employees ORDER BY employee_id');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { name, position, department, salary, employment_history, contact } = data;
        const [result] = await db.query(
            `INSERT INTO employees 
            (name, position, department, salary, employment_history, contact) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, position, department, salary, employment_history, contact]
        );
        return { employee_id: result.insertId, ...data };
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        values.push(id);
        
        await db.query(
            `UPDATE employees SET ${fields} WHERE employee_id = ?`,
            values
        );
        return { employee_id: id, ...data };
    }

    static async delete(id) {
        await db.query('DELETE FROM employees WHERE employee_id = ?', [id]);
        return true;
    }
}

module.exports = Employee;