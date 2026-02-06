<template>
  <div class="timeoff">
    <div class="container-fluid">
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <h1 class="h2 fw-bold mb-2">Time Off Management</h1>
          <p class="text-muted mb-0">Manage employee leave requests and balances in real-time</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <span class="badge bg-success">
              <i class="bi bi-calendar-check me-1"></i> Live Database
            </span>
            <button @click="fetchData" class="btn btn-outline-primary btn-sm" :disabled="loading">
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
          <p class="mt-3 text-muted">Synchronizing with HR database...</p>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger alert-dismissible fade show">
        <div class="d-flex align-items-start">
          <i class="bi bi-exclamation-triangle me-3 fs-4 flex-shrink-0"></i>
          <div class="flex-grow-1">
            <h5 class="alert-heading mb-2">Connection Error</h5>
            <p class="mb-3">{{ error }}</p>
            <div>
              <button @click="fetchData" class="btn btn-primary btn-sm">Retry Connection</button>
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
                    <i class="bi bi-clock-history text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Pending Requests</h6>
                    <h3 class="fw-bold mb-0 text-primary">{{ pendingCount }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Awaiting approval</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                    <i class="bi bi-check-circle text-success fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Approved This Month</h6>
                    <h3 class="fw-bold mb-0 text-success">{{ approvedCount }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Leave days approved</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                    <i class="bi bi-calendar-week text-warning fs-4"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Total Leave Days</h6>
                    <h3 class="fw-bold mb-0 text-warning">{{ totalLeaveDays }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">All types combined</p>
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
                    <h6 class="text-muted mb-0 small">Employees on Leave</h6>
                    <h3 class="fw-bold mb-0 text-info">{{ onLeaveCount }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Currently absent</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-bottom">
            <h5 class="mb-0">
              <i class="bi bi-lightning text-primary me-2"></i>Quick Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="row align-items-end">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-uppercase">Select Leave Type</label>
                <select v-model="selectedBulkType" class="form-select">
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Family">Family Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div class="col-md-3">
                <button @click="submitBulkLeave" class="btn btn-primary w-100" :disabled="loading">
                  <i class="bi bi-send-plus me-2"></i> Submit for All
                </button>
              </div>
              <div class="col-md-5 text-md-end">
                <div class="text-muted small">
                  <i class="bi bi-info-circle me-1"></i>
                  This will add pending leave for all employees
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-clock-history text-primary me-2"></i>Pending Requests
                  <span class="badge bg-primary ms-2">{{ temporaryRequests.length }}</span>
                </h5>
                <button @click="clearAllPending" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash me-1"></i> Clear All
                </button>
              </div>
              <div class="card-body">
                <div v-if="temporaryRequests.length > 0" class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Duration</th>
                        <th>Dates</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="request in temporaryRequests" :key="request.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                                 style="width: 40px; height: 40px;">
                              {{ getInitials(request.name) }}
                            </div>
                            <div>
                              <div class="fw-bold">{{ request.name }}</div>
                              <small class="text-muted">ID: {{ request.employeeId }}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge" :class="getLeaveTypeClass(request.typeOfLeave)">
                            {{ request.typeOfLeave }}
                          </span>
                        </td>
                        <td>
                          <span class="fw-medium">{{ calculateDays(request.startDate, request.endDate) }} days</span>
                        </td>
                        <td>
                          <small>{{ formatDate(request.startDate) }} → {{ formatDate(request.endDate) }}</small>
                        </td>
                        <td>
                          <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-success" @click="approveRequest(request)">
                              <i class="bi bi-check-lg"></i> Approve
                            </button>
                            <button class="btn btn-sm btn-danger" @click="denyRequest(request)">
                              <i class="bi bi-x-lg"></i> Deny
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="text-center py-5">
                  <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
                  <h5 class="text-muted mb-2">No pending requests</h5>
                  <p class="text-muted mb-0">All requests have been processed</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-wallet2 text-primary me-2"></i>Leave Balances Overview
                </h5>
              </div>
              <div class="card-body" style="max-height: 400px; overflow-y: auto">
                <div class="list-group list-group-flush">
                  <div v-for="balance in leaveBalances.slice(0, 8)" :key="balance.employeeId"
                       class="list-group-item border-0 px-0 py-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div class="fw-bold">{{ balance.name }}</div>
                        <small class="text-muted">ID: {{ balance.employeeId }}</small>
                      </div>
                      <span class="badge bg-light text-dark">{{ getTotalBalance(balance) }} days</span>
                    </div>
                    <div class="row g-2">
                      <div class="col-6">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle bg-success bg-opacity-10 p-1 me-2">
                            <i class="bi bi-sun text-success" style="font-size: 0.8rem;"></i>
                          </div>
                          <span class="small">Annual: <strong>{{ balance.annualBalance }}</strong></span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle bg-warning bg-opacity-10 p-1 me-2">
                            <i class="bi bi-heart-pulse text-warning" style="font-size: 0.8rem;"></i>
                          </div>
                          <span class="small">Sick: <strong>{{ balance.sickBalance }}</strong></span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle bg-info bg-opacity-10 p-1 me-2">
                            <i class="bi bi-people text-info" style="font-size: 0.8rem;"></i>
                          </div>
                          <span class="small">Family: <strong>{{ balance.familyBalance }}</strong></span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle bg-secondary bg-opacity-10 p-1 me-2">
                            <i class="bi bi-calendar-x text-secondary" style="font-size: 0.8rem;"></i>
                          </div>
                          <span class="small">Unpaid: <strong>∞</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="leaveBalances.length > 8" class="text-center pt-3 border-top">
                  <small class="text-muted">+{{ leaveBalances.length - 8 }} more employees</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-clock-history text-primary me-2"></i>Leave History
                </h5>
                <select v-model="historyFilter" class="form-select form-select-sm" style="width: auto;">
                  <option value="">All History</option>
                  <option value="Approved">Approved</option>
                  <option value="Denied">Denied</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Dates</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="req in filteredHistory" :key="req.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                                 style="width: 40px; height: 40px;">
                              {{ getInitials(req.name) }}
                            </div>
                            <div>
                              <div class="fw-bold">{{ req.name }}</div>
                              <small class="text-muted">ID: {{ req.employeeId }}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge" :class="getLeaveTypeClass(req.typeOfLeave)">
                            {{ req.typeOfLeave }}
                          </span>
                        </td>
                        <td>{{ calculateDays(req.startDate, req.endDate) }} days</td>
                        <td>
                          <span :class="{
                            'badge bg-success': req.status === 'Approved',
                            'badge bg-danger': req.status === 'Denied' || req.status === 'Rejected',
                            'badge bg-warning text-dark': req.status === 'Pending'
                          }">
                            {{ req.status }}
                          </span>
                        </td>
                        <td>
                          <small>{{ formatDate(req.startDate) }} → {{ formatDate(req.endDate) }}</small>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" @click="deleteRecord(req.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="filteredHistory.length === 0" class="text-center py-5">
                    <i class="bi bi-calendar3 fs-1 text-muted mb-3"></i>
                    <h5 class="text-muted mb-2">No leave history found</h5>
                    <p class="text-muted mb-0">Try adjusting your filter criteria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-calendar-check text-primary me-2"></i>Recent Attendance
                </h5>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div v-for="group in attendanceGroups.slice(0, 5)" :key="group.name"
                       class="list-group-item border-0 px-0 py-3">
                    <div class="d-flex align-items-center mb-3">
                      <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                           style="width: 40px; height: 40px;">
                        {{ getInitials(group.name) }}
                      </div>
                      <div>
                        <div class="fw-bold">{{ group.name }}</div>
                        <small class="text-muted">{{ group.records.length }} records</small>
                      </div>
                    </div>
                    <div class="row g-2">
                      <div v-for="log in group.records.slice(0, 3)" :key="log.date" class="col-12">
                        <div class="d-flex justify-content-between align-items-center py-2 px-3 bg-light rounded">
                          <small>{{ formatDate(log.date) }}</small>
                          <span :class="log.status === 'Present' ? 'badge bg-success' : 'badge bg-danger'">
                            {{ log.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="attendanceGroups.length > 5" class="text-center pt-3 border-top">
                  <small class="text-muted">+{{ attendanceGroups.length - 5 }} more employees</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              <i class="bi bi-database me-1"></i> Connected to MySQL database |
              Showing {{ filteredHistory.length }} historical records
            </div>
            <button @click="fetchData" class="btn btn-link text-decoration-none">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh Data
            </button>
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
      temporaryRequests: [],
      attendanceGroups: [],
      apiBase: 'http://localhost:5000/api',
      selectedBulkType: 'Annual',
      historyFilter: ''
    }
  },
  computed: {
    processedRequests() {
      // FIX: Showing all items from the DB in history so we can see updated statuses
      return this.timeOffRequests;
    },
    filteredHistory() {
      if (!this.historyFilter) return this.processedRequests;
      return this.processedRequests.filter(req => req.status === this.historyFilter);
    },
    pendingCount() {
      return this.temporaryRequests.length;
    },
    approvedCount() {
      return this.processedRequests.filter(req => req.status === 'Approved').length;
    },
    totalLeaveDays() {
      return this.processedRequests.reduce((total, req) => {
        if (req.status === 'Approved') {
          return total + this.calculateDays(req.startDate, req.endDate);
        }
        return total;
      }, 0);
    },
    onLeaveCount() {
      const today = new Date().toISOString().split('T')[0];
      return this.processedRequests.filter(req => {
        return req.status === 'Approved' &&
               req.startDate <= today &&
               req.endDate >= today;
      }).length;
    }
  },
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

        this.timeOffRequests = data.requests.map(r => ({
          id: r.leave_id,
          employeeId: r.employee_id,
          name: r.employee_name,
          startDate: this.formatDate(r.start_date),
          endDate: this.formatDate(r.end_date),
          typeOfLeave: r.leave_type,
          status: r.status // Will now show Approved/Denied correctly
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

    submitBulkLeave() {
      const type = this.selectedBulkType;
      const today = new Date().toISOString().split('T')[0];
      const selectedEmployees = this.leaveBalances
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const newBatch = selectedEmployees.map(employee => ({
        id: 'temp-' + Date.now() + Math.random(),
        employeeId: employee.employeeId,
        name: employee.name,
        startDate: today,
        endDate: today,
        typeOfLeave: type
      }));

      this.temporaryRequests = [...this.temporaryRequests, ...newBatch];
    },

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
            reason: "Dashboard Approval",
            status: 'Approved' // EXPLICITLY SETTING STATUS
          })
        });

        if (response.ok) {
          this.temporaryRequests = this.temporaryRequests.filter(t => t.id !== req.id);
          await this.fetchData(); // REFRESH UI FROM DB
        }
      } catch (err) {
        alert("Action failed: " + err.message);
      }
    },

    async denyRequest(req) {
      try {
        const response = await fetch(`${this.apiBase}/timeoff/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: req.employeeId,
            leave_type: req.typeOfLeave,
            start_date: req.startDate,
            end_date: req.endDate,
            reason: "Dashboard Denial",
            status: 'Denied' // EXPLICITLY SETTING STATUS
          })
        });

        if (response.ok) {
          this.temporaryRequests = this.temporaryRequests.filter(t => t.id !== req.id);
          await this.fetchData(); // REFRESH UI FROM DB
        }
      } catch (err) {
        alert("Action failed: " + err.message);
      }
    },

    discardRequest(id) {
      this.temporaryRequests = this.temporaryRequests.filter(req => req.id !== id);
    },

    async clearAllPending() {
      if (!confirm("Clear all pending requests?")) return;
      this.temporaryRequests = [];
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

    getLeaveTypeClass(type) {
      const classes = {
        'Annual': 'bg-success',
        'Sick': 'bg-warning text-dark',
        'Family': 'bg-info',
        'Unpaid': 'bg-secondary'
      };
      return classes[type] || 'bg-light text-dark';
    },

    getTotalBalance(balance) {
      return balance.annualBalance + balance.sickBalance + balance.familyBalance;
    }
  }
}
</script>

<style scoped>
.timeoff {
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

.bg-light {
  background-color: #f8f9fa !important;
  color: #212529 !important;
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

/* Alert styles */
.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

/* List group custom */
.list-group-item {
  background: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeoff {
    padding: 15px;
  }

  .card-body {
    padding: 1rem !important;
  }

  .table th,
  .table td {
    padding: 0.5rem;
  }
}

/* Scrollbar styling */
.card-body::-webkit-scrollbar {
  width: 6px;
}

.card-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.card-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
