<template>
  <div class="dashboard">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <h1 class="h2 fw-bold mb-2">Dashboard Overview</h1>
          <p class="text-muted mb-0">Key metrics and performance insights for your organization</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <span class="badge" :class="databaseStatus.class">
              <i class="bi" :class="databaseStatus.icon"></i> {{ databaseStatus.text }}
            </span>
            <button @click="refreshData" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card border-0 shadow-sm">
        <div class="card-body text-center py-5">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger alert-dismissible fade show">
        <div class="d-flex align-items-start">
          <i class="bi bi-exclamation-triangle me-3 fs-4 flex-shrink-0"></i>
          <div class="flex-grow-1">
            <h5 class="alert-heading mb-2">Database Connection Error</h5>
            <p class="mb-3">{{ error }}</p>
            <div>
              <button @click="fetchDashboardData" class="btn btn-primary btn-sm">Retry Connection</button>
            </div>
          </div>
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- KPI Cards -->
        <div class="row g-3 mb-4">
          <div class="col-xl-3 col-md-6" v-for="kpi in kpis" :key="kpi.label">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <i class="bi" :class="kpi.icon"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">{{ kpi.label }}</h6>
                    <h3 class="fw-bold mb-0 text-primary">{{ kpi.value }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">{{ kpi.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance & Department -->
        <div class="row g-4">
          <!-- Performance Card -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-graph-up text-primary me-2"></i>Performance Snapshot
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-medium">Average Score</span>
                    <span class="badge bg-primary fs-6">{{ averageScore }}</span>
                  </div>
                </div>
                
                <div v-if="topPerformer" class="mb-4">
                  <div class="fw-medium mb-2">Top Performer</div>
                  <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <div>
                      <div class="fw-bold">{{ topPerformer.employee_name || topPerformer.employeeName }}</div>
                      <small class="text-muted">{{ topPerformer.department }}</small>
                    </div>
                    <span class="badge bg-success fs-6">{{ topPerformer.score }}</span>
                  </div>
                </div>
                
                <div>
                  <div class="fw-medium mb-3">Performance Distribution</div>
                  <div class="list-group list-group-flush">
                    <div v-for="(count, status) in performanceDistribution" :key="status" 
                         class="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                      <span>{{ status }}</span>
                      <span class="badge" :class="getStatusBadgeClass(status)">{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Department Card -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-building text-primary me-2"></i>Employees by Department
                </h5>
              </div>
              <div class="card-body">
                <div v-if="Object.keys(departmentStats).length > 0">
                  <div v-for="(count, dept) in departmentStats" :key="dept" class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                      <span class="fw-medium">{{ dept }}</span>
                      <span class="badge bg-secondary">{{ count }}</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div 
                        class="progress-bar" 
                        :class="getDepartmentColor(dept)"
                        :style="{ width: getDepartmentPercentage(count) + '%' }"
                        role="progressbar"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-3">
                  <p class="text-muted">No department data available</p>
                </div>
                
                <!-- Summary -->
                <div class="row g-3 mt-4 pt-3 border-top">
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <div class="fw-bold text-primary fs-3">{{ totalEmployees }}</div>
                      <div class="text-muted small">Total Employees</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <div class="fw-bold text-primary fs-3">{{ Object.keys(departmentStats).length }}</div>
                      <div class="text-muted small">Departments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-4 pt-3 border-top">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              <i class="bi bi-database me-1"></i> Connected to MySQL database | 
              Last updated: {{ lastUpdated }}
            </div>
            <button @click="fetchDashboardData" class="btn btn-link text-decoration-none">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api';

export default {
  name: 'Dashboard',
  
  data() {
    return {
      loading: true,
      error: null,
      lastUpdated: null,
      
      employees: [],
      performance: [],
      
      kpis: [
        { 
          label: 'Total Employees', 
          value: 0, 
          description: 'Active employees', 
          icon: 'bi-people-fill' 
        },
        { 
          label: 'Departments', 
          value: 0, 
          description: 'Active departments', 
          icon: 'bi-building' 
        },
        { 
          label: 'Avg Performance', 
          value: 0, 
          description: 'Overall average score', 
          icon: 'bi-graph-up' 
        },
        { 
          label: 'Top Performer', 
          value: 0, 
          description: 'Highest score', 
          icon: 'bi-trophy' 
        }
      ],
    }
  },
  
  computed: {
    databaseStatus() {
      if (this.loading) return { text: 'Loading...', class: 'bg-info', icon: 'bi-hourglass' }
      if (this.error) return { text: 'Error', class: 'bg-danger', icon: 'bi-x-circle' }
      return { text: 'Connected', class: 'bg-success', icon: 'bi-check-circle' }
    },
    
    totalEmployees() {
      return this.employees.length;
    },
    
    departmentStats() {
      const stats = {};
      this.employees.forEach(emp => {
        const dept = emp.department || 'Unknown';
        stats[dept] = (stats[dept] || 0) + 1;
      });
      return stats;
    },
    
    averageScore() {
      if (!this.performance.length) return 'N/A';
      const total = this.performance.reduce((sum, perf) => sum + (perf.score || 0), 0);
      return Math.round(total / this.performance.length);
    },
    
    topPerformer() {
      if (!this.performance.length) return null;
      return this.performance.reduce((best, current) => 
        (current.score || 0) > (best.score || 0) ? current : best
      );
    },
    
    performanceDistribution() {
      const distribution = {};
      this.performance.forEach(perf => {
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
      console.log('🔄 Starting dashboard data fetch...');
      this.loading = true;
      this.error = null;
      
      try {
        console.time('api-calls');
        
        // Use Promise.all for parallel requests
        const [employeesRes, performanceRes] = await Promise.all([
          apiService.getEmployees(),
          apiService.getPerformance()
        ]);
        
        console.timeEnd('api-calls');
        
        console.log('📊 API Response - Employees:', employeesRes);
        console.log('📈 API Response - Performance:', performanceRes);
        
        // Handle different response formats
        this.employees = this.extractData(employeesRes);
        this.performance = this.extractData(performanceRes);
        
        console.log(`✅ Data loaded - Employees: ${this.employees.length}, Performance: ${this.performance.length}`);
        
        this.updateKPIs();
        this.lastUpdated = new Date().toLocaleTimeString();
        
      } catch (err) {
        console.error('❌ Dashboard fetch error:', err);
        this.error = `Unable to load data: ${err.message || 'Connection failed'}`;
        
        // Show empty data instead of infinite loading
        this.employees = [];
        this.performance = [];
        this.updateKPIs();
      } finally {
        this.loading = false;
        console.log('✅ Dashboard loaded');
      }
    },
    
    extractData(response) {
      // Handle different API response formats
      if (!response) return [];
      
      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Unexpected response format:', response);
      return [];
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
.dashboard {
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

.progress {
  background-color: #e9ecef;
  border-radius: 4px;
}

.badge {
  font-weight: 500;
  padding: 4px 8px;
}

.list-group-item {
  background: transparent;
}
</style>