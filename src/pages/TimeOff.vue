<template>
  <div class="container py-4">
    <h2>Time Off Management Dashboard</h2>
    <p class="lead">Manage employee leave requests and balances in real-time.</p>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Fetching data from HR Database...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <strong>Error:</strong> {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchData">Retry</button>
    </div>

    <div v-else class="row">
      <div class="col-lg-5 mb-4">
        <div class="card bg-light">
          <div class="card-header fw-bold">Current Employee Leave Balances</div>
          <ul class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto">
            <li class="list-group-item" v-for="balance in leaveBalances" :key="balance.employeeId">
              <span class="fw-bold">{{ balance.name }}</span>
              <div class="row small mt-1">
                <div class="col-6">Annual: <span class="badge bg-success">{{ balance.annualBalance }} days</span></div>
                <div class="col-6">Sick: <span class="badge bg-warning text-dark">{{ balance.sickBalance }} days</span></div>
                <div class="col-6">Family: <span class="badge bg-info">{{ balance.familyBalance }} days</span></div>
                <div class="col-6">Unpaid: <span class="badge bg-secondary">Tracked</span></div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-lg-7 mb-4">
        <div class="card">
          <div class="card-header bg-warning fw-bold text-white">
            Pending Time Off Requests ({{ pendingRequests.length }})
          </div>
          <div class="table-responsive">
            <table class="table table-sm mb-0 align-middle">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Days</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in pendingRequests" :key="request.id">
                  <td>{{ request.name }}</td>
                  <td><span class="badge bg-primary">{{ request.typeOfLeave }}</span></td>
                  <td>{{ calculateDays(request.startDate, request.endDate) }}</td>
                  <td>
                    <button class="btn btn-sm btn-success me-2" @click="updateRequestStatus(request.id, 'Approved')">Approve</button>
                    <button class="btn btn-sm btn-danger" @click="updateRequestStatus(request.id, 'Denied')">Deny</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!pendingRequests.length" class="p-3 text-muted text-center">No pending requests.</p>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4">
        <div class="card">
          <div class="card-header bg-success fw-bold text-white">Leave Status History</div>
          <div class="table-responsive">
            <table class="table table-sm mb-0 align-middle">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="req in processedRequests" :key="req.id">
                  <td>{{ req.name }}</td>
                  <td><span class="badge bg-primary">{{ req.typeOfLeave }}</span></td>
                  <td>{{ req.startDate }} → {{ req.endDate }}</td>
                  <td>
                    <span :class="req.status === 'Approved' ? 'badge bg-success' : 'badge bg-danger'">
                      {{ req.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4">
        <h4 class="text-secondary">Simulate New Database Entry</h4>
        <button class="btn btn-primary me-2" @click="submitMockRequest('Annual', 3, 1)">Submit Sibongile's Annual Leave</button>
        <button class="btn btn-info" @click="submitMockRequest('Sick', 1, 2)">Submit Lungile's Sick Leave</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeOff',
  data() {
    return {
      loading: true, // Starts as true
      error: null,
      leaveBalances: [],
      timeOffRequests: [],
      // Matches your backend route
      apiBase: 'http://localhost:5000/api'
    }
  },
  computed: {
    pendingRequests() {
      return this.timeOffRequests.filter(req => req.status === 'Pending');
    },
    processedRequests() {
      return this.timeOffRequests.filter(req => req.status !== 'Pending');
    }
  },
  // This triggers as soon as the page is ready
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${this.apiBase}/timeoff`);
        if (!response.ok) throw new Error('Failed to fetch from server');

        const data = await response.json();

        // 1. Map Leave Requests (Snake Case to Camel Case)
        this.timeOffRequests = data.requests.map(r => ({
          id: r.leave_id,
          employeeId: r.employee_id,
          name: r.name,
          startDate: this.formatDate(r.start_date),
          endDate: this.formatDate(r.end_date),
          typeOfLeave: r.leave_type,
          status: r.status
        }));

        // 2. Map Balances
        this.leaveBalances = data.balances.map(b => ({
          employeeId: b.employee_id,
          name: b.name,
          annualBalance: b.annual_leave,
          sickBalance: b.sick_leave,
          familyBalance: b.family_leave
        }));

      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false; // Stop the spinner
      }
    },

    async updateRequestStatus(id, status) {
      try {
        const response = await fetch(`${this.apiBase}/timeoff/requests/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });

        if (response.ok) {
          // IMPORTANT: Re-fetch data.
          // This ensures we see the balance deduction processed by your SQL Trigger!
          await this.fetchData();
        }
      } catch (err) {
        alert("Action failed: " + err.message);
      }
    },

    async submitMockRequest(type, days, empId) {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + days);

      const payload = {
        employee_id: empId,
        leave_type: type,
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        reason: "Simulated Request"
      };

      try {
        await fetch(`${this.apiBase}/timeoff/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        await this.fetchData();
      } catch (err) {
        console.error(err);
      }
    },

    formatDate(dateStr) {
      return new Date(dateStr).toISOString().split('T')[0];
    },

    calculateDays(start, end) {
      const diff = new Date(end) - new Date(start);
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
  }
}
</script>

<style scoped>
/* ------------------------ */
/* Main container and page */
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
}

/* Page header */
h2 {
  color: #ffffff;
  margin-bottom: 10px;
}

p.lead {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
}

/* Glassy card style */
.card {
  background: rgba(24, 40, 72, 0.5);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(75, 108, 183, 0.7);
  transition: 0.3s ease;
  color: #fff;
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

.card:hover {
  background: rgba(75, 108, 183, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

/* Card headers */
.card-header {
  background: rgba(24, 40, 72, 0.7) !important;
  backdrop-filter: blur(12px);
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid rgba(75, 108, 183, 0.7);
}

/* Card containing the leave balances */
.card.bg-light {
  background: rgba(24, 40, 72, 0.5) !important;
  border: 1px solid rgba(75, 108, 183, 0.7);
  color: #fff !important;
  backdrop-filter: blur(15px);
}

/* Card header of leave balances */
.card.bg-light .card-header {
  background: rgba(24, 40, 72, 0.7) !important;
  color: #fff;
  border-bottom: 1px solid rgba(75, 108, 183, 0.7);
  backdrop-filter: blur(12px);
}

.list-group-item {
  background: rgba(24, 40, 72, 0.4) !important;
  color: #fff !important;
  border: none;
  margin-bottom: 6px;
  border-radius: 12px;
  padding: 12px 16px;
  transition:
    background 0.25s ease,
    transform 0.25s ease;
  backdrop-filter: blur(12px);
}

.list-group-item:hover {
  background: rgba(75, 108, 183, 0.6) !important;
  transform: translateX(3px);
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(24, 40, 72, 0.4);
  color: #fff;
  border-radius: 15px;
  overflow: hidden;
}

.table tbody,
.table tbody tr,
.table tbody tr td {
  background: transparent !important;
}

.table th,
.table td {
  padding: 10px 12px;
  vertical-align: middle;
}

.table th {
  background: rgba(75, 108, 183, 0.6);
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid rgba(75, 108, 183, 0.7);
}

.table td {
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(75, 108, 183, 0.3);
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(24, 40, 72, 0.3) !important;
}

.table-responsive {
  border-radius: 15px;
  overflow: hidden;
}

.btn-sm {
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 10px;
  transition: 0.25s ease;
}

.btn-success {
  background: #4caf50;
  border: none;
}
.btn-danger {
  background: #e57373;
  border: none;
}
.btn-success:hover {
  background: #3e8e41;
}
.btn-danger:hover {
  background: #c94f4f;
}

/* Badges inside leave balances */
.badge {
  border-radius: 10px;
  padding: 4px 10px;
  font-size: 13px;
}

/* Success / Warning / Info badge colors */
.badge.bg-success {
  background-color: #4caf50 !important;
}
.badge.bg-warning {
  background-color: #ffb74d !important;
  color: #000 !important;
}
.badge.bg-info {
  background-color: #00bcd4 !important;
}

/* Buttons outside tables */
.btn {
  border-radius: 12px;
  transition: 0.25s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: #6c63ff;
  border: none;
}
.btn-primary:hover {
  background: #5548c8;
}
.btn-info {
  background: #00bcd4;
  border: none;
}
.btn-dark {
  background: #333;
  border: none;
}
.btn-outline-danger {
  border-color: #e57373;
  color: #e57373;
}
.btn-outline-danger:hover {
  background: #e57373;
  color: #fff;
}

/* Scrollbar styling */
.list-group::-webkit-scrollbar {
  width: 8px;
}

.list-group::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.list-group::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .row > .col-lg-5,
  .row > .col-lg-7 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .table th,
  .table td {
    padding: 8px;
  }
}
</style>
