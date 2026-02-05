<template>
  <div class="container py-4">
    <h2>Payroll Processing Dashboard</h2>
    <p class="lead">
      This interface demonstrates the automation of payroll calculations by centralizing employee
      and payroll data. This fulfills the requirement for **automated payroll calculations** and
      **digital payslip generation**.
    </p>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-white">Fetching Payroll Records from Database...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <div>
        <strong>Error:</strong> {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchPayrollData">Retry</button>
      </div>
    </div>

    <div v-else>
      <div class="top-buttons">
        <button class="btn btn-success" @click="runPayrollSimulation" :disabled="allCalculated">
          <i class="bi bi-calculator-fill me-1"></i>
          {{ allCalculated ? 'Payroll Fully Processed' : 'Run Payroll Simulation' }}
        </button>
        <button class="btn btn-outline-light" @click="resetPayroll">
          <i class="bi bi-arrow-clockwise me-1"></i> Reset All Payroll Data
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Monthly Salary</th>
              <th>Hours Worked</th>
              <th>Leave Days</th>
              <th class="text-end">Net Pay (Calculated)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employeesWithPayData" :key="employee.employeeId">
              <td>{{ employee.employeeId }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>R{{ employee.salary.toLocaleString('en-ZA') }}</td>
              <td>{{ employee.hoursWorked }}</td>
              <td>{{ employee.leaveDeductions }}</td>
              <td class="text-end">
                <span :class="{ 'fw-bold text-success': employee.isCalculated }">
                  {{
                    employee.isCalculated
                      ? `R${employee.netPay.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
                      : '—'
                  }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm"
                  :class="employee.isCalculated ? 'btn-info text-white' : 'btn-outline-secondary text-white'"
                  :disabled="!employee.isCalculated"
                  @click="viewPayslip(employee)"
                >
                  <i class="bi bi-file-earmark-text"></i> View Payslip
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showPayslipModal" class="modal-backdrop d-flex align-items-center justify-content-center">
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content text-dark bg-white">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Digital Payslip: {{ selectedPayslip.name }}</h5>
              <button type="button" class="btn-close btn-close-white" @click="showPayslipModal = false"></button>
            </div>
            <div class="modal-body" v-if="selectedPayslip">
              <div class="row mb-4">
                <div class="col-6">
                  <p><strong>Employee ID:</strong> #{{ selectedPayslip.employeeId }}</p>
                  <p><strong>Position:</strong> {{ selectedPayslip.position }}</p>
                </div>
                <div class="col-6 text-end">
                  <p><strong>Base Salary:</strong> R{{ selectedPayslip.salary.toLocaleString('en-ZA') }}</p>
                  <p><strong>Calculated Gross:</strong> R{{ selectedPayslip.grossPayAfterLeave.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}</p>
                </div>
              </div>
              <hr />
              <h6>Deductions:</h6>
              <ul class="list-group list-group-flush mb-4">
                <li class="list-group-item d-flex justify-content-between">
                  Income Tax ({{ (taxRate * 100).toFixed(0) }}%)
                  <span class="text-danger">-R{{ selectedPayslip.taxes.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  Leave Deductions ({{ selectedPayslip.leaveDeductions }} days)
                  <span class="text-danger">-R{{ selectedPayslip.leaveCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}</span>
                </li>
              </ul>
              <div class="bg-light p-3 rounded">
                <h4 class="text-success text-center mb-0">
                  NET TAKE-HOME PAY: R{{ selectedPayslip.netPay.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}
                </h4>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-primary" @click="window.print()"><i class="bi bi-printer"></i> Print</button>
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
      apiBase: 'http://localhost:5000/api/payroll'
    }
  },
  computed: {
    allCalculated() {
      return this.employeesWithPayData.length > 0 &&
            this.employeesWithPayData.every((emp) => emp.isCalculated)
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
          salary: parseFloat(emp.salary) || 0,
          hoursWorked: emp.hours_worked || 160,
          leaveDeductions: emp.leave_deductions || 0,
          grossPayAfterLeave: parseFloat(emp.gross_pay) || 0,
          taxes: parseFloat(emp.tax_deductions) || 0,
          netPay: parseFloat(emp.net_pay) || 0,
          isCalculated: emp.net_pay !== null && parseFloat(emp.net_pay) > 0,
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
  async resetPayroll() {
  if (!confirm("Are you sure you want to delete ALL processed payroll data? This cannot be undone.")) {
    return;
  }

  try {
    const response = await fetch(`${this.apiBase}/reset`, {
      method: 'POST'
    });

    if (response.ok) {
      await this.fetchPayrollData(); // This refreshes the table to show '—'
      alert("Payroll data reset successfully. You can now run the simulation again.");
    } else {
      throw new Error('Failed to reset payroll data.');
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}
}
}

</script>

<style scoped>
.container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;
  background:
    linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)),
    url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop')
      center/cover no-repeat;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: fadeIn 0.8s ease-out;
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

h2 {
  color: #ffffff;
  font-weight: 700;
}

p.lead {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.5rem;
}

.top-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.top-buttons .btn {
  font-size: 0.85rem;
  padding: 6px 14px;
  border-radius: 12px;
  min-width: auto;
  transition: 0.25s ease;
}

.top-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.table-responsive {
  backdrop-filter: blur(15px);
  background: rgba(24, 40, 72, 0.5);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  padding: 10px;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: transparent !important;
  color: #fff;
}

.table th,
.table td {
  vertical-align: middle;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transition: background 0.25s ease;
}

.table th {
  background: rgba(75, 108, 183, 0.6) !important;
  font-weight: 600;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.03);
}

.table-hover tbody tr:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateX(2px);
  transition: 0.25s ease;
}

/* ---------------- Modal styling ---------------- */
.modal-dialog {
  margin: 80px auto;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 20px;
  backdrop-filter: blur(15px);
  background: rgba(24, 40, 72, 0.5);
  color: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.modal-header,
.modal-footer {
  border: none;
}

/* Deduction list in modal */
ul.list-unstyled li {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
}

/* Text highlights */
.fw-bold.text-success {
  color: #28a745 !important;
}

/* Responsive adjustments  */
@media (max-width: 768px) {
  .table th,
  .table td {
    font-size: 0.85rem;
    padding: 0.45rem 0.6rem;
  }

  .btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
