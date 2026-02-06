<template>
  <div class="payroll">
    <div class="container-fluid">
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <h1 class="h2 fw-bold mb-2">Payroll Management</h1>
          <p class="text-muted mb-0">Automated payroll calculations and digital payslip generation</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <span class="badge bg-success">
              <i class="bi bi-cash-coin me-1"></i> Live Database
            </span>
            <button @click="fetchPayrollData" class="btn btn-outline-primary btn-sm" :disabled="loading">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="card border-0 shadow-sm">
        <div class="card-body text-center py-5">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Fetching payroll data from database...</p>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger alert-dismissible fade show">
        <div class="d-flex align-items-start">
          <i class="bi bi-exclamation-triangle me-3 fs-4 flex-shrink-0"></i>
          <div class="flex-grow-1">
            <h5 class="alert-heading mb-2">Connection Error</h5>
            <p class="mb-3">{{ error }}</p>
            <div>
              <button @click="fetchPayrollData" class="btn btn-primary btn-sm">Retry Connection</button>
            </div>
          </div>
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>
      </div>

      <div v-else>
        <div class="row g-3 mb-4">
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <i class="bi bi-calculator text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Processed Payroll</h6>
                    <h3 class="fw-bold mb-0 text-primary">{{ processedCount }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Completed calculations</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                    <i class="bi bi-cash-stack text-success fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Total Payroll</h6>
                    <h3 class="fw-bold mb-0 text-success">R{{ totalPayroll.toLocaleString('en-ZA') }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Monthly payout</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 p-2 me-3">
                    <i class="bi bi-people text-info fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Pending</h6>
                    <h3 class="fw-bold mb-0 text-info">{{ pendingCount }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Awaiting processing</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                    <i class="bi bi-clock-history text-warning fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Avg Tax</h6>
                    <h3 class="fw-bold mb-0 text-warning">{{ avgTax }}%</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Average deduction</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-bottom">
            <h5 class="mb-0">
              <i class="bi bi-lightning text-primary me-2"></i>Payroll Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex gap-3">
              <button
                class="btn btn-primary d-flex align-items-center gap-2"
                @click="runPayrollSimulation"
                :disabled="allCalculated"
              >
                <i class="bi bi-calculator-fill"></i>
                {{ allCalculated ? 'Payroll Fully Processed' : 'Run Payroll Simulation' }}
              </button>
              <button
                class="btn btn-outline-secondary d-flex align-items-center gap-2"
                @click="resetPayroll"
              >
                <i class="bi bi-arrow-clockwise"></i> Reset Payroll Data
              </button>
              <button
                class="btn btn-outline-success d-flex align-items-center gap-2 ms-auto"
                @click="exportToExcel"
              >
                <i class="bi bi-file-earmark-excel"></i> Export to Excel
              </button>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-table text-primary me-2"></i>Employee Payroll Data
            </h5>
            <div class="d-flex gap-2">
              <input
                type="text"
                v-model="searchQuery"
                class="form-control form-control-sm"
                placeholder="Search employees..."
                style="width: 200px;"
              />
              <select v-model="selectedDepartment" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Monthly Salary</th>
                    <th>Hours Worked</th>
                    <th>Leave Days</th>
                    <th class="text-end">Net Pay</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="employee in filteredEmployees" :key="employee.employeeId">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                             style="width: 40px; height: 40px;">
                          {{ getInitials(employee.name) }}
                        </div>
                        <div>
                          <div class="fw-bold">{{ employee.name }}</div>
                          <small class="text-muted">ID: {{ employee.employeeId }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge" :class="getDepartmentClass(employee.department)">
                        {{ employee.department }}
                      </span>
                    </td>
                    <td>{{ employee.position }}</td>
                    <td class="fw-bold">R{{ employee.salary.toLocaleString('en-ZA') }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <span>{{ employee.hoursWorked }}</span>
                        <div class="progress ms-2 flex-grow-1" style="height: 6px; width: 60px;">
                          <div
                            class="progress-bar bg-success"
                            :style="{ width: Math.min((employee.hoursWorked / 160) * 100, 100) + '%' }"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span :class="employee.leaveDeductions > 2 ? 'text-danger fw-bold' : 'text-warning'">
                        {{ employee.leaveDeductions }} days
                      </span>
                    </td>
                    <td class="text-end">
                      <div :class="{ 'fw-bold text-success': employee.isCalculated }">
                        <template v-if="employee.isCalculated">
                          R{{ employee.netPay.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                        </template>
                        <template v-else>
                          <span class="text-muted fst-italic">Pending</span>
                        </template>
                      </div>
                      <small v-if="employee.isCalculated" class="text-muted d-block">
                        Tax: R{{ employee.taxes.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                      </small>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        :disabled="!employee.isCalculated"
                        @click="viewPayslip(employee)"
                      >
                        <i class="bi bi-file-earmark-text me-1"></i>Payslip
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="filteredEmployees.length === 0" class="text-center py-5">
                <i class="bi bi-cash fs-1 text-muted mb-3"></i>
                <h5 class="text-muted mb-2">No payroll data found</h5>
                <p class="text-muted mb-0">Try adjusting your search criteria or run payroll simulation</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              <i class="bi bi-database me-1"></i> Connected to MySQL database |
              Showing {{ filteredEmployees.length }} of {{ employeesWithPayData.length }} records
            </div>
            <button @click="fetchPayrollData" class="btn btn-link text-decoration-none">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPayslipModal" class="modal-backdrop fade show d-flex align-items-center justify-content-center">
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Digital Payslip: {{ selectedPayslip.name }}</h5>
              <button type="button" class="btn-close btn-close-white" @click="showPayslipModal = false"></button>
            </div>
            <div class="modal-body" v-if="selectedPayslip">
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-3">Employee Details</h6>
                      <p class="mb-2">
                        <strong>Employee ID:</strong> #{{ selectedPayslip.employeeId }}
                      </p>
                      <p class="mb-2">
                        <strong>Position:</strong> {{ selectedPayslip.position }}
                      </p>
                      <p class="mb-2">
                        <strong>Department:</strong>
                        <span class="badge" :class="getDepartmentClass(selectedPayslip.department)">
                          {{ selectedPayslip.department }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-3">Salary Details</h6>
                      <p class="mb-2">
                        <strong>Base Salary:</strong> R{{ selectedPayslip.salary.toLocaleString('en-ZA') }}
                      </p>
                      <p class="mb-2">
                        <strong>Gross Pay:</strong> R{{ selectedPayslip.grossPayAfterLeave.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                      </p>
                      <p class="mb-0">
                        <strong>Hours Worked:</strong> {{ selectedPayslip.hoursWorked }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card border-0 bg-light mb-4">
                <div class="card-body">
                  <h6 class="text-muted mb-3">Deductions Breakdown</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="d-flex justify-content-between mb-2">
                        <span>Income Tax ({{ (taxRate * 100).toFixed(0) }}%)</span>
                        <span class="text-danger fw-bold">
                          -R{{ selectedPayslip.taxes.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                        </span>
                      </div>
                      <div class="d-flex justify-content-between mb-3">
                        <span>Leave Deductions ({{ selectedPayslip.leaveDeductions }} days)</span>
                        <span class="text-danger fw-bold">
                          -R{{ selectedPayslip.leaveCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                        </span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="bg-white p-3 rounded text-center">
                        <small class="text-muted d-block">NET TAKE-HOME PAY</small>
                        <h3 class="text-success fw-bold mb-0">
                          R{{ selectedPayslip.netPay.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                This payslip has been digitally generated and requires no physical signature.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-primary d-flex align-items-center gap-2" @click="printPayslip">
                <i class="bi bi-printer"></i> Print
              </button>
              <button type="button" class="btn btn-secondary" @click="showPayslipModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Payroll',
  data() {
    return {
      loading: true,
      error: null,
      employeesWithPayData: [],
      showPayslipModal: false,
      selectedPayslip: null,
      taxRate: 0.25,
      apiBase: 'http://localhost:5000/api/payroll',
      searchQuery: '',
      selectedDepartment: '',
    }
  },
  computed: {
    allCalculated() {
      return this.employeesWithPayData.length > 0 &&
             this.employeesWithPayData.every(emp => emp.isCalculated)
    },
    processedCount() {
      return this.employeesWithPayData.filter(emp => emp.isCalculated).length
    },
    pendingCount() {
      return this.employeesWithPayData.filter(emp => !emp.isCalculated).length
    },
    totalPayroll() {
      return this.employeesWithPayData.reduce((sum, emp) => sum + (emp.netPay || 0), 0)
    },
    avgTax() {
      const calculated = this.employeesWithPayData.filter(emp => emp.isCalculated)
      if (calculated.length === 0) return 0
      const avg = calculated.reduce((sum, emp) => {
        const taxPercent = (emp.taxes / emp.salary) * 100
        return sum + taxPercent
      }, 0) / calculated.length
      return avg.toFixed(1)
    },
    departments() {
      const depts = [...new Set(this.employeesWithPayData.map(emp => emp.department))]
      return depts.filter(Boolean).sort()
    },
    filteredEmployees() {
      return this.employeesWithPayData.filter(emp => {
        const matchesSearch = this.searchQuery === '' ||
          emp.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesDept = this.selectedDepartment === '' ||
          emp.department === this.selectedDepartment
        return matchesSearch && matchesDept
      })
    }
  },
  async mounted() {
    await this.fetchPayrollData();
  },
  methods: {
    async fetchPayrollData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(this.apiBase);
        if (!response.ok) throw new Error('Could not connect to Payroll API');
        const data = await response.json();

        this.employeesWithPayData = data.map(emp => ({
          employeeId: emp.employee_id,
          name: emp.name,
          position: emp.position,
          department: emp.department || 'Unknown',
          salary: parseFloat(emp.salary) || 0,
          hoursWorked: emp.hours_worked || 160,
          leaveDeductions: emp.leave_deductions || 0,
          grossPayAfterLeave: parseFloat(emp.gross_pay) || 0,
          taxes: parseFloat(emp.tax_deductions) || 0,
          netPay: parseFloat(emp.net_pay) || 0,
          isCalculated: emp.net_pay !== null,
          leaveCost: (parseFloat(emp.salary) / 22) * (emp.leave_deductions || 0)
        }));
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async runPayrollSimulation() {
      try {
        const response = await fetch(`${this.apiBase}/calculate-all`, { method: 'POST' });
        const result = await response.json();
        if (response.ok) {
          await this.fetchPayrollData();
          alert('Success: ' + result.message);
        } else {
          throw new Error(result.error || 'Server failed to process calculations');
        }
      } catch (err) {
        alert("Action failed: " + err.message);
      }
    },

    viewPayslip(employee) {
      this.selectedPayslip = employee;
      this.showPayslipModal = true;
    },

    printPayslip() {
      window.print();
    },

    async resetPayroll() {
      if (!confirm("Are you sure you want to delete ALL processed payroll data? This cannot be undone.")) {
        return;
      }

      try {
        const response = await fetch(`${this.apiBase}/reset`, {
          method: 'POST'
        });

        if (response.ok) {
          await this.fetchPayrollData();
          alert("Payroll data reset successfully. You can now run the simulation again.");
        } else {
          throw new Error('Failed to reset payroll data.');
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    },

    exportToExcel() {
      alert('Excel export feature coming soon!');
    },

    getInitials(name) {
      if (!name) return '??';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    getDepartmentClass(department) {
      const classes = {
        'Development': 'bg-primary',
        'Marketing': 'bg-success',
        'IT': 'bg-info',
        'Design': 'bg-warning',
        'Finance': 'bg-danger',
        'Support': 'bg-secondary',
        'Sales': 'bg-dark',
        'QA': 'bg-primary',
        'HR': 'bg-success'
      };
      return classes[department] || 'bg-light text-dark';
    }
  }
}
</script>

<style scoped>
.payroll {
  background: #f8f9fa;
  min-height: calc(100vh - 56px);
  padding: 20px;
}

.card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.badge {
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.progress {
  background-color: #e9ecef;
  border-radius: 4px;
}

.progress-bar {
  border-radius: 4px;
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

/* Icon background colors */
.bg-primary.bg-opacity-10 {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-success.bg-opacity-10 {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-info.bg-opacity-10 {
  background-color: rgba(13, 202, 240, 0.1) !important;
}

.bg-warning.bg-opacity-10 {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

/* Text colors */
.text-primary {
  color: #0d6efd !important;
}

.text-success {
  color: #198754 !important;
}

.text-info {
  color: #0dcaf0 !important;
}

.text-warning {
  color: #ffc107 !important;
}

/* Modal backdrop */
.modal-backdrop {
  background-color: #000000; 
  z-index: 1050;
}

.modal-content {
  border-radius: 12px;
}

.modal-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Alert styles */
.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .payroll {
    padding: 15px;
  }

  .card-body {
    padding: 1rem !important;
  }

  .modal-dialog {
    margin: 1rem;
  }
}

/* FIX MODAL TRANSPARENCY - ADDED FIX */
.modal-content,
.modal-content .bg-light,
.modal-content .alert-info {
  background-color: #ffffff !important;
}

.modal-content .card.bg-light {
  background-color: #f8f9fa !important;
}

.modal-content .alert-info {
  background-color: #d1ecf1 !important;
}

.modal-backdrop {
  background-color: #ffffff !important;
  opacity: 1 !important;
}
</style>