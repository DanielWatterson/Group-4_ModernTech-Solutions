<template>
  <div class="container py-4">
    <h2>Time Off Management Dashboard</h2>
    <p class="lead">
      This page allows HR staff to manage time off requests across multiple leave categories and
      tracks employee attendance performance.
    </p>

    <div class="row">
      <div class="col-lg-5 mb-4">
        <div class="card bg-light">
          <div class="card-header fw-bold">Current Employee Leave Balances</div>
          <ul class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto">
            <li class="list-group-item" v-for="balance in leaveBalances" :key="balance.employeeId">
              <span class="fw-bold">{{ balance.name }}</span>
              <div class="row small mt-1">
                <div class="col-6">
                  Annual: <span class="badge bg-success">{{ balance.annualBalance }} days</span>
                </div>
                <div class="col-6">
                  Sick:
                  <span class="badge bg-warning text-dark">{{ balance.sickBalance }} days</span>
                </div>
                <div class="col-6">
                  Family: <span class="badge bg-info">{{ balance.familyBalance }} days</span>
                </div>
                <div class="col-6">Unpaid: <span class="badge bg-secondary">Tracked</span></div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-lg-7 mb-4">
        <div class="card">
          <div class="card-header bg-warning fw-bold" style="color: white">
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
                  <td>
                    <span class="badge bg-primary">{{ request.typeOfLeave }}</span>
                  </td>
                  <td>{{ calculateDays(request.startDate, request.endDate) }}</td>
                  <td>
                    <button class="btn btn-sm btn-success me-2" @click="approveRequest(request)">
                      Approve
                    </button>
                    <button class="btn btn-sm btn-danger" @click="denyRequest(request)">
                      Deny
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!pendingRequests.length" class="p-3 text-muted text-center">
              No pending requests.
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4">
  <div class="card">
    <div class="card-header bg-success fw-bold" style="color: white">
      Leave Status Dashboard
    </div>

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
          <tr 
            v-for="req in timeOffRequests.filter(r => r.status !== 'Pending')" 
            :key="req.id"
          >
            <td>{{ req.name }}</td>

            <td>
              <span class="badge bg-primary">{{ req.typeOfLeave }}</span>
            </td>

            <td>
              {{ req.startDate }} → {{ req.endDate }}
            </td>

            <td>
              <span 
                :class="{
                  'badge bg-success': req.status === 'Approved',
                  'badge bg-danger': req.status === 'Denied'
                }"
              >
                {{ req.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p 
        v-if="!timeOffRequests.some(t => t.status === 'Approved' || t.status === 'Denied')" 
        class="p-3 text-muted text-center"
      >
        No approved or denied requests yet.
      </p>
    </div>
  </div>
</div>

      <div class="col-12 mt-3 mb-4">
        <div class="card">
          <div class="card-header bg-secondary text-white fw-bold">
            Weekly Attendance Performance (Simulated Data)
          </div>
          <div class="table-responsive">
            <table class="table table-striped table-sm mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Week</th>
                  <th>Days Present</th>
                  <th>Days Late</th>
                  <th>Performance Note</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="attendance in mockWeeklyAttendance" :key="attendance.employeeId">
                  <td>{{ getEmployeeName(attendance.employeeId) }}</td>
                  <td>{{ attendance.week }}</td>
                  <td>{{ attendance.daysPresent }} / 5</td>
                  <td>{{ attendance.daysLate }}</td>
                  <td>
                    <span
                      :class="{
                        'badge bg-success': attendance.performance === 'Excellent',
                        'badge bg-warning text-dark': attendance.performance === 'Good',
                      }"
                      >{{ attendance.performance }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 mt-3">
        <h4 class="text-secondary">Simulate New Request Submission (Employee Facing)</h4>
        <p>
          Click below to simulate an employee submitting a request for different types of leave.
        </p>
        <button class="btn btn-primary me-2 mb-2" @click="submitMockRequest('Annual Leave', 3, 4)">
          Submit Annual Leave
        </button>
        <button class="btn btn-info me-2 mb-2" @click="submitMockRequest('Sick Leave', 1, 3)">
          Submit Sick Leave
        </button>
        <button class="btn btn-dark me-2 mb-2" @click="submitMockRequest('Unpaid Leave', 5, 4)">
          Submit Unpaid Leave
        </button>

        <button class="btn btn-outline-danger ms-3 mb-2" @click="resetRequests">
          Reset Requests & Balances
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import employeeInfoJSON from '@/data/employee_info.json'
import payrollDataJSON from '@/data/payroll_data.json'

let nextRequestId = 101

export default {
  name: 'TimeOff',
  data() {
    // --- Data initialization based on imported files
    const initialLeaveBalances = employeeInfoJSON.employeeInformation.map((emp) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      annualBalance: 15,
      sickBalance: 10,
      familyBalance: 5,
      unpaidBalance: 999,
    }))

    // Initial Requests: A single starting request to populate the table
    const initialRequests = [
      {
        id: 100,
        employeeId: 1,
        name: 'Sibongile Nkosi',
        startDate: '2026-03-01',
        endDate: '2026-03-05',
        typeOfLeave: 'Annual Leave',
        status: 'Pending',
      },
    ]

    // Mock Weekly Attendance: Derived from imported employee data
    const initialAttendance = employeeInfoJSON.employeeInformation
      .slice(0, 7)
      .map((emp, index) => ({
        employeeId: emp.employeeId,
        week: 'Dec Week 1',
        daysPresent: 5 - (index % 3),
        daysLate: index % 3 > 0 ? 1 : 0,
        performance: index % 3 === 0 ? 'Excellent' : 'Good',
      }))

    return {
      initialLeaveBalances: initialLeaveBalances, // Store for reset
      initialRequests: initialRequests,

      leaveBalances: JSON.parse(JSON.stringify(initialLeaveBalances)),
      mockWeeklyAttendance: initialAttendance,
      timeOffRequests: JSON.parse(JSON.stringify(initialRequests)),

      leaveTypeMap: {
        'Annual Leave': 'annualBalance',
        'Sick Leave': 'sickBalance',
        'Family Leave': 'familyBalance',
        'Unpaid Leave': 'unpaidBalance',
      },
    }
  },
  computed: {
    pendingRequests() {
      return this.timeOffRequests.filter((req) => req.status === 'Pending')
    },
  },
  methods: {
    getEmployeeName(employeeId) {
      const emp = employeeInfoJSON.employeeInformation.find((e) => e.employeeId === employeeId)
      return emp ? emp.name : 'Unknown'
    },

    calculateDays(start, end) {
      const startMs = new Date(start).getTime()
      const endMs = new Date(end).getTime()
      const diffDays = Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24))
      return diffDays + 1
    },

    submitMockRequest(type, days, employeeIndex) {
      // Select employee from the imported list
      const employeeToUse = employeeInfoJSON.employeeInformation[employeeIndex || 4]

      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 7)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + days - 1)

      const newRequest = {
        id: nextRequestId++,
        employeeId: employeeToUse.employeeId,
        name: employeeToUse.name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        typeOfLeave: type,
        status: 'Pending',
      }
      this.timeOffRequests.push(newRequest)
      alert(`New ${type} request submitted by ${employeeToUse.name} and added to the Pending list.`)
    },

    approveRequest(request) {
      const daysRequested = this.calculateDays(request.startDate, request.endDate)
      const balanceKey = this.leaveTypeMap[request.typeOfLeave]
      const balanceItem = this.leaveBalances.find((e) => e.employeeId === request.employeeId)

      if (balanceItem && balanceKey) {
        if (request.typeOfLeave === 'Unpaid Leave' || balanceItem[balanceKey] >= daysRequested) {
          if (request.typeOfLeave !== 'Unpaid Leave') {
            balanceItem[balanceKey] -= daysRequested
          }

          request.status = 'Approved'
          alert(
            `Request for ${request.name} (${request.typeOfLeave}) approved! Balance updated: -${daysRequested} days.`,
          )
        } else {
          alert(
            `Error: ${request.name} only has ${balanceItem[balanceKey]} days of ${request.typeOfLeave} left.`,
          )
        }
      }
    },

    denyRequest(request) {
      request.status = 'Denied'
      alert(`Request for ${request.name} denied. Balance remains unchanged.`)
    },

    resetRequests() {
      // Reset working arrays back to their initial states
      this.timeOffRequests = JSON.parse(JSON.stringify(this.initialRequests))
      this.leaveBalances = JSON.parse(JSON.stringify(this.initialLeaveBalances))
      alert('Time Off requests and balances have been reset.')
    },
  },
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
