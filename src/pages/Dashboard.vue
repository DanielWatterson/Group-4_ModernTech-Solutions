<template>
  <div class="dashboard p-4">
    <!-- Dashboard Header -->
    <div class="dashboard-header mb-4">
      <h2>Dashboard Overview</h2>
      <div class="header-status">
        <span class="badge" :class="databaseStatus.class">
          <i class="bi" :class="databaseStatus.icon"></i> {{ databaseStatus.text }}
        </span>
        <small v-if="lastUpdated">Last updated: {{ lastUpdated }}</small>
        <button @click="refreshData" class="btn btn-sm btn-outline-light ms-3">
          <i class="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state text-center py-5">
      <div class="spinner-border text-light" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3">Loading dashboard data from database...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <h5><i class="bi bi-exclamation-triangle"></i> Database Connection Error</h5>
      <p>{{ error }}</p>
      <button @click="fetchDashboardData" class="btn btn-sm btn-outline-light mt-2">Retry Connection</button>
      <button @click="useJSONData" class="btn btn-sm btn-outline-warning mt-2 ms-2">
        Use Local Data
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- KPI CARDS -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3" v-for="kpi in kpis" :key="kpi.label">
          <div class="card kpi-card text-center shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ kpi.label }}</h5>
              <h2 class="display-6">{{ kpi.value }}</h2>
              <small class="text-muted">{{ kpi.description }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- PERFORMANCE SNAPSHOT -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-primary bg-opacity-25 border-0">
              <h5 class="mb-0">Performance Snapshot</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <strong>Average Score:</strong>
                <span class="float-end badge bg-info fs-6">{{ averageScore }}</span>
              </div>
              
              <div v-if="topPerformer">
                <strong>Top Performer:</strong>
                <div class="d-flex justify-content-between align-items-center mt-2 p-2 bg-dark bg-opacity-25 rounded">
                  <div>
                    <strong>{{ topPerformer.employee_name || topPerformer.employeeName }}</strong>
                    <div class="small">{{ topPerformer.department }}</div>
                  </div>
                  <span class="badge bg-success fs-6">{{ topPerformer.score }}</span>
                </div>
              </div>
              
              <div class="mt-3">
                <strong>Performance Distribution:</strong>
                <div class="mt-2">
                  <div v-for="(count, status) in performanceDistribution" :key="status" 
                       class="d-flex justify-content-between align-items-center mb-1">
                    <span>{{ status }}</span>
                    <span class="badge" :class="getStatusBadgeClass(status)">{{ count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- EMPLOYEES BY DEPARTMENT -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-success bg-opacity-25 border-0">
              <h5 class="mb-0">Employees by Department</h5>
            </div>
            <div class="card-body">
              <div v-if="Object.keys(departmentStats).length > 0">
                <div v-for="(count, dept) in departmentStats" :key="dept" class="mb-2">
                  <div class="d-flex justify-content-between mb-1">
                    <span>{{ dept }}</span>
                    <span class="badge bg-secondary">{{ count }} employees</span>
                  </div>
                  <div class="progress" style="height: 8px;">
                    <div 
                      class="progress-bar" 
                      :class="getDepartmentColor(dept)"
                      :style="{ width: getDepartmentPercentage(count) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-3">
                <p class="text-muted">No department data available</p>
              </div>
              
              <!-- Additional Stats -->
              <div class="mt-4 pt-3 border-top">
                <div class="row text-center">
                  <div class="col-6">
                    <div class="stat-number">{{ totalEmployees }}</div>
                    <div class="stat-label">Total Employees</div>
                  </div>
                  <div class="col-6">
                    <div class="stat-number">{{ Object.keys(departmentStats).length }}</div>
                    <div class="stat-label">Departments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Database Info Footer -->
      <div class="mt-4 text-center">
        <small class="text-muted">
          <i class="bi bi-database"></i> Connected to MySQL database | 
          Data fetched via API | 
          <button @click="fetchDashboardData" class="btn btn-sm btn-outline-light ms-2">
            <i class="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api';
import employeeInfoJSON from '@/data/employee_info.json';
import performanceJSON from '@/data/performance_info.json';

export default {
  name: 'Dashboard',
  
  data() {
    return {
      loading: true,
      error: null,
      lastUpdated: null,
      
      // Data from SQL
      employees: [],
      performance: [],
      
      // Dashboard stats
      kpis: [
        { label: 'Total Employees', value: 0, description: 'Active employees' },
        { label: 'Departments', value: 0, description: 'Active departments' },
        { label: 'Avg Performance', value: 0, description: 'Overall average score' },
        { label: 'Top Performer', value: 0, description: 'Highest score' }
      ],
      
      // JSON fallback data
      jsonEmployees: employeeInfoJSON.employeeInformation || [],
      jsonPerformance: performanceJSON || []
    }
  },
  
  computed: {
    databaseStatus() {
      if (this.loading) return { text: 'Connecting...', class: 'bg-warning', icon: 'bi-hourglass' }
      if (this.error) return { text: 'Disconnected', class: 'bg-danger', icon: 'bi-x-circle' }
      return { text: 'Connected', class: 'bg-success', icon: 'bi-check-circle' }
    },
    
    totalEmployees() {
      return this.employees.length || this.jsonEmployees.length;
    },
    
    departmentStats() {
      const stats = {};
      const employeesToUse = this.employees.length ? this.employees : this.jsonEmployees;
      
      employeesToUse.forEach(emp => {
        const dept = emp.department || 'Unknown';
        stats[dept] = (stats[dept] || 0) + 1;
      });
      return stats;
    },
    
    averageScore() {
      const performanceToUse = this.performance.length ? this.performance : this.jsonPerformance;
      if (!performanceToUse.length) return 'N/A';
      const total = performanceToUse.reduce((sum, perf) => sum + (perf.score || 0), 0);
      return Math.round(total / performanceToUse.length);
    },
    
    topPerformer() {
      const performanceToUse = this.performance.length ? this.performance : this.jsonPerformance;
      if (!performanceToUse.length) return null;
      return performanceToUse.reduce((best, current) => 
        (current.score || 0) > (best.score || 0) ? current : best
      );
    },
    
    performanceDistribution() {
      const performanceToUse = this.performance.length ? this.performance : this.jsonPerformance;
      const distribution = {};
      performanceToUse.forEach(perf => {
        const status = perf.status || 'Unknown';
        distribution[status] = (distribution[status] || 0) + 1;
      });
      return distribution;
    }
  },
  
  async mounted() {
    await this.fetchDashboardData();
  },
  
  methods: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;
      
      try {
        // Try to fetch from API first
        console.log('Fetching data from API...');
        
        const [employeesRes, performanceRes] = await Promise.all([
          apiService.getEmployees(),
          apiService.getPerformance()
        ]);
        
        // Update with API data
        this.employees = employeesRes.data || employeesRes;
        this.performance = performanceRes.data || performanceRes;
        
        // Update KPI cards
        this.updateKPIs();
        
        // Update timestamp
        this.lastUpdated = new Date().toLocaleTimeString();
        
        console.log('✅ API data loaded successfully');
        
      } catch (err) {
        console.warn('API connection failed, using JSON data:', err.message);
        this.error = `API Connection Failed: ${err.message}. Using local data.`;
        
        // Fallback to JSON data
        this.useJSONData();
      } finally {
        this.loading = false;
      }
    },
    
    useJSONData() {
      console.log('Using JSON fallback data');
      this.employees = this.jsonEmployees;
      this.performance = this.jsonPerformance;
      this.updateKPIs();
      this.error = null;
      this.lastUpdated = new Date().toLocaleTimeString() + ' (Local Data)';
    },
    
    updateKPIs() {
      this.kpis[0].value = this.totalEmployees;
      this.kpis[1].value = Object.keys(this.departmentStats).length;
      this.kpis[2].value = this.averageScore;
      this.kpis[3].value = this.topPerformer ? this.topPerformer.score : 'N/A';
    },
    
    getDepartmentColor(dept) {
      const colors = {
        'Development': 'bg-primary',
        'Marketing': 'bg-success',
        'IT': 'bg-info',
        'Design': 'bg-warning',
        'Finance': 'bg-danger',
        'Support': 'bg-secondary',
        'Sales': 'bg-dark',
        'QA': 'bg-primary',
        'HR': 'bg-success'
      };
      return colors[dept] || 'bg-light';
    },
    
    getDepartmentPercentage(count) {
      const total = Object.values(this.departmentStats).reduce((sum, val) => sum + val, 0);
      return total > 0 ? (count / total) * 100 : 0;
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        'Excellent': 'bg-success',
        'Good': 'bg-info',
        'Average': 'bg-warning',
        'Poor': 'bg-danger'
      };
      return classes[status] || 'bg-secondary';
    },
    
    refreshData() {
      this.fetchDashboardData();
    }
  }
}
</script>

<style scoped>
/* Your existing styles remain the same */
.dashboard {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding: 60px 20px;
  background:
    linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)),
    url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
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

/* ... rest of your existing Dashboard.vue styles ... */
</style>