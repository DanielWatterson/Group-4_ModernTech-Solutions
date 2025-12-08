<template>
  <div class="container py-4">
    <h2>Payroll Processing Dashboard</h2>
    <p class="lead">
      This interface demonstrates the automation of payroll calculations by centralizing employee and payroll data.
      This fulfills the requirement for **automated payroll calculations** and **digital payslip generation**.
    </p>

    <button class="btn btn-success mb-3 me-3" @click="runPayrollSimulation" :disabled="allCalculated">
      <i class="bi bi-calculator-fill"></i> Run Payroll Simulation (Calculate Net Pay)
    </button>
    <button class="btn btn-outline-secondary mb-3" @click="resetPayroll">
      Reset Payroll Data
    </button>
    
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
              <span :class="{'fw-bold text-success': employee.isCalculated}">
                {{ employee.isCalculated ? `R${employee.netPay.toLocaleString('en-ZA', {minimumFractionDigits: 2})}` : '—' }}
              </span>
            </td>
            <td>
              <button 
                class="btn btn-sm" 
                :class="employee.isCalculated ? 'btn-info' : 'btn-outline-secondary'" 
                :disabled="!employee.isCalculated" 
                @click="viewPayslip(employee)">
                <i class="bi bi-file-earmark-text"></i> View Payslip
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPayslipModal" class="modal-backdrop">
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Digital Payslip: {{ selectedPayslip.name }}</h5>
              <button type="button" class="btn-close btn-close-white" @click="showPayslipModal = false"></button>
            </div>
            <div class="modal-body" v-if="selectedPayslip">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Employee ID:</strong> {{ selectedPayslip.employeeId }}</p>
                  <p><strong>Position:</strong> {{ selectedPayslip.position }}</p>
                </div>
                <div class="col-md-6 text-end">
                  <p><strong>Monthly Salary (Gross Base):</strong> R{{ selectedPayslip.salary.toLocaleString('en-ZA') }}</p>
                  <p><strong>Gross Pay (Before Tax):</strong> R{{ selectedPayslip.grossPayAfterLeave.toLocaleString('en-ZA', {minimumFractionDigits: 2}) }}</p>
                </div>
              </div>
              <hr>
              <h6>Deductions:</h6>
              <ul class="list-unstyled">
                <li>Taxes ({{ (taxRate * 100).toFixed(0) }}%): 
                  <span class="float-end text-danger">R{{ selectedPayslip.taxes.toLocaleString('en-ZA', {minimumFractionDigits: 2}) }}</span></li>
                <li>Leave Deductions ({{ selectedPayslip.leaveDeductions }} days):
                  <span class="float-end text-danger">R{{ selectedPayslip.leaveCost.toLocaleString('en-ZA', {minimumFractionDigits: 2}) }}</span></li>
              </ul>
              <hr>
              <h4 class="text-success text-center">Net Pay: R{{ selectedPayslip.netPay.toLocaleString('en-ZA', {minimumFractionDigits: 2}) }}</h4>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showPayslipModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// NOTE: These imports assume your environment (like Vite/Webpack) handles importing JSON files as modules.
// Update the path: e.g., '@/data/employee_info.json'
import employeeInfoJSON from '@/data/employee_info.json'; 
import payrollDataJSON from '@/data/payroll_data.json'; 

const AVERAGE_WORKING_DAYS_MONTH = 22; 

export default {
  name: "Payroll",
  data() {
    return {
      // The initial data is created by merging the imported JSON data
      initialData: this.mergePayrollData(), 
      employeesWithPayData: [],
      showPayslipModal: false,
      selectedPayslip: null,
      taxRate: 0.25, 
    };
  },
  computed: {
    allCalculated() {
      return this.employeesWithPayData.every(emp => emp.isCalculated);
    }
  },
  created() {
    this.employeesWithPayData = JSON.parse(JSON.stringify(this.initialData));
  },
  methods: {
    /**
     * Centralizes data from employee_info and payroll_data.
     */
    mergePayrollData() {
      // Use the employeeInformation array from the imported JSON
      const employeeMap = employeeInfoJSON.employeeInformation.reduce((map, emp) => {
        map[emp.employeeId] = emp;
        return map;
      }, {});
      
      // Use the payrollData array from the imported JSON
      return payrollDataJSON.payrollData.map(payrollItem => {
        const info = employeeMap[payrollItem.employeeId];
        const dailyRate = info.salary / AVERAGE_WORKING_DAYS_MONTH; 

        return {
          ...info, 
          ...payrollItem, 
          dailyRate: dailyRate,
          isCalculated: false,
          grossPayAfterLeave: 0,
          taxes: 0,
          leaveCost: 0,
          netPay: 0,
        };
      });
    },

    /**
     * Simulates the automated payroll calculation process.
     */
    runPayrollSimulation() {
      this.employeesWithPayData = this.employeesWithPayData.map(emp => {
        const monthlySalary = emp.salary;
        const dailyRate = emp.dailyRate; 
        
        const leaveCost = dailyRate * emp.leaveDeductions;
        const grossPayAfterLeave = monthlySalary - leaveCost;
        const taxes = grossPayAfterLeave * this.taxRate;
        const netPay = grossPayAfterLeave - taxes;

        return {
          ...emp,
          grossPayAfterLeave: grossPayAfterLeave,
          taxes: taxes,
          leaveCost: leaveCost,
          netPay: netPay,
          isCalculated: true,
        };
      });
      alert('Payroll calculation simulated successfully! Net Pay fields are now updated.');
    },
    
    viewPayslip(employee) {
      if (employee.isCalculated) {
        this.selectedPayslip = employee;
        this.showPayslipModal = true;
      }
    },
    
    resetPayroll() {
      this.employeesWithPayData = JSON.parse(JSON.stringify(this.initialData));
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>