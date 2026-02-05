<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 mb-0">Time Off Management</h2>
      <button
        @click="fetchData"
        class="btn btn-outline-secondary d-flex align-items-center"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-arrow-clockwise me-2"></i>
        Refresh Data
      </button>
    </div>
    <p class="lead">Manage employee leave requests and balances in real-time.</p>

    <div class="card border-primary mb-4 shadow-sm">
      <div class="card-header bg-primary text-white fw-bold">Global Time-Off Entry</div>
      <div class="card-body">
        <div class="row align-items-end">
          <div class="col-md-5">
            <label class="form-label small fw-bold text-uppercase">Select Leave Type</label>
            <select v-model="selectedBulkType" class="form-select">
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Family">Family Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>
          <div class="col-md-4">
            <button @click="submitBulkLeave" class="btn btn-primary w-100" :disabled="loading">
              <i class="bi bi-send-plus me-2"></i> Submit for All Employees
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && !timeOffRequests.length" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Synchronizing with HR Database...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <strong>Error:</strong> {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchData">Retry</button>
    </div>

    <div v-else class="row">
      <div class="col-lg-5 mb-4">
        <div class="card bg-light h-100">
          <div class="card-header fw-bold">Current Employee Leave Balances</div>
          <ul class="list-group list-group-flush" style="max-height: 500px; overflow-y: auto">
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
        <div class="card h-100">
          <div class="card-header bg-warning fw-bold text-white">
            Pending Time Off Requests ({{ temporaryRequests.length }})
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
                <tr v-for="request in temporaryRequests" :key="request.id">
                  <td>{{ request.name }}</td>
                  <td><span class="badge bg-primary">{{ request.typeOfLeave }}</span></td>
                  <td>{{ calculateDays(request.startDate, request.endDate) }}</td>
                  <td>
                    <button class="btn btn-sm btn-success me-2" @click="approveRequest(request)">Approve</button>
                    <button class="btn btn-sm btn-danger" @click="discardRequest(request.id)">Deny</button>
                  </td>
                </tr>
                <tr v-if="!temporaryRequests.length">
                  <td colspan="4" class="p-4 text-muted text-center italic">No pending requests found. (Refresh to clear)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4">
        <div class="card shadow-sm">
          <div class="card-header bg-success fw-bold text-white">Leave Status History</div>
          <div class="table-responsive">
            <table class="table table-sm mb-0 align-middle table-hover">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="req in processedRequests" :key="req.id">
                  <td>{{ req.name }}</td>
                  <td>{{ req.typeOfLeave }}</td>
                  <td>{{ req.startDate }} → {{ req.endDate }}</td>
                  <td>
                    <span :class="req.status === 'Approved' ? 'badge bg-success' : 'badge bg-danger'">{{ req.status }}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteRecord(req.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4">
        <div class="card shadow-sm">
          <div class="card-header bg-info fw-bold text-white">Employee Attendance Logs</div>
          <div class="card-body">
            <div class="row">
              <div v-for="group in attendanceGroups" :key="group.name" class="col-md-4 mb-3">
                <div class="border rounded p-3 bg-white shadow-xs">
                  <h6 class="fw-bold border-bottom pb-2 mb-2 text-dark">{{ group.name }}</h6>
                  <div v-for="log in group.records" :key="log.date" class="d-flex justify-content-between small py-1">
                    <span>{{ formatDate(log.date) }}</span>
                    <span :class="log.status === 'Present' ? 'text-success fw-bold' : 'text-danger fw-bold'">
                      {{ log.status }}
                    </span>
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
export default {
  name: 'TimeOff',
  data() {
    return {
      loading: true,
      error: null,
      leaveBalances: [],
      timeOffRequests: [],
      temporaryRequests: [], // New staging list
      attendanceGroups: [],
      apiBase: 'http://localhost:5000/api',
      selectedBulkType: 'Annual'
    }
  },
  computed: {
    // Only processed items coming from the DB history
    processedRequests() {
      return this.timeOffRequests.filter(req => req.status !== 'Pending');
    }
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      this.temporaryRequests = []; // Clears the new requests dashboard on refresh

      try {
        const response = await fetch(`${this.apiBase}/timeoff`);
        if (!response.ok) throw new Error('Failed to fetch from server');
        const data = await response.json();

        this.timeOffRequests = data.requests.map(r => ({
          id: r.leave_id,
          employeeId: r.employee_id,
          name: r.employee_name,
          startDate: this.formatDate(r.start_date),
          endDate: this.formatDate(r.end_date),
          typeOfLeave: r.leave_type,
          status: r.status
        }));

        this.leaveBalances = data.balances.map(b => ({
          employeeId: b.employee_id,
          name: b.employee_name,
          annualBalance: b.annual_leave,
          sickBalance: b.sick_leave,
          familyBalance: b.family_leave
        }));

        if (data.attendance) {
          const groups = {};
          data.attendance.forEach(record => {
            if (!groups[record.employee_id]) {
              groups[record.employee_id] = { name: record.employee_name, records: [] };
            }
            groups[record.employee_id].records.push({
              date: record.date,
              status: record.status
            });
          });
          this.attendanceGroups = Object.values(groups);
        }

      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // New: Simply adds to the UI list. Does NOT touch the database.
    submitBulkLeave() {
      const type = this.selectedBulkType;
      const today = new Date().toISOString().split('T')[0];

      const newBatch = this.leaveBalances.map(employee => ({
        id: 'temp-' + Date.now() + Math.random(),
        employeeId: employee.employeeId,
        name: employee.name,
        startDate: today,
        endDate: today,
        typeOfLeave: type
      }));

      this.temporaryRequests = [...this.temporaryRequests, ...newBatch];
    },

    // New: This actually inserts the record into the database when approved
    async approveRequest(req) {
      try {
        const response = await fetch(`${this.apiBase}/timeoff/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: req.employeeId,
            leave_type: req.typeOfLeave,
            start_date: req.startDate,
            end_date: req.endDate,
            reason: "Confirmed from dashboard",
            status: 'Approved'
          })
        });

        if (response.ok) {
          // Remove from the temporary UI list and update DB data
          this.temporaryRequests = this.temporaryRequests.filter(t => t.id !== req.id);
          await this.fetchData();
        }
      } catch (err) {
        alert("Action failed: " + err.message);
      }
    },

    // New: Just removes the item from your screen
    discardRequest(id) {
      this.temporaryRequests = this.temporaryRequests.filter(req => req.id !== id);
    },

    async deleteRecord(id) {
      if (!confirm("Delete this history record?")) return;
      try {
        const response = await fetch(`${this.apiBase}/timeoff/requests/${id}`, { method: 'DELETE' });
        if (response.ok) await this.fetchData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
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
