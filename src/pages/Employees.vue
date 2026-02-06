<template>
  <div class="employees-page">
    <div class="container-fluid">
      <div class="row align-items-center mb-4">
        <div class="col-md-6">
          <h1 class="h2 fw-bold mb-2">Employees Directory</h1>
          <p class="text-muted mb-0">Manage and view all employee information</p>
        </div>
        <div class="col-md-6 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-2">
            <div v-if="loading" class="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <button class="btn btn-primary shadow-sm" @click="addNewEmployee">
              <i class="bi bi-plus-lg"></i> Add Employee
            </button>
            <button @click="loadEmployees" class="btn btn-outline-primary btn-sm" :disabled="loading">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="mb-5">
        <EmployeeForm
          :employee="selectedEmployee"
          @saved="onEmployeeSaved"
          @cancel="closeForm"
        />
      </div>

      <!-- Connection Status Alert -->
      <div v-if="connectionStatus" class="alert mb-4 alert-dismissible fade show" :class="connectionStatus.class" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi me-2" :class="connectionStatus.icon"></i>
          <div class="flex-grow-1">{{ connectionStatus.message }}</div>
          <button type="button" class="btn-close" @click="connectionStatus = null"></button>
        </div>
      </div>

      <!-- Offline/Fallback Mode Alert -->
      <div v-if="isOfflineMode" class="alert alert-warning alert-dismissible fade show mb-4" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi bi-database-exclamation me-2"></i>
          <div class="flex-grow-1">
            <strong>Offline Mode:</strong> Showing fallback data from JSON file. 
            Database connection is not available. Changes will not be persisted.
          </div>
          <button type="button" class="btn-close" @click="dismissOfflineWarning"></button>
        </div>
      </div>

      <!-- Data Source Indicator -->
      <div v-if="!loading && employees.length > 0" class="mb-3">
        <div class="d-flex align-items-center text-muted small">
          <i class="bi bi-info-circle me-2"></i>
          <span>
            Showing {{ filteredEmployees.length }} of {{ employees.length }} employees
            <span v-if="dataSource" class="ms-2 badge" :class="dataSourceClass">
              {{ dataSource }}
            </span>
          </span>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-transparent">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by name, position, or email..."
                  v-model="searchQuery"
                  :disabled="loading"
                />
              </div>
            </div>
            <div class="col-md-6">
              <select class="form-select" v-model="selectedDepartment" :disabled="loading">
                <option value="">All Departments</option>
                <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">
                  {{ dept }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="employee in filteredEmployees" :key="employee.employee_id || employee.employeeId" class="col">
          <div class="card employee-card h-100 border-0 shadow-sm" :class="{ 'offline-card': isOfflineMode }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="fw-bold mb-1">{{ employee.name }}</h5>
                  <p class="text-muted small mb-2">{{ employee.position || 'Position not specified' }}</p>
                </div>
                <div class="text-end">
                  <span :class="['badge', departmentBadge(employee.department)]">
                    {{ employee.department || 'Unknown' }}
                  </span>
                  <div v-if="isOfflineMode" class="mt-1">
                    <small class="text-warning">
                      <i class="bi bi-cloud-off"></i> Offline
                    </small>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-envelope text-muted me-2" style="width: 20px;"></i>
                  <span class="text-truncate">{{ employee.email || employee.contact || 'N/A' }}</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-cash-coin text-muted me-2" style="width: 20px;"></i>
                  <span class="fw-bold" :class="salaryColor(employee.salary)">
                    R{{ formatSalary(employee.salary) }}
                  </span>
                </div>
                <div v-if="employee.days_off !== undefined" class="d-flex align-items-center mb-2">
                  <i class="bi bi-calendar-minus text-muted me-2" style="width: 20px;"></i>
                  <span class="small">{{ employee.days_off || 0 }} days off</span>
                </div>
                <div v-if="employee.recruitment_date" class="d-flex align-items-center">
                  <i class="bi bi-calendar-check text-muted me-2" style="width: 20px;"></i>
                  <span class="small">Joined {{ formatDate(employee.recruitment_date) }}</span>
                </div>
              </div>

              <div class="border-top pt-3">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">ID: {{ employee.employee_id || employee.employeeId || 'N/A' }}</small>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm" 
                      :class="isOfflineMode ? 'btn-outline-warning' : 'btn-outline-primary'" 
                      @click="editEmployee(employee)"
                      :title="isOfflineMode ? 'Edit (offline mode)' : 'Edit'"
                    >
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-secondary">
                      <i class="bi bi-eye"></i> View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredEmployees.length === 0" class="text-center py-5">
        <i class="bi bi-people fs-1 text-muted mb-3"></i>
        <h5 class="text-muted">No employees found</h5>
        <p class="text-muted small" v-if="searchQuery || selectedDepartment">
          Try adjusting your search filters
        </p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Loading employee directory...</p>
        <p class="text-muted small">Attempting to connect to database</p>
      </div>

      <!-- Statistics Card (Only show when not loading) -->
      <div v-if="!loading && employees.length > 0" class="mt-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold mb-3">Department Distribution</h6>
            <div class="row g-3">
              <div v-for="dept in departmentStats" :key="dept.department" class="col-6 col-md-4 col-lg-3">
                <div class="d-flex align-items-center p-2 bg-light rounded">
                  <div class="flex-shrink-0">
                    <div class="rounded-circle p-2" :style="{ backgroundColor: departmentColor(dept.department) }">
                      <i class="bi bi-people text-white"></i>
                    </div>
                  </div>
                  <div class="ms-3">
                    <div class="fw-medium">{{ dept.department }}</div>
                    <small class="text-muted">{{ dept.count }} employee{{ dept.count !== 1 ? 's' : '' }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api';
import EmployeeForm from './EmployeeForm.vue';

export default {
  name: 'Employees',
  components: {
    EmployeeForm
  },

  data() {
    return {
      searchQuery: '',
      selectedDepartment: '',
      employees: [],
      loading: false,
      connectionStatus: null,
      showForm: false,
      selectedEmployee: null,
      dataSource: null,
      isOfflineMode: false,
      showOfflineWarning: true
    }
  },

  computed: {
    uniqueDepartments() {
      const departments = this.employees.map((e) => e.department).filter(Boolean);
      return [...new Set(departments)].sort();
    },

    filteredEmployees() {
      return this.employees.filter((employee) => {
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch =
          (employee.name && employee.name.toLowerCase().includes(searchLower)) ||
          (employee.position && employee.position.toLowerCase().includes(searchLower)) ||
          (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
          (employee.contact && employee.contact.toLowerCase().includes(searchLower));

        const matchesDept =
          this.selectedDepartment === '' ||
          employee.department === this.selectedDepartment;

        return matchesSearch && matchesDept;
      });
    },

    departmentStats() {
      const stats = {};
      this.employees.forEach(employee => {
        if (!employee.department) return;
        if (!stats[employee.department]) {
          stats[employee.department] = {
            department: employee.department,
            count: 0,
            totalSalary: 0
          };
        }
        stats[employee.department].count++;
        stats[employee.department].totalSalary += employee.salary || 0;
      });
      
      return Object.values(stats)
        .map(dept => ({
          ...dept,
          avgSalary: Math.round(dept.totalSalary / dept.count)
        }))
        .sort((a, b) => b.count - a.count);
    },

    dataSourceClass() {
      return this.isOfflineMode ? 'bg-warning text-dark' : 'bg-success text-white';
    }
  },

  async created() {
    await this.loadEmployees();
  },

  methods: {
    // --- FORM LOGIC ---
    addNewEmployee() {
      this.selectedEmployee = null;
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    editEmployee(employee) {
      this.selectedEmployee = { ...employee };
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeForm() {
      this.showForm = false;
      this.selectedEmployee = null;
    },

    async onEmployeeSaved() {
      console.log('Employee saved, refreshing list...');
      this.closeForm();
      
      try {
        await this.loadEmployees();
        this.connectionStatus = {
          class: 'alert-success',
          icon: 'bi-check-circle',
          message: this.isOfflineMode 
            ? 'Employee added to local view (offline mode)' 
            : 'Employee records updated successfully!'
        };
      } catch (error) {
        console.error('Failed to refresh employee list:', error);
        this.connectionStatus = {
          class: 'alert-warning',
          icon: 'bi-exclamation-triangle',
          message: this.isOfflineMode
            ? 'Working offline - changes not saved to database'
            : 'Employee saved but failed to refresh list'
        };
      }
    },

    // --- DATA FETCHING ---
    async loadEmployees() {
      this.loading = true;
      this.isOfflineMode = false;
      this.dataSource = null;
      
      try {
        const response = await apiService.getEmployees();
        console.log('API Response:', response);
        
        // Check if we're using fallback data
        if (response.source === 'fallback_json') {
          this.isOfflineMode = true;
          this.dataSource = 'Offline Data';
          
          if (this.showOfflineWarning) {
            this.connectionStatus = {
              class: 'alert-warning',
              icon: 'bi-database-exclamation',
              message: 'Database connection not available. Showing fallback data from JSON file.'
            };
          }
        } else {
          this.dataSource = 'Live Database';
        }
        
        if (response.success && response.data) {
          this.employees = response.data.map(emp => ({
            // Map different field names to a consistent structure
            employee_id: emp.employee_id || emp.employeeId,
            name: emp.name,
            position: emp.position,
            department: emp.department,
            salary: emp.salary,
            email: emp.email || emp.contact,
            employment_history: emp.employment_history || emp.employmentHistory,
            recruitment_date: emp.recruitment_date,
            days_off: emp.days_off || emp.daysOff || 0
          }));
        } else if (Array.isArray(response)) {
          this.employees = response;
        }
        
      } catch (error) {
        console.error('Error loading employees:', error);
        this.isOfflineMode = true;
        this.dataSource = 'Offline Mode';
        
        this.connectionStatus = {
          class: 'alert-warning',
          icon: 'bi-exclamation-triangle',
          message: `Connection Error: ${error.message}. Using offline data.`
        };
        
        // Try to get fallback data directly
        try {
          const fallbackResponse = await apiService.getFallbackData('/employees');
          if (fallbackResponse.success && fallbackResponse.data) {
            this.employees = fallbackResponse.data;
          }
        } catch (fallbackError) {
          console.error('Fallback data also failed:', fallbackError);
        }
      } finally {
        this.loading = false;
      }
    },

    formatSalary(salary) {
      if (!salary) return '0.00';
      return Number(salary).toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    departmentBadge(dept) {
      const colors = {
        'Development': 'bg-primary',
        'Marketing': 'bg-success',
        'IT': 'bg-info',
        'Finance': 'bg-danger',
        'HR': 'bg-danger',
        'QA': 'bg-warning',
        'Sales': 'bg-purple',
        'Support': 'bg-secondary',
        'Design': 'bg-teal'
      };
      return colors[dept] || 'bg-secondary';
    },

    departmentColor(dept) {
      const colors = {
        'Development': '#0d6efd',
        'Marketing': '#198754',
        'IT': '#0dcaf0',
        'Finance': '#dc3545',
        'HR': '#fd7e14',
        'QA': '#ffc107',
        'Sales': '#6f42c1',
        'Support': '#6c757d',
        'Design': '#20c997'
      };
      return colors[dept] || '#6c757d';
    },

    salaryColor(salary) {
      if (!salary) return 'text-muted';
      if (salary >= 70000) return 'text-success';
      if (salary >= 60000) return 'text-info';
      if (salary >= 50000) return 'text-primary';
      return 'text-danger';
    },

    dismissOfflineWarning() {
      this.showOfflineWarning = false;
      this.connectionStatus = null;
    }
  }
}
</script>

<style scoped>
.employees-page {
  background: #f8f9fa;
  min-height: calc(100vh - 56px);
  padding: 20px;
}

.card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.employee-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.offline-card {
  border-left: 4px solid #ffc107 !important;
  position: relative;
  overflow: hidden;
}

.offline-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    #ffc107 5px,
    #ffc107 10px
  );
}

.badge {
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

.bg-teal {
  background-color: #20c997 !important;
}

.input-group-text {
  border-right: none;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.employee-card:not(.offline-card) {
  border-left: 4px solid #0d6efd;
}

.employee-card .badge {
  font-size: 0.7rem;
}

/* Alert styles */
.alert-success {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0f5132;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffecb5;
  color: #664d03;
}

.alert-info {
  background-color: #cff4fc;
  border-color: #b6effb;
  color: #055160;
}

/* Badge colors */
.bg-primary {
  background-color: #0d6efd !important;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-info {
  background-color: #0dcaf0 !important;
  color: #000 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

.bg-dark {
  background-color: #212529 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .employees-page {
    padding: 15px;
  }

  .card-body {
    padding: 1.25rem !important;
  }
  
  .row-cols-md-2 > * {
    flex: 0 0 auto;
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1200px) {
  .row-cols-md-2 > * {
    flex: 0 0 auto;
    width: 50%;
  }
}

/* Data source badge */
.badge.bg-success {
  background-color: #198754 !important;
}

.badge.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

/* Department indicator circles */
.rounded-circle {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>