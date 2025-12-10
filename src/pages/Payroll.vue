<template>
  <div class="container py-4">
    <h2>Payroll Processing Dashboard</h2>
    <p class="lead">
      This interface demonstrates the automation of payroll calculations by centralizing employee
      and payroll data. This fulfills the requirement for **automated payroll calculations** and
      **digital payslip generation**.
    </p>

    <!-- Top buttons wrapper -->
    <div class="top-buttons">
      <button class="btn btn-success" @click="runPayrollSimulation" :disabled="allCalculated">
        <i class="bi bi-calculator-fill"></i> Run Payroll Simulation
      </button>
      <button class="btn btn-outline-secondary" @click="resetPayroll">Reset Payroll Data</button>
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
            <th>Leave Days Deduction</th>
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
            <td>{{ employee.hoursWorked || 0 }}</td>
            <td>{{ employee.leaveDeductions || 0 }}</td>
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
                :class="employee.isCalculated ? 'btn-info' : 'btn-outline-secondary'"
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

    <!-- Payslip Modal -->
    <div v-if="showPayslipModal" class="modal-backdrop">
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Digital Payslip: {{ selectedPayslip.name }}</h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="showPayslipModal = false"
              ></button>
            </div>
            <div class="modal-body" v-if="selectedPayslip">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Employee ID:</strong> {{ selectedPayslip.employeeId }}</p>
                  <p><strong>Position:</strong> {{ selectedPayslip.position }}</p>
                </div>
                <div class="col-md-6 text-end">
                  <p>
                    <strong>Monthly Salary (Gross Base):</strong> R{{
                      selectedPayslip.salary.toLocaleString('en-ZA')
                    }}
                  </p>
                  <p>
                    <strong>Gross Pay (Before Tax):</strong> R{{
                      selectedPayslip.grossPayAfterLeave.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </p>
                </div>
              </div>
              <hr />
              <h6>Deductions:</h6>
              <ul class="list-unstyled">
                <li>
                  Taxes ({{ (taxRate * 100).toFixed(0) }}%):
                  <span class="float-end text-danger"
                    >R{{
                      selectedPayslip.taxes.toLocaleString('en-ZA', { minimumFractionDigits: 2 })
                    }}</span
                  >
                </li>
                <li>
                  Leave Deductions ({{ selectedPayslip.leaveDeductions }} days):
                  <span class="float-end text-danger"
                    >R{{
                      selectedPayslip.leaveCost.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                      })
                    }}</span
                  >
                </li>
              </ul>
              <hr />
              <h4 class="text-success text-center">
                Net Pay: R{{
                  selectedPayslip.netPay.toLocaleString('en-ZA', { minimumFractionDigits: 2 })
                }}
              </h4>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showPayslipModal = false">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import employeeInfoJSON from '@/data/employee_info.json'
import payrollDataJSON from '@/data/payroll_data.json'

const AVERAGE_WORKING_DAYS_MONTH = 22

export default {
  name: 'Payroll',
  data() {
    return {
      initialData: this.mergePayrollData(),
      employeesWithPayData: [],
      showPayslipModal: false,
      selectedPayslip: null,
      taxRate: 0.25,
    }
  },
  computed: {
    allCalculated() {
      return this.employeesWithPayData.every((emp) => emp.isCalculated)
    },
  },
  created() {
    this.employeesWithPayData = JSON.parse(JSON.stringify(this.initialData))
  },
  methods: {
    mergePayrollData() {
      const employeeMap = employeeInfoJSON.employeeInformation.reduce((map, emp) => {
        map[emp.employeeId] = emp
        return map
      }, {})

      return payrollDataJSON.payrollData.map((payrollItem) => {
        const info = employeeMap[payrollItem.employeeId]
        const dailyRate = info.salary / AVERAGE_WORKING_DAYS_MONTH

        return {
          ...info,
          ...payrollItem,
          dailyRate: dailyRate,
          isCalculated: false,
          grossPayAfterLeave: 0,
          taxes: 0,
          leaveCost: 0,
          netPay: 0,
        }
      })
    },
    runPayrollSimulation() {
      this.employeesWithPayData = this.employeesWithPayData.map((emp) => {
        const monthlySalary = emp.salary
        const dailyRate = emp.dailyRate
        const leaveCost = dailyRate * emp.leaveDeductions
        const grossPayAfterLeave = monthlySalary - leaveCost
        const taxes = grossPayAfterLeave * this.taxRate
        const netPay = grossPayAfterLeave - taxes

        return {
          ...emp,
          grossPayAfterLeave: grossPayAfterLeave,
          taxes: taxes,
          leaveCost: leaveCost,
          netPay: netPay,
          isCalculated: true,
        }
      })
      alert('Payroll calculation simulated successfully! Net Pay fields are now updated.')
    },
    viewPayslip(employee) {
      if (employee.isCalculated) {
        this.selectedPayslip = employee
        this.showPayslipModal = true
      }
    },
    resetPayroll() {
      this.employeesWithPayData = JSON.parse(JSON.stringify(this.initialData))
    },
  },
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
