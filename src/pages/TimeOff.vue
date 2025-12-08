<template>
  <div class="container py-4">
    <h2>Time Off Management Dashboard</h2>
    <p class="lead">
      This page allows HR staff to manage time off requests across multiple leave categories and tracks employee attendance performance.
    </p>

    <div class="row">
      
      <div class="col-lg-5 mb-4">
        <div class="card bg-light">
          <div class="card-header fw-bold">Current Employee Leave Balances</div>
          <ul class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto;">
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
          <div class="card-header bg-warning text-dark fw-bold">
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
                  <td><span :class="{'badge bg-success': attendance.performance === 'Excellent', 'badge bg-warning text-dark': attendance.performance === 'Good'}">{{ attendance.performance }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 mt-3">
        <h4 class="text-secondary">Simulate New Request Submission (Employee Facing)</h4>
        <p>Click below to simulate an employee submitting a request for different types of leave.</p>
        <button class="btn btn-primary me-2 mb-2" @click="submitMockRequest('Annual Leave', 3, 4)">Submit Annual Leave</button>
        <button class="btn btn-info me-2 mb-2" @click="submitMockRequest('Sick Leave', 1, 3)">Submit Sick Leave</button>
        <button class="btn btn-dark me-2 mb-2" @click="submitMockRequest('Unpaid Leave', 5, 4)">Submit Unpaid Leave</button>
        
        <button class="btn btn-outline-danger ms-3 mb-2" @click="resetRequests">Reset Requests & Balances</button>
      </div>
      
    </div>
  </div>
</template>

<script>
import employeeInfoJSON from '@/data/employee_info.json'; 
// NOTE: We assume mock_attendance.json and initial_requests.json would be imported if they existed
// import mockAttendanceJSON from '@/data/mock_attendance.json'; 

let nextRequestId = 101; 

export default {
    name: 'TimeOff',
    data() {
        // --- Data initialization based on imported files ---
        
        // 1. Initial Leave Balances: Derived from the imported employee list (employeeInfoJSON)
        const initialLeaveBalances = employeeInfoJSON.employeeInformation.map(emp => ({
            employeeId: emp.employeeId,
            name: emp.name,
            annualBalance: 15,
            sickBalance: 10,
            familyBalance: 5,
            unpaidBalance: 999,
        }));
        
        // 2. Initial Requests: A single starting request to populate the table
        const initialRequests = [
            { 
                id: 100, employeeId: 1, name: "Sibongile Nkosi", 
                startDate: "2026-03-01", endDate: "2026-03-05", 
                typeOfLeave: "Annual Leave", status: "Pending" 
            },
        ];

        // 3. Mock Weekly Attendance: Derived from imported employee data
        const initialAttendance = employeeInfoJSON.employeeInformation
            .slice(0, 7) // Use first 7 employees for a clean table view
            .map((emp, index) => ({
                employeeId: emp.employeeId,
                week: 'Dec Week 1',
                daysPresent: (5 - (index % 3)), // Simulate varying presence
                daysLate: (index % 3 > 0 ? 1 : 0),
                performance: (index % 3 === 0 ? 'Excellent' : 'Good'),
            }));
            

        return {
            initialLeaveBalances: initialLeaveBalances, // Store for reset
            initialRequests: initialRequests,           // Store for reset
            
            leaveBalances: JSON.parse(JSON.stringify(initialLeaveBalances)),
            mockWeeklyAttendance: initialAttendance,
            timeOffRequests: JSON.parse(JSON.stringify(initialRequests)),
            
            leaveTypeMap: {
                'Annual Leave': 'annualBalance',
                'Sick Leave': 'sickBalance',
                'Family Leave': 'familyBalance',
                'Unpaid Leave': 'unpaidBalance',
            }
        };
    },
    computed: {
        pendingRequests() {
            return this.timeOffRequests.filter(req => req.status === 'Pending');
        }
    },
    methods: {
        getEmployeeName(employeeId) {
            const emp = employeeInfoJSON.employeeInformation.find(e => e.employeeId === employeeId);
            return emp ? emp.name : 'Unknown';
        },
        
        calculateDays(start, end) {
            const startMs = new Date(start).getTime();
            const endMs = new Date(end).getTime();
            const diffDays = Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24));
            return diffDays + 1; 
        },

        submitMockRequest(type, days, employeeIndex) {
            // Select an employee from the imported list
            const employeeToUse = employeeInfoJSON.employeeInformation[employeeIndex || 4]; 
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 7); 
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + days - 1);
            
            const newRequest = {
                id: nextRequestId++,
                employeeId: employeeToUse.employeeId, 
                name: employeeToUse.name, 
                startDate: startDate.toISOString().split('T')[0], 
                endDate: endDate.toISOString().split('T')[0], 
                typeOfLeave: type,
                status: "Pending"
            };
            this.timeOffRequests.push(newRequest);
            alert(`New ${type} request submitted by ${employeeToUse.name} and added to the Pending list.`);
        },

        approveRequest(request) {
            const daysRequested = this.calculateDays(request.startDate, request.endDate);
            const balanceKey = this.leaveTypeMap[request.typeOfLeave]; 
            const balanceItem = this.leaveBalances.find(e => e.employeeId === request.employeeId);
            
            if (balanceItem && balanceKey) {
                // Check if paid leave has sufficient balance
                if (request.typeOfLeave === 'Unpaid Leave' || balanceItem[balanceKey] >= daysRequested) {
                    
                    // --- AUTOMATIC ATTENDANCE UPDATE LOGIC ---
                    if (request.typeOfLeave !== 'Unpaid Leave') {
                        balanceItem[balanceKey] -= daysRequested;
                    } 

                    request.status = 'Approved';
                    alert(`Request for ${request.name} (${request.typeOfLeave}) approved! Balance updated: -${daysRequested} days.`);
                } else {
                    alert(`Error: ${request.name} only has ${balanceItem[balanceKey]} days of ${request.typeOfLeave} left.`);
                }
            }
        },

        denyRequest(request) {
            request.status = 'Denied';
            alert(`Request for ${request.name} denied. Balance remains unchanged.`);
        },
        
        resetRequests() {
            // Reset working arrays back to their initial states
            this.timeOffRequests = JSON.parse(JSON.stringify(this.initialRequests)); 
            this.leaveBalances = JSON.parse(JSON.stringify(this.initialLeaveBalances)); 
            alert('Time Off requests and balances have been reset.');
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