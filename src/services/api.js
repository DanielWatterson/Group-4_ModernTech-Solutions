// src/services/api.js
import employeeData from '../data/employee_info.json'; // Employee Data imported for fallback information 

const API_BASE = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE;
        this.useFallback = false;
        this.lastFallbackUsed = null;
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            console.log(`🌐 API Request: ${url}`, options.method ? `[${options.method}]` : '');
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ API Success: ${endpoint}`, data.count ? `(${data.count} records)` : '');
            
            // Reset fallback flag on successful API call
            this.useFallback = false;
            return data;
            
        } catch (error) {
            console.warn(`⚠️ API call to ${endpoint} failed:`, error.message);
            console.log('🔄 Switching to fallback data...');
            
            // Use fallback data
            this.useFallback = true;
            this.lastFallbackUsed = new Date();
            return this.getFallbackData(endpoint);
        }
    }

    // This enhances the frontend to allow for fallback data
    getFallbackData(endpoint) {
        console.log(`📁 Loading fallback data from employee_data.json for ${endpoint}`);
        
        const fallbackMap = {
            '/employees': () => {
                // Transforms JSON data for Frontend.
                const employees = employeeData.employeeInformation.map(emp => ({
                    employee_id: emp.employeeId,
                    name: emp.name,
                    position: emp.position,
                    department: emp.department,
                    salary: emp.salary,
                    email: emp.contact,
                    employment_history: emp.employmentHistory,
                    days_off: emp.daysOff || 0,
                    recruitment_date: this.generateRandomDate(2015, 2023) // Add mock dates
                }));
                
                return {
                    success: true,
                    count: employees.length,
                    data: employees,
                    source: 'fallback_json',
                    timestamp: new Date().toISOString()
                };
            },
            
            '/dashboard': () => ({
                success: true,
                data: {
                    employee_stats: {
                        total_employees: employeeData.employeeInformation.length,
                        total_departments: this.getUniqueDepartments().length,
                        avg_salary: this.calculateAverageSalary(),
                        max_salary: this.getMaxSalary(),
                        min_salary: this.getMinSalary(),
                        total_salary: this.getTotalSalary()
                    },
                    department_stats: this.getDepartmentStats(),
                    recent_employees: employeeData.employeeInformation.slice(0, 5),
                    source: 'fallback_json'
                }
            }),
            
            '/performance': () => {
                // This function generates mock performance data
                const performanceData = employeeData.employeeInformation.map(emp => ({
                    employee_id: emp.employeeId,
                    employee_name: emp.name,
                    department: emp.department,
                    score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
                    status: ['Excellent', 'Good', 'Average'][Math.floor(Math.random() * 3)],
                    review_date: this.generateRandomDate(2024, 2025)
                }));
                
                return {
                    success: true,
                    count: performanceData.length,
                    data: performanceData,
                    source: 'fallback_json'
                };
            },
            
            '/payroll': () => {
                // This function generate mock payroll data
                const payrollData = employeeData.employeeInformation.map(emp => ({
                    payroll_id: emp.employeeId,
                    employee_id: emp.employeeId,
                    employee_name: emp.name,
                    payroll_date: '2025-01-31',
                    base_salary: emp.salary,
                    net_pay: Math.round(emp.salary * 0.85), // 15% deductions
                    is_processed: true,
                    source: 'fallback_json'
                }));
                
                return {
                    success: true,
                    count: payrollData.length,
                    data: payrollData,
                    source: 'fallback_json'
                };
            },
            
            '/timeoff': () => ({
                success: true,
                data: {
                    requests: [],
                    balances: employeeData.employeeInformation.map(emp => ({
                        employee_id: emp.employeeId,
                        employee_name: emp.name,
                        annual_leave: 15,
                        sick_leave: 10,
                        used_leave: emp.daysOff || 0,
                        source: 'fallback_json'
                    }))
                }
            }),
            
            '/test': () => ({
                success: true,
                message: 'API is working (fallback mode)',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                source: 'fallback_json'
            }),
            
            '/health': () => ({
                success: true,
                status: 'fallback_mode',
                database: 'disconnected',
                message: 'Using fallback JSON data',
                timestamp: new Date().toISOString(),
                source: 'fallback_json'
            })
        };

        const fallbackHandler = fallbackMap[endpoint];
        if (fallbackHandler) {
            return fallbackHandler();
        }

        return {
            success: false,
            error: 'No fallback data available for this endpoint',
            endpoint: endpoint,
            source: 'fallback_json'
        };
    }

    // Helper methods for fallback data calculations
    getUniqueDepartments() {
        const departments = employeeData.employeeInformation.map(emp => emp.department);
        return [...new Set(departments)].filter(Boolean);
    }

    calculateAverageSalary() {
        const salaries = employeeData.employeeInformation.map(emp => emp.salary);
        const sum = salaries.reduce((total, salary) => total + salary, 0);
        return Math.round(sum / salaries.length);
    }

    getMaxSalary() {
        return Math.max(...employeeData.employeeInformation.map(emp => emp.salary));
    }

    getMinSalary() {
        return Math.min(...employeeData.employeeInformation.map(emp => emp.salary));
    }

    getTotalSalary() {
        return employeeData.employeeInformation.reduce((total, emp) => total + emp.salary, 0);
    }

    getDepartmentStats() {
        const departments = {};
        
        employeeData.employeeInformation.forEach(emp => {
            if (!departments[emp.department]) {
                departments[emp.department] = {
                    department: emp.department,
                    employee_count: 0,
                    avg_salary: 0,
                    total_salary: 0,
                    employees: []
                };
            }
            
            departments[emp.department].employee_count++;
            departments[emp.department].total_salary += emp.salary;
            departments[emp.department].employees.push(emp.name);
        });
        
        // Calculate averages
        Object.values(departments).forEach(dept => {
            dept.avg_salary = Math.round(dept.total_salary / dept.employee_count);
        });
        
        return Object.values(departments);
    }

    generateRandomDate(startYear, endYear) {
        const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1; // Safe day number
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    // Checks if we are still using Fallback mode.
    isUsingFallback() {
        return this.useFallback;
    }

    getLastFallbackUsage() {
        return this.lastFallbackUsed;
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

    async createEmployee(employeeData) {
        // In fallback mode, simulate creation and return
        if (this.useFallback) {
            console.warn('⚠️ CREATE in fallback mode - data not persisted');
            return {
                success: true,
                message: 'Employee created (fallback mode - not saved to database)',
                data: {
                    ...employeeData,
                    employee_id: employeeData.employeeInformation.length + 1,
                    source: 'fallback_simulation'
                },
                warning: 'Database disconnected - changes will not persist'
            };
        }
        
        return this.request('/employees', {
            method: 'POST',
            body: JSON.stringify(employeeData)
        });
    }

    async updateEmployee(id, employeeData) {
        // In fallback mode, simulate update
        if (this.useFallback) {
            console.warn('⚠️ UPDATE in fallback mode - data not persisted');
            return {
                success: true,
                message: 'Employee updated (fallback mode - not saved to database)',
                data: { id, ...employeeData },
                warning: 'Database disconnected - changes will not persist'
            };
        }
        
        return this.request(`/employees/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(employeeData)
        });
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