<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-11">
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold">Employees</h2>
          <div class="d-flex align-items-center">
            <div v-if="loading" class="spinner-border text-light me-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <button @click="loadEmployees" class="btn btn-outline-light btn-sm">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>

        <!-- Connection Status -->
        <div v-if="connectionStatus" class="alert mb-4" :class="connectionStatus.class" role="alert">
          <i class="bi me-2" :class="connectionStatus.icon"></i> {{ connectionStatus.message }}
          <button type="button" class="btn-close" @click="connectionStatus = null"></button>
        </div>

        <!-- Search & Filter -->
        <div class="d-flex gap-3 mb-4">
          <input
            type="text"
            class="form-control"
            placeholder="Search by name or position..."
            v-model="searchQuery"
            :disabled="loading"
          />

          <select class="form-select w-25" v-model="selectedDepartment" :disabled="loading">
            <option value="">All Departments</option>
            <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>

        <!-- No Results Message -->
        <div v-if="!loading && filteredEmployees.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No employees found. Try a different search term.
        </div>

        <!-- Employee Cards -->
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="employee in filteredEmployees" :key="employee.employee_id || employee.employeeId">
            <div class="border rounded p-3 shadow-sm hover-card">
              <!-- Name & Position -->
              <h5 class="fw-bold mb-1">{{ employee.name }}</h5>
              <p class="text-muted mb-1">{{ employee.position }}</p>

              <!-- Department Badge -->
              <p class="mb-1">
                <strong>Department:</strong>
                <span :class="['badge ms-2', departmentBadge(employee.department)]">
                  {{ employee.department }}
                </span>
              </p>

              <!-- Salary with Status Color -->
              <p class="mb-1">
                <strong>Salary:</strong>
                <span :class="['fw-bold ms-2', salaryColor(employee.salary)]">
                  R{{ formatSalary(employee.salary) }}
                </span>
              </p>

              <!-- Contact -->
              <p class="mb-1">
                <strong>Email:</strong> 
                <span class="ms-2">{{ employee.contact || employee.email || 'N/A' }}</span>
              </p>

              <!-- History -->
              <p class="mb-2 text-muted small" v-if="employee.employment_history">
                {{ truncateText(employee.employment_history, 80) }}
              </p>

              <!-- Employee ID -->
              <small class="text-muted">ID: {{ employee.employee_id || employee.employeeId }}</small>
            </div>
          </div>
        </div>

        <!-- Loading overlay -->
        <div v-if="loading" class="loading-overlay">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
          <p class="mt-3">Loading employees...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import your JSON fallback data
import employeeData from '@/data/employee_info.json';

export default {
  name: 'Employees',

  data() {
    return {
      searchQuery: '',
      selectedDepartment: '',
      employees: [],
      loading: false,
      connectionStatus: null,
      useApi: true // Toggle between API and JSON
    }
  },

  computed: {
    uniqueDepartments() {
      // Filter out null/undefined departments
      const departments = this.employees
        .map((e) => e.department)
        .filter(Boolean);
      return [...new Set(departments)].sort();
    },

    filteredEmployees() {
      return this.employees.filter((employee) => {
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch =
          employee.name.toLowerCase().includes(searchLower) ||
          (employee.position && employee.position.toLowerCase().includes(searchLower));

        const matchesDept =
          this.selectedDepartment === '' || 
          employee.department === this.selectedDepartment;

        return matchesSearch && matchesDept;
      });
    },
  },

  async created() {
    await this.loadEmployees();
  },

  methods: {
    async loadEmployees() {
      this.loading = true;
      
      if (this.useApi) {
        await this.loadFromAPI();
      } else {
        await this.loadFromJSON();
      }
      
      this.loading = false;
    },

    async loadFromAPI() {
      try {
        console.log('Fetching employees from API...');
        const response = await fetch('http://localhost:5000/api/employees');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Handle different API response formats
        if (result.success && result.data) {
          // Format: { success: true, data: [...], count: X }
          this.employees = result.data;
          this.connectionStatus = {
            class: 'alert-success',
            icon: 'bi-check-circle',
            message: `✅ Connected to database (${result.count || this.employees.length} employees loaded)`
          };
        } else if (Array.isArray(result)) {
          // Format: [...]
          this.employees = result;
          this.connectionStatus = {
            class: 'alert-success',
            icon: 'bi-check-circle',
            message: `✅ Connected to database (${result.length} employees loaded)`
          };
        } else if (result.data && Array.isArray(result.data)) {
          // Another possible format
          this.employees = result.data;
          this.connectionStatus = {
            class: 'alert-success',
            icon: 'bi-check-circle',
            message: `✅ Connected to database (${result.data.length} employees loaded)`
          };
        } else {
          throw new Error('Unexpected API response format');
        }
        
        console.log('API response:', result);
        
      } catch (error) {
        console.warn('API fetch failed, falling back to JSON:', error.message);
        this.connectionStatus = {
          class: 'alert-warning',
          icon: 'bi-exclamation-triangle',
          message: `⚠️ API Connection Failed: ${error.message}. Using local data.`
        };
        await this.loadFromJSON();
      }
    },

    async loadFromJSON() {
      try {
        this.employees = employeeData.employeeInformation || [];
        this.connectionStatus = {
          class: 'alert-info',
          icon: 'bi-database',
          message: `📁 Using local data (${this.employees.length} employees loaded)`
        };
        this.useApi = false;
      } catch (error) {
        console.error('JSON load failed:', error);
        this.employees = [];
        this.connectionStatus = {
          class: 'alert-danger',
          icon: 'bi-x-circle',
          message: '❌ Failed to load employee data from any source'
        };
      }
    },

    formatSalary(salary) {
      if (!salary && salary !== 0) return '0.00';
      return salary.toLocaleString('en-ZA', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    },

    truncateText(text, maxLength) {
      if (!text || text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },

    departmentBadge(dept) {
      if (!dept) return 'bg-secondary';
      
      const colors = {
        Development: 'bg-primary',
        HR: 'bg-danger',
        QA: 'bg-warning text-dark',
        Sales: 'bg-success',
        Marketing: 'bg-info text-dark',
        Design: 'bg-secondary',
        IT: 'bg-dark',
        Finance: 'bg-success',
        Support: 'bg-primary',
        'Human Resources': 'bg-danger',
        'Quality Assurance': 'bg-warning text-dark',
      };
      return colors[dept] || 'bg-secondary';
    },

    salaryColor(salary) {
      if (!salary && salary !== 0) return 'text-secondary';
      if (salary >= 70000) return 'text-success';
      if (salary >= 60000) return 'text-warning';
      return 'text-danger';
    },
  }
}
</script>

<style scoped>
/* Employees page container */
.container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding: 60px 20px;
  background:
    linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)),
    url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
      center/cover no-repeat;
  color: #fff;
  animation: fadeIn 0.8s ease-out;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
}

/* Page Header */
h2.fw-bold {
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Alerts */
.alert {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.alert-success {
  background: rgba(40, 167, 69, 0.2);
  color: #75b798;
  border-color: rgba(40, 167, 69, 0.3);
}

.alert-warning {
  background: rgba(255, 193, 7, 0.2);
  color: #ffd351;
  border-color: rgba(255, 193, 7, 0.3);
}

.alert-info {
  background: rgba(23, 162, 184, 0.2);
  color: #6edff6;
  border-color: rgba(23, 162, 184, 0.3);
}

.alert-danger {
  background: rgba(220, 53, 69, 0.2);
  color: #ff6b6b;
  border-color: rgba(220, 53, 69, 0.3);
}

/* Filters */
.form-control,
.form-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-control:focus,
.form-select:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #6c63ff;
  color: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.25);
}

.form-select option {
  background: rgba(24, 40, 72, 0.95);
  color: #fff;
  padding: 10px;
}

/* Employee Cards */
.hover-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 25px 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  position: relative;
  overflow: hidden;
}

.hover-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6c63ff, #3f51b5);
  border-radius: 20px 20px 0 0;
}

.hover-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(108, 99, 255, 0.5);
}

/* Employee text */
.hover-card h5 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 4px;
  font-weight: 600;
}

.hover-card p {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 8px;
  line-height: 1.5;
}

.hover-card small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

/* Department Badge */
.badge {
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.badge:hover {
  transform: scale(1.05);
}

/* Department badge colors - enhanced */
.badge.bg-primary {
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.4), rgba(63, 81, 181, 0.4));
  color: #fff;
  border-color: rgba(108, 99, 255, 0.5);
}
.badge.bg-danger {
  background: linear-gradient(135deg, rgba(255, 72, 72, 0.4), rgba(220, 53, 69, 0.4));
  color: #fff;
  border-color: rgba(255, 72, 72, 0.5);
}
.badge.bg-warning {
  background: linear-gradient(135deg, rgba(255, 196, 0, 0.4), rgba(255, 193, 7, 0.4));
  color: #000;
  border-color: rgba(255, 196, 0, 0.5);
}
.badge.bg-success {
  background: linear-gradient(135deg, rgba(72, 255, 99, 0.4), rgba(40, 167, 69, 0.4));
  color: #000;
  border-color: rgba(72, 255, 99, 0.5);
}
.badge.bg-info {
  background: linear-gradient(135deg, rgba(0, 183, 255, 0.4), rgba(23, 162, 184, 0.4));
  color: #000;
  border-color: rgba(0, 183, 255, 0.5);
}
.badge.bg-secondary {
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.4), rgba(108, 117, 125, 0.4));
  color: #fff;
  border-color: rgba(128, 128, 128, 0.5);
}
.badge.bg-dark {
  background: linear-gradient(135deg, rgba(50, 50, 50, 0.4), rgba(33, 37, 41, 0.4));
  color: #fff;
  border-color: rgba(50, 50, 50, 0.5);
}

/* Salary colors */
.text-success {
  color: #4caf50 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.text-warning {
  color: #ffb74d !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.text-danger {
  color: #e57373 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.text-secondary {
  color: #b0bec5 !important;
}

/* Buttons */
.btn-outline-light {
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
    gap: 15px;
  }
  
  .form-select.w-25 {
    width: 100% !important;
  }
  
  .container {
    padding: 40px 15px;
  }
  
  .hover-card {
    padding: 20px 15px;
  }
  
  h2.fw-bold {
    font-size: 1.8rem;
  }
}
</style>