<template>
  <div class="home-page">
    <!-- Welcome Header -->
    <div class="welcome-header py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="fw-bold mb-2">Welcome back, {{ userName }}!</h1>
            <p class="lead mb-4">Your HR overview and quick access panel</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <div class="date-card p-3 rounded-3">
              <small class="d-block text-muted">Today's Date</small>
              <strong class="h4 mb-0">{{ currentDate }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="container py-5">
      <div class="text-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container py-4">
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ error }}
        <button @click="fetchData" class="btn btn-sm btn-outline-danger ms-3">
          Retry
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="container py-4">
      <!-- User Profile Card -->
      <div class="card profile-card mb-5 border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <div class="d-flex align-items-center">
                <img :src="userAvatar" alt="Profile" class="profile-img rounded-circle me-4" />
                <div>
                  <h4 class="fw-bold mb-1">{{ userName }}</h4>
                  <p class="text-muted mb-2">
                    <i class="bi bi-briefcase me-1"></i>{{ userRole }} • {{ userDepartment }}
                  </p>
                  <p class="mb-0">
                    <i class="bi bi-envelope me-1"></i>{{ userEmail }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <router-link to="/dashboard" class="btn btn-primary px-4">
                <i class="bi bi-speedometer2 me-2"></i>Go to Dashboard
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-5">
        <div class="col-lg-3 col-md-6" v-for="stat in stats" :key="stat.title">
          <div class="card stat-card border-0 shadow-sm h-100" @click="handleStatClick(stat)">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-uppercase text-muted small mb-2">{{ stat.title }}</h6>
                  <h2 class="fw-bold mb-0">{{ stat.value }}</h2>
                </div>
                <div class="stat-icon" :class="stat.iconBg">
                  <i :class="['bi', stat.icon, 'fs-4', stat.iconColor]"></i>
                </div>
              </div>
              <div class="mt-3">
                <small class="text-muted">{{ stat.description }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-lightning me-2"></i>Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-xl-2 col-md-4 col-sm-6" v-for="action in quickActions" :key="action.label">
                  <button class="btn quick-action-btn w-100 h-100 p-3" :class="action.btnClass" @click="handleQuickAction(action.action)">
                    <i :class="['bi', action.icon, 'fs-3 mb-2']"></i>
                    <br>
                    <small class="fw-medium">{{ action.label }}</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Joiners -->
      <div class="row">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-person-plus me-2"></i>Recently Joined Employees
              </h5>
              <router-link to="/employees" class="btn btn-sm btn-outline-primary">
                View All <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead>
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
                          <div class="avatar-placeholder me-3">
                            {{ getInitials(employee.name) }}
                          </div>
                          <div>
                            <strong>{{ employee.name }}</strong>
                            <div class="small text-muted">{{ employee.email }}</div>
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
        <div class="col-lg-4 mt-4 mt-lg-0">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-list-check me-2"></i>Pending Tasks
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div v-for="task in pendingTasks" :key="task.id" class="list-group-item border-0 px-0 py-3">
                  <div class="d-flex align-items-start">
                    <div class="task-checkbox me-3">
                      <input type="checkbox" class="form-check-input" v-model="task.completed" @change="updateTask(task)">
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="fw-medium mb-1" :class="{ 'text-decoration-line-through': task.completed }">
                        {{ task.title }}
                      </h6>
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>{{ task.due }}
                      </small>
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
      
      // User data
      userName: localStorage.getItem('userName') || 'Guest',
      userRole: localStorage.getItem('userRole') || '',
      userDepartment: localStorage.getItem('userDepartment') || '',
      userEmail: localStorage.getItem('userEmail') || '',
      userAvatar: localStorage.getItem('userAvatar') || 'https://via.placeholder.com/100',
      
      // Dashboard data
      stats: [
        { title: 'Total Employees', value: 0, description: 'Active employees', icon: 'bi-people-fill', iconBg: 'bg-primary', iconColor: 'text-white' },
        { title: 'Departments', value: 0, description: 'Active departments', icon: 'bi-building', iconBg: 'bg-success', iconColor: 'text-white' },
        { title: 'Recent Joiners', value: 0, description: 'Last 30 days', icon: 'bi-person-plus', iconBg: 'bg-info', iconColor: 'text-white' },
        { title: 'Pending Tasks', value: '5', description: 'Require attention', icon: 'bi-list-check', iconBg: 'bg-warning', iconColor: 'text-white' }
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
        { label: 'Add Employee', icon: 'bi-person-plus', btnClass: 'btn-outline-primary', action: 'addEmployee' },
        { label: 'Time Off', icon: 'bi-calendar-event', btnClass: 'btn-outline-success', action: 'timeOff' },
        { label: 'Payroll', icon: 'bi-cash-coin', btnClass: 'btn-outline-info', action: 'payroll' },
        { label: 'Reports', icon: 'bi-graph-up', btnClass: 'btn-outline-warning', action: 'reports' },
        { label: 'Documents', icon: 'bi-folder', btnClass: 'btn-outline-secondary', action: 'documents' },
        { label: 'Settings', icon: 'bi-gear', btnClass: 'btn-outline-dark', action: 'settings' }
      ]
    }
  },
  
  async mounted() {
    // Set current date
    const now = new Date()
    this.currentDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    // Fetch data from database
    await this.fetchData()
  },
  
  methods: {
    async fetchData() {
      this.loading = true
      this.error = null
      
      try {
        // Fetch employees from your API
        const response = await apiService.getEmployees()
        
        if (response.success && response.data) {
          this.recentEmployees = response.data.slice(-5).reverse() // Get 5 most recent
          
          // Update stats
          this.stats[0].value = response.data.length
          
          // Get unique departments
          const departments = [...new Set(response.data.map(emp => emp.department))]
          this.stats[1].value = departments.length
          
          // Update recent joiners count (last 30 days)
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
      console.log('Stat clicked:', stat.title)
      // Navigate based on stat
      if (stat.title.includes('Employee')) {
        this.$router.push('/employees')
      } else if (stat.title.includes('Department')) {
        this.$router.push('/departments')
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
      // In a real app, you would update this in the database
    }
  }
}
</script>

<style scoped>
.home-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.welcome-header {
  background: linear-gradient(135deg, #003366, #0066cc);
  color: white;
}

.date-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-card {
  border-radius: 15px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border: 4px solid rgba(0, 51, 102, 0.1);
  object-fit: cover;
}

.stat-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action-btn {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c63ff, #5548c8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.task-checkbox .form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}
</style>