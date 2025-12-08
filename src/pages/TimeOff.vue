<template>
  <div class="container py-4">
    <h2 class="mb-4 text-warning">🌴 Time Off Management</h2>
    <p class="lead">Efficiently manage time off requests and track employee balances.</p>

    <div class="row">
      
      <div class="col-lg-5 mb-4">
        <div class="card bg-light">
          <div class="card-header fw-bold">Current Leave Balances (Simulated)</div>
          <ul class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto;">
            <li class="list-group-item d-flex justify-content-between align-items-center"
                v-for="balance in leaveBalances" :key="balance.employeeId">
              {{ balance.name }}
              <span class="badge bg-secondary">
                {{ balance.vacationBalance }} days
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-lg-7 mb-4">
        <div class="card">
          <div class="card-header bg-warning text-white fw-bold">
            Pending Time Off Requests ({{ pendingRequests.length }})
          </div>
          <div class="table-responsive">
            <table class="table table-sm mb-0 align-middle">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in timeOffRequests.filter(r => r.status === 'Pending')" :key="request.id">
                  <td>{{ request.name }}</td>
                  <td>{{ request.startDate }} to {{ request.endDate }}</td>
                  <td>{{ calculateDays(request.startDate, request.endDate) }}</td>
                  <td><span class="badge bg-danger">{{ request.status }}</span></td>
                  <td>
                    <button class="btn btn-sm btn-success me-2" @click="approveRequest(request)">Approve</button>
                    <button class="btn btn-sm btn-danger" @click="denyRequest(request)">Deny</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!pendingRequests.length" class="p-3 text-muted text-center">No pending requests.</p>
          </div>
        </div>
      </div>
      
      <div class="col-12 mt-3">
        <h4 class="text-secondary">Simulate New Request Submission</h4>
        <p>Use this to demonstrate adding a request and seeing it appear in the Pending list.</p>
        <button class="btn btn-primary" @click="submitMockRequest">
          <i class="bi bi-send-fill"></i> Submit Mock Request for Karabo Dlamini
        </button>
        <button class="btn btn-outline-danger ms-3" @click="resetRequests">Reset Requests</button>
      </div>
      
    </div>
  </div>
</template>

<script>
// IMPORTANT: Replace with actual path in your project structure
import employeeInfoJSON from '@/data/employee_info.json'; 

// Mock Data for initial Time Off Balances and Requests
const mockLeaveBalances = employeeInfoJSON.employeeInformation.map(emp => ({
  employeeId: emp.employeeId,
  name: emp.name,
  vacationBalance: 15, // Initial balance for all employees
}));

let nextRequestId = 101; 

export default {
  name: 'TimeOff',
  data() {
    return {
      leaveBalances: mockLeaveBalances,
      timeOffRequests: [
        { 
          id: 100, employeeId: 1, name: "Sibongile Nkosi", 
          startDate: "2025-12-24", endDate: "2025-12-26", 
          type: "Vacation", status: "Pending" 
        },
      ],
    };
  },
  computed: {
    pendingRequests() {
      return this.timeOffRequests.filter(req => req.status === 'Pending');
    }
  },
  methods: {
    calculateDays(start, end) {
      // Simple day difference calculation for PoC, including start and end days
      const startMs = new Date(start).getTime();
      const endMs = new Date(end).getTime();
      const diffDays = Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24));
      return diffDays + 1; 
    },

    submitMockRequest() {
        const employeeToUse = employeeInfoJSON.employeeInformation[8]; // Karabo Dlamini
        const newRequest = {
            id: nextRequestId++,
            employeeId: employeeToUse.employeeId, 
            name: employeeToUse.name, 
            startDate: `2026-02-10`, 
            endDate: `2026-02-12`, 
            type: "Vacation", 
            status: "Pending"
        };
        this.timeOffRequests.push(newRequest);
        alert(`New request submitted by ${employeeToUse.name} and added to the Pending list.`);
    },

    approveRequest(request) {
      // 1. Calculate days
      const daysRequested = this.calculateDays(request.startDate, request.endDate);
      
      // 2. Find and update the balance (AUTOMATIC TRACKING)
      const balanceItem = this.leaveBalances.find(e => e.employeeId === request.employeeId);
      if (balanceItem && balanceItem.vacationBalance >= daysRequested) {
        balanceItem.vacationBalance -= daysRequested;
        // 3. Update request status (HR ACTION)
        request.status = 'Approved';
        alert(`Request for ${request.name} approved! Balance updated: -${daysRequested} days. Attendance records implicitly updated.`);
      } else {
         alert(`Error: ${request.name} only has ${balanceItem.vacationBalance} days left.`);
      }
    },

    denyRequest(request) {
      // Update request status without touching the balance
      request.status = 'Denied';
      alert(`Request for ${request.name} denied. Balance remains unchanged.`);
    },
    
    resetRequests() {
      this.timeOffRequests = [
        { 
          id: 100, employeeId: 1, name: "Sibongile Nkosi", 
          startDate: "2025-12-24", endDate: "2025-12-26", 
          type: "Vacation", status: "Pending" 
        },
      ];
      this.leaveBalances = JSON.parse(JSON.stringify(mockLeaveBalances));
      alert('Time Off requests and balances have been reset.');
    }
  }
}
</script>

<style scoped>
/* Same modal style as Payroll.vue */
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