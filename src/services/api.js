// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API call to ${endpoint} failed:`, error);
            throw error;
        }
    }

    // Dashboard endpoints
    async getDashboardData() {
        return this.request('/dashboard');
    }

    async getKPIs() {
        return this.request('/dashboard/kpis');
    }

    // Employee endpoints
    async getEmployees() {
        return this.request('/employees');
    }

    async getEmployee(id) {
        return this.request(`/employees/${id}`);
    }

    // Performance endpoints
    async getPerformance() {
        return this.request('/performance');
    }

    // Payroll endpoints
    async getPayroll() {
        return this.request('/payroll');
    }

    async calculatePayroll(employeeId, data) {
        return this.request(`/payroll/calculate/${employeeId}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Health check
    async checkHealth() {
        return this.request('/health');
    }

    // Time Off endpoints
    async getTimeOffRequests() {
        return this.request('/timeoff');
    }

    async getLeaveBalances() {
        return this.request('/timeoff/balances');
    }
}

export default new ApiService();