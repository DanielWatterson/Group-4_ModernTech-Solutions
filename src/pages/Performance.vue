<template>
  <div class="performance">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <h1 class="h2 fw-bold mb-2">Performance Reviews</h1>
          <p class="text-muted mb-0">Track and analyze employee performance metrics</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <span class="badge" :class="databaseStatus.class">
              <i class="bi" :class="databaseStatus.icon"></i> {{ databaseStatus.text }}
            </span>
            <button @click="fetchPerformanceData" class="btn btn-outline-primary btn-sm" :disabled="loading">
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
          <p class="mt-3 text-muted">Loading performance data...</p>
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
              <button @click="fetchPerformanceData" class="btn btn-primary btn-sm">Retry Connection</button>
            </div>
          </div>
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- KPI Cards -->
        <div class="row g-3 mb-4">
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <i class="bi bi-graph-up-arrow"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Average Score</h6>
                    <h3 class="fw-bold mb-0 text-primary">{{ averageScore }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Overall performance average</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                    <i class="bi bi-trophy"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Top Score</h6>
                    <h3 class="fw-bold mb-0 text-success">{{ topScore }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Highest performance score</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 p-2 me-3">
                    <i class="bi bi-people"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Total Reviews</h6>
                    <h3 class="fw-bold mb-0 text-info">{{ totalReviews }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Performance reviews conducted</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                    <i class="bi bi-star-half"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Excellent Rating</h6>
                    <h3 class="fw-bold mb-0 text-warning">{{ excellentCount }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Employees with excellent rating</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="row g-4 mb-4">
          <!-- Score Distribution Chart -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-bar-chart text-primary me-2"></i>Score Distribution
                </h5>
              </div>
              <div class="card-body">
                <canvas ref="scoreChart" style="max-height: 300px;"></canvas>
              </div>
            </div>
          </div>

          <!-- Status Distribution Chart -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-pie-chart text-primary me-2"></i>Status Distribution
                </h5>
              </div>
              <div class="card-body">
                <canvas ref="statusChart" style="max-height: 300px;"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Reviews Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-list-check text-primary me-2"></i>Performance Reviews
            </h5>
            <div class="d-flex gap-2">
              <select v-model="selectedDepartment" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <input 
                type="text" 
                v-model="searchQuery" 
                class="form-control form-control-sm" 
                placeholder="Search employees..." 
                style="width: 200px;"
              />
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Review Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="review in filteredReviews" :key="review.review_id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3" 
                             style="width: 40px; height: 40px;">
                          {{ getInitials(review.employee_name || review.employeeName) }}
                        </div>
                        <div>
                          <div class="fw-bold">{{ review.employee_name || review.employeeName }}</div>
                          <small class="text-muted">{{ getEmployeeInfo(review.employee_id) }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge" :class="getDepartmentClass(review.department)">
                        {{ review.department }}
                      </span>
                    </td>
                    <td>
                      <div class="progress" style="height: 8px; width: 100px;">
                        <div 
                          class="progress-bar" 
                          :class="getScoreClass(review.score)"
                          :style="{ width: review.score + '%' }"
                          role="progressbar"
                        ></div>
                      </div>
                      <small class="fw-medium">{{ review.score }}</small>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusClass(review.status)">
                        {{ review.status }}
                      </span>
                    </td>
                    <td>
                      <small>{{ formatDate(review.review_date) }}</small>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(review)">
                        <i class="bi bi-eye"></i> Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- No Results -->
              <div v-if="filteredReviews.length === 0" class="text-center py-5">
                <i class="bi bi-graph-up fs-1 text-muted mb-3"></i>
                <h5 class="text-muted mb-2">No performance reviews found</h5>
                <p class="text-muted mb-0">Try adjusting your search criteria</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Footer -->
        <div class="mt-4 pt-3 border-top">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              <i class="bi bi-database me-1"></i> Connected to MySQL database | 
              Showing {{ filteredReviews.length }} of {{ performanceData.length }} reviews
            </div>
            <button @click="fetchPerformanceData" class="btn btn-link text-decoration-none">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/api';
import Chart from 'chart.js/auto';

export default {
  name: 'Performance',
  
  setup() {
    const performanceData = ref([]);
    const employees = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchQuery = ref('');
    const selectedDepartment = ref('');
    
    // Chart references
    const scoreChart = ref(null);
    const statusChart = ref(null);
    
    // Chart instances
    let scoreChartInstance = null;
    let statusChartInstance = null;

    // Computed properties
    const databaseStatus = computed(() => {
      if (loading.value) return { text: 'Loading...', class: 'bg-info', icon: 'bi-hourglass' };
      if (error.value) return { text: 'Error', class: 'bg-danger', icon: 'bi-x-circle' };
      return { text: 'Connected', class: 'bg-success', icon: 'bi-check-circle' };
    });

    const averageScore = computed(() => {
      if (!performanceData.value.length) return 'N/A';
      const total = performanceData.value.reduce((sum, review) => sum + (review.score || 0), 0);
      return Math.round(total / performanceData.value.length);
    });

    const topScore = computed(() => {
      if (!performanceData.value.length) return 'N/A';
      return Math.max(...performanceData.value.map(review => review.score || 0));
    });

    const totalReviews = computed(() => performanceData.value.length);

    const excellentCount = computed(() => {
      return performanceData.value.filter(review => review.status === 'Excellent').length;
    });

    const departments = computed(() => {
      const depts = [...new Set(performanceData.value.map(review => review.department))];
      return depts.filter(Boolean).sort();
    });

    const filteredReviews = computed(() => {
      return performanceData.value.filter(review => {
        const matchesSearch = searchQuery.value === '' || 
          (review.employee_name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (review.employeeName || '').toLowerCase().includes(searchQuery.value.toLowerCase());
        
        const matchesDept = selectedDepartment.value === '' || 
          review.department === selectedDepartment.value;
        
        return matchesSearch && matchesDept;
      });
    });

    // Methods
    const fetchPerformanceData = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const response = await apiService.getPerformance();
        console.log('Performance API response:', response);
        
        if (response.success && response.data) {
          performanceData.value = response.data;
        } else if (Array.isArray(response)) {
          performanceData.value = response;
        } else {
          throw new Error('Unexpected API response format');
        }
        
        // Fetch employees for additional info
        await fetchEmployees();
        
        // Render charts after data is loaded
        setTimeout(() => {
          renderCharts();
        }, 100);
        
      } catch (err) {
        console.error('Failed to fetch performance data:', err);
        error.value = 'Unable to load performance data. Please check your connection.';
        
        // Fallback to empty array
        performanceData.value = [];
      } finally {
        loading.value = false;
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await apiService.getEmployees();
        if (response.success && response.data) {
          employees.value = response.data;
        } else if (Array.isArray(response)) {
          employees.value = response;
        }
      } catch (err) {
        console.warn('Failed to fetch employees:', err);
      }
    };

    const getInitials = (name) => {
      if (!name) return '??';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

    const getEmployeeInfo = (employeeId) => {
      const employee = employees.value.find(emp => 
        emp.employee_id === employeeId || emp.employeeId === employeeId
      );
      return employee ? employee.position || 'N/A' : 'N/A';
    };

    const getDepartmentClass = (department) => {
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
      };
      return classes[department] || 'bg-light text-dark';
    };

    const getScoreClass = (score) => {
      if (score >= 85) return 'bg-success';
      if (score >= 70) return 'bg-info';
      if (score >= 60) return 'bg-warning';
      return 'bg-danger';
    };

    const getStatusClass = (status) => {
      const classes = {
        'Excellent': 'bg-success',
        'Good': 'bg-info',
        'Average': 'bg-warning',
        'Poor': 'bg-danger'
      };
      return classes[status] || 'bg-secondary';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch (e) {
        return dateString;
      }
    };

    const viewDetails = (review) => {
      alert(`Review Details:\n\nEmployee: ${review.employee_name || review.employeeName}\nScore: ${review.score}\nStatus: ${review.status}\nDepartment: ${review.department}\nReview Date: ${formatDate(review.review_date)}`);
    };

    const renderCharts = () => {
      // Destroy existing charts
      if (scoreChartInstance) scoreChartInstance.destroy();
      if (statusChartInstance) statusChartInstance.destroy();

      // Score Distribution Chart (Bar Chart)
      if (scoreChart.value) {
        const scoreRanges = {
          '90-100': 0,
          '80-89': 0,
          '70-79': 0,
          '60-69': 0,
          '0-59': 0
        };

        performanceData.value.forEach(review => {
          const score = review.score || 0;
          if (score >= 90) scoreRanges['90-100']++;
          else if (score >= 80) scoreRanges['80-89']++;
          else if (score >= 70) scoreRanges['70-79']++;
          else if (score >= 60) scoreRanges['60-69']++;
          else scoreRanges['0-59']++;
        });

        const ctx = scoreChart.value.getContext('2d');
        scoreChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(scoreRanges),
            datasets: [{
              label: 'Number of Employees',
              data: Object.values(scoreRanges),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Employees'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Score Range'
                }
              }
            }
          }
        });
      }

      // Status Distribution Chart (Doughnut Chart)
      if (statusChart.value) {
        const statusCounts = performanceData.value.reduce((acc, review) => {
          const status = review.status || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const ctx = statusChart.value.getContext('2d');
        statusChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(statusCounts),
            datasets: [{
              data: Object.values(statusCounts),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)', // Excellent
                'rgba(54, 162, 235, 0.6)',  // Good
                'rgba(255, 206, 86, 0.6)',  // Average
                'rgba(255, 99, 132, 0.6)'   // Poor
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20
                }
              }
            }
          }
        });
      }
    };

    // Lifecycle
    onMounted(() => {
      fetchPerformanceData();
    });

    return {
      performanceData,
      loading,
      error,
      searchQuery,
      selectedDepartment,
      databaseStatus,
      averageScore,
      topScore,
      totalReviews,
      excellentCount,
      departments,
      filteredReviews,
      scoreChart,
      statusChart,
      fetchPerformanceData,
      getInitials,
      getEmployeeInfo,
      getDepartmentClass,
      getScoreClass,
      getStatusClass,
      formatDate,
      viewDetails
    };
  }
}
</script>

<style scoped>
.performance {
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

.progress-bar {
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

.bg-dark {
  background-color: #212529 !important;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .performance {
    padding: 15px;
  }
  
  .card-body {
    padding: 1rem !important;
  }
}
</style>