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

      <div v-if="connectionStatus" class="alert mb-4 alert-dismissible fade show" :class="connectionStatus.class" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi me-2" :class="connectionStatus.icon"></i>
          <div class="flex-grow-1">{{ connectionStatus.message }}</div>
          <button type="button" class="btn-close" @click="connectionStatus = null"></button>
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
          <div class="card employee-card h-100 border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="fw-bold mb-1">{{ employee.name }}</h5>
                  <p class="text-muted small mb-2">{{ employee.position || 'Position not specified' }}</p>
                </div>
                <span :class="['badge', departmentBadge(employee.department)]">
                  {{ employee.department || 'Unknown' }}
                </span>
              </div>

              <div class="mb-4">
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-envelope text-muted me-2" style="width: 20px;"></i>
                  <span class="text-truncate">{{ employee.email || 'N/A' }}</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-cash-coin text-muted me-2" style="width: 20px;"></i>
                  <span class="fw-bold" :class="salaryColor(employee.salary)">
                    R{{ formatSalary(employee.salary) }}
                  </span>
                </div>
              </div>

              <div class="border-top pt-3">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">ID: {{ employee.employee_id || employee.employeeId || 'N/A' }}</small>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="editEmployee(employee)">
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
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Refreshing employee directory...</p>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api';
import EmployeeForm from './EmployeeForm.vue'; // Make sure the file name matches exactly

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
      selectedEmployee: null
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
          (employee.email && employee.email.toLowerCase().includes(searchLower));

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
    // --- FORM LOGIC ---
    addNewEmployee() {
      this.selectedEmployee = null; // Blank form for new entry
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    editEmployee(employee) {
      this.selectedEmployee = { ...employee }; // Pass existing data
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeForm() {
      this.showForm = false;
      this.selectedEmployee = null;
    },

    async onEmployeeSaved() {
      this.closeForm();
      await this.loadEmployees(); // Reload list to show changes
      this.connectionStatus = {
        class: 'alert-success',
        icon: 'bi-check-circle',
        message: 'Employee records updated successfully!'
      };
    },

    // --- DATA FETCHING ---
    async loadEmployees() {
      this.loading = true;
      try {
        const response = await apiService.getEmployees();
        if (response.success && response.data) {
          this.employees = response.data;
        } else if (Array.isArray(response)) {
          this.employees = response;
        }
      } catch (error) {
        this.connectionStatus = {
          class: 'alert-warning',
          icon: 'bi-exclamation-triangle',
          message: `Connection Error: ${error.message}`
        };
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

    departmentBadge(dept) {
      const colors = {
        'Development': 'bg-primary',
        'Marketing': 'bg-success',
        'IT': 'bg-info',
        'Finance': 'bg-danger',
        'HR': 'bg-danger',
      };
      return colors[dept] || 'bg-secondary';
    },

    salaryColor(salary) {
      if (!salary) return 'text-muted';
      return salary >= 60000 ? 'text-success' : 'text-danger';
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

.badge {
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.input-group-text {
  border-right: none;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.employee-card {
  border-left: 4px solid #0d6efd;
}

.employee-card .badge {
  font-size: 0.7rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .employees-page {
    padding: 15px;
  }

  .card-body {
    padding: 1.25rem !important;
  }
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
</style>
