// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE;
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            console.log(`🌐 API Request: ${url}`);
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ API Error (${response.status}):`, errorText);
                throw new Error(`API Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ API Success: ${endpoint}`, data.count ? `(${data.count} records)` : '');
            return data;
        } catch (error) {
            console.error(`🔥 API call to ${endpoint} failed:`, error.message);
            // Fallback to local data if API fails
            return this.getFallbackData(endpoint);
        }
    }

    // Fallback data for testing
    getFallbackData(endpoint) {
        console.warn(`⚠️ Using fallback data for ${endpoint}`);
        
        const fallbackData = {
            '/employees': {
                success: true,
                count: 10,
                data: [
                    { employee_id: 1, name: 'Sibongile Nkosi', position: 'Software Engineer', department: 'Development', salary: 70000 },
                    { employee_id: 2, name: 'Lungile Moyo', position: 'HR Manager', department: 'HR', salary: 80000 },
                    // Add more fallback data...
                ]
            },
            '/dashboard': {
                success: true,
                data: {
                    employee_stats: { total_employees: 10, total_departments: 9, avg_salary: 63000 },
                    performance_stats: { avg_score: 79, max_score: 91, total_reviews: 10 },
                    department_stats: [
                        { department: 'Development', employee_count: 1, avg_salary: 70000 },
                        { department: 'HR', employee_count: 1, avg_salary: 80000 }
                    ]
                }
            }
        };

        return fallbackData[endpoint] || { success: false, error: 'No data available' };
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

    // Health check
    async checkHealth() {
        return this.request('/health');
    }

    // Time Off endpoints
    async getTimeOffRequests() {
        return this.request('/timeoff');
    }

    // Test endpoint
    async testConnection() {
        return this.request('/test');
    }
}

export default new ApiService();