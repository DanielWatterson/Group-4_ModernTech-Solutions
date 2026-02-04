<template>
  <div class="home">
    <div class="container-fluid">
      <!-- Welcome Header -->
      <div class="row align-items-center mb-4">
        <div class="col-lg-8">
          <h1 class="h2 fw-bold mb-2">Welcome back, {{ userName }}!</h1>
          <p class="text-muted mb-0">Your HR overview and quick access panel</p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <div class="card border-0 shadow-sm d-inline-block">
            <div class="card-body py-2 px-3">
              <small class="text-muted d-block">Today's Date</small>
              <div class="fw-bold text-dark">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger alert-dismissible fade show">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ error }}
        <button @click="fetchData" class="btn btn-sm btn-outline-danger ms-3">
          Retry
        </button>
        <button type="button" class="btn-close" @click="error = null"></button>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Profile Card -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="d-flex align-items-center">
                  <img :src="userAvatar" alt="Profile" class="rounded-circle border me-4" width="80" height="80" />
                  <div>
                    <h4 class="fw-bold mb-1">{{ userName }}</h4>
                    <p class="text-muted mb-2">
                      <i class="bi bi-briefcase me-1"></i>{{ userRole }} • {{ userDepartment }}
                    </p>
                    <p class="mb-0 text-muted">
                      <i class="bi bi-envelope me-1"></i>{{ userEmail }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 text-md-end mt-3 mt-md-0">
                <router-link to="/dashboard" class="btn btn-primary">
                  <i class="bi bi-speedometer2 me-2"></i>Go to Dashboard
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-3 mb-4">
          <div class="col-lg-3 col-md-6" v-for="stat in stats" :key="stat.title">
            <div class="card border-0 shadow-sm h-100" @click="handleStatClick(stat)">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle p-2 me-3" :class="stat.iconBg">
                    <i :class="['bi', stat.icon, 'fs-4', stat.iconColor]"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">{{ stat.title }}</h6>
                    <h3 class="fw-bold mb-0 text-primary">{{ stat.value }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">{{ stat.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-bottom">
            <h5 class="mb-0">
              <i class="bi bi-lightning text-primary me-2"></i>Quick Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-xl-2 col-md-4 col-sm-6" v-for="action in quickActions" :key="action.label">
                <button class="btn btn-outline-light w-100 h-100 p-3 border" @click="handleQuickAction(action.action)">
                  <i :class="['bi', action.icon, 'fs-3 mb-2 text-primary']"></i>
                  <div class="fw-medium text-dark mt-2">{{ action.label }}</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Joiners & Tasks -->
        <div class="row g-4">
          <!-- Recent Joiners -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-person-plus text-primary me-2"></i>Recently Joined Employees
                </h5>
                <router-link to="/employees" class="btn btn-sm btn-outline-primary">
                  View All
                </router-link>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="employee in recentEmployees" :key="employee.employee_id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3" 
                                 style="width: 40px; height: 40px;">
                              {{ getInitials(employee.name) }}
                            </div>
                            <div>
                              <div class="fw-bold">{{ employee.name }}</div>
                              <small class="text-muted">{{ employee.email }}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge" :class="getDepartmentClass(employee.department)">
                            {{ employee.department }}
                          </span>
                        </td>
                        <td>{{ employee.position }}</td>
                        <td>{{ formatDate(employee.recruitment_date) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Tasks -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-list-check text-primary me-2"></i>Pending Tasks
                </h5>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div v-for="task in pendingTasks" :key="task.id" class="list-group-item border-0 px-0 py-3">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" v-model="task.completed" @change="updateTask(task)">
                      <label class="form-check-label ms-2" :class="{ 'text-decoration-line-through text-muted': task.completed }">
                        <div class="fw-medium">{{ task.title }}</div>
                        <small class="text-muted">
                          <i class="bi bi-clock me-1"></i>{{ task.due }}
                        </small>
                      </label>
                    </div>
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
import apiService from '@/services/api';

export default {
  name: 'HomePage',
  
  data() {
    return {
      loading: true,
      error: null,
      currentDate: '',
      
      userName: localStorage.getItem('userName') || 'Guest',
      userRole: localStorage.getItem('userRole') || '',
      userDepartment: localStorage.getItem('userDepartment') || '',
      userEmail: localStorage.getItem('userEmail') || '',
      userAvatar: localStorage.getItem('userAvatar') || 'https://ui-avatars.com/api/?name=Guest&background=6c757d&color=fff',
      
      stats: [
        { 
          title: 'Total Employees', 
          value: 0, 
          description: 'Active employees', 
          icon: 'bi-people-fill', 
          iconBg: 'bg-primary bg-opacity-10', 
          iconColor: 'text-primary' 
        },
        { 
          title: 'Departments', 
          value: 0, 
          description: 'Active departments', 
          icon: 'bi-building', 
          iconBg: 'bg-success bg-opacity-10', 
          iconColor: 'text-success' 
        },
        { 
          title: 'Recent Joiners', 
          value: 0, 
          description: 'Last 30 days', 
          icon: 'bi-person-plus', 
          iconBg: 'bg-info bg-opacity-10', 
          iconColor: 'text-info' 
        },
        { 
          title: 'Pending Tasks', 
          value: '5', 
          description: 'Require attention', 
          icon: 'bi-list-check', 
          iconBg: 'bg-warning bg-opacity-10', 
          iconColor: 'text-warning' 
        }
      ],
      
      recentEmployees: [],
      pendingTasks: [
        { id: 1, title: 'Review time-off requests', due: 'Today', completed: false },
        { id: 2, title: 'Update employee records', due: 'Tomorrow', completed: false },
        { id: 3, title: 'Schedule training sessions', due: 'This week', completed: false },
        { id: 4, title: 'Prepare payroll reports', due: 'End of month', completed: false },
        { id: 5, title: 'Conduct performance reviews', due: 'Next week', completed: false }
      ],
      
      quickActions: [
        { label: 'Add Employee', icon: 'bi-person-plus', action: 'addEmployee' },
        { label: 'Time Off', icon: 'bi-calendar-event', action: 'timeOff' },
        { label: 'Payroll', icon: 'bi-cash-coin', action: 'payroll' },
        { label: 'Reports', icon: 'bi-graph-up', action: 'reports' },
        { label: 'Documents', icon: 'bi-folder', action: 'documents' },
        { label: 'Settings', icon: 'bi-gear', action: 'settings' }
      ]
    }
  },
  
  async mounted() {
    const now = new Date()
    this.currentDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    await this.fetchData()
  },
  
  methods: {
    async fetchData() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.getEmployees()
        
        if (response.success && response.data) {
          this.recentEmployees = response.data.slice(-5).reverse()
          
          // Update stats
          this.stats[0].value = response.data.length
          
          const departments = [...new Set(response.data.map(emp => emp.department))]
          this.stats[1].value = departments.length
          
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          const recentJoiners = response.data.filter(emp => {
            const joinDate = new Date(emp.recruitment_date || emp.join_date || emp.created_at)
            return joinDate > thirtyDaysAgo
          })
          this.stats[2].value = recentJoiners.length
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        this.error = 'Unable to load data from database. Please check your connection.'
      } finally {
        this.loading = false
      }
    },
    
    handleStatClick(stat) {
      if (stat.title.includes('Employee')) {
        this.$router.push('/employees')
      }
    },
    
    handleQuickAction(action) {
      switch(action) {
        case 'addEmployee':
          this.$router.push('/employees/add')
          break
        case 'timeOff':
          this.$router.push('/timeoff')
          break
        case 'payroll':
          this.$router.push('/payroll')
          break
        case 'reports':
          this.$router.push('/reports')
          break
        case 'documents':
          this.$router.push('/documents')
          break
        case 'settings':
          this.$router.push('/settings')
          break
      }
    },
    
    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
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
      }
      return classes[department] || 'bg-light text-dark'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    
    updateTask(task) {
      console.log('Task updated:', task)
    }
  }
}
</script>

<style scoped>
.home {
  background: #f8f9fa;
  min-height: calc(100vh - 56px);
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

.btn-outline-light:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.badge {
  font-weight: 500;
  padding: 4px 8px;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>