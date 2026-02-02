const API_BASE = 'http://localhost:5000/api';

// Generic fetch function
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API call failed:`, error);
        throw error;
    }
}

// API endpoints
export const api = {
    // Employees
    getEmployees: () => fetchAPI('/employees'),
    
    // Payroll
    getPayroll: () => fetchAPI('/payroll'),
    calculatePayroll: (employeeId, data) => 
        fetchAPI(`/payroll/calculate/${employeeId}`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    // Performance
    getPerformance: () => fetchAPI('/performance'),
    
    // Time Off
    getTimeOffRequests: () => fetchAPI('/timeoff'),
    submitTimeOffRequest: (data) => fetchAPI('/timeoff', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateTimeOffRequest: (requestId, action) => 
        fetchAPI(`/timeoff/${requestId}/${action}`, {
            method: 'PUT'
        }),
    
    // Dashboard
    getDashboardStats: () => fetchAPI('/dashboard/stats')
};