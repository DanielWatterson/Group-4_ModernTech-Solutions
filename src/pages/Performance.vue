<template>
  <div class="performance">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <h1 class="h2 fw-bold mb-2 animate__animated animate__fadeIn">Performance Reviews</h1>
          <p class="text-muted mb-0 animate__animated animate__fadeIn animate__delay-1s">Track and analyze employee performance metrics</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <span class="badge animate__animated animate__pulse animate__infinite" :class="databaseStatus.class">
              <i class="bi" :class="databaseStatus.icon"></i> {{ databaseStatus.text }}
            </span>
            <button @click="fetchPerformanceData" class="btn btn-outline-primary btn-sm animate__animated animate__bounceIn" :disabled="loading">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="card border-0 shadow-sm shimmer-card">
          <div class="card-body text-center py-5">
            <div class="loader-animation">
              <div class="spinner-container">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="pulse-ring"></div>
              </div>
              <p class="mt-4 text-muted animated-text">Analyzing performance data...</p>
              <div class="progress mt-3" style="height: 4px; width: 200px; margin: 0 auto;">
                <div class="progress-bar progress-bar-animated" role="progressbar" style="width: 75%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Skeleton Loaders -->
        <div class="row g-3 mb-4">
          <div class="col-xl-3 col-md-6" v-for="i in 4" :key="i">
            <div class="card border-0 shadow-sm h-100 skeleton-card">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="skeleton-circle shimmer-bg"></div>
                  <div class="ms-3 w-100">
                    <div class="skeleton-line shimmer-bg mb-2"></div>
                    <div class="skeleton-line shimmer-bg w-75"></div>
                  </div>
                </div>
                <div class="skeleton-line shimmer-bg w-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger alert-dismissible fade show animate__animated animate__shakeX">
        <div class="d-flex align-items-start">
          <i class="bi bi-exclamation-triangle me-3 fs-4 flex-shrink-0 animate__animated animate__pulse animate__infinite"></i>
          <div class="flex-grow-1">
            <h5 class="alert-heading mb-2">Database Connection Error</h5>
            <p class="mb-3">{{ error }}</p>
            <div>
              <button @click="fetchPerformanceData" class="btn btn-primary btn-sm animate__animated animate__pulse">
                <i class="bi bi-plug me-1"></i>Retry Connection
              </button>
            </div>
          </div>
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="animate__animated animate__fadeIn">
        <!-- KPI Cards with hover animations -->
        <div class="row g-3 mb-4">
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100 card-hover-scale">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3 animate__animated animate__pulse animate__infinite">
                    <i class="bi bi-graph-up-arrow"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Average Score</h6>
                    <h3 class="fw-bold mb-0 text-primary count-up">{{ averageScore }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Overall performance average</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100 card-hover-scale">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-2 me-3 animate__animated animate__pulse animate__infinite" style="animation-delay: 0.2s">
                    <i class="bi bi-trophy"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Top Score</h6>
                    <h3 class="fw-bold mb-0 text-success count-up">{{ topScore }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Highest performance score</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100 card-hover-scale">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 p-2 me-3 animate__animated animate__pulse animate__infinite" style="animation-delay: 0.4s">
                    <i class="bi bi-people"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Total Reviews</h6>
                    <h3 class="fw-bold mb-0 text-info count-up">{{ totalReviews }}</h3>
                  </div>
                </div>
                <p class="text-muted small mb-0">Performance reviews conducted</p>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100 card-hover-scale">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3 animate__animated animate__pulse animate__infinite" style="animation-delay: 0.6s">
                    <i class="bi bi-star-half"></i>
                  </div>
                  <div>
                    <h6 class="text-muted mb-0 small">Excellent Rating</h6>
                    <h3 class="fw-bold mb-0 text-warning count-up">{{ excellentCount }}</h3>
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
            <div class="card border-0 shadow-sm h-100 card-hover-lift">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-bar-chart text-primary me-2 animate__animated animate__bounceInRight"></i>Score Distribution
                </h5>
              </div>
              <div class="card-body">
                <canvas ref="scoreChart" style="max-height: 300px;"></canvas>
              </div>
            </div>
          </div>

          <!-- Status Distribution Chart -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100 card-hover-lift">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-pie-chart text-primary me-2 animate__animated animate__bounceInLeft"></i>Status Distribution
                </h5>
              </div>
              <div class="card-body">
                <canvas ref="statusChart" style="max-height: 300px;"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Reviews Table -->
        <div class="card border-0 shadow-sm card-hover-lift">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-list-check text-primary me-2 animate__animated animate__bounceInDown"></i>Performance Reviews
            </h5>
            <div class="d-flex gap-2">
              <select v-model="selectedDepartment" class="form-select form-select-sm animate__animated animate__fadeInRight" style="width: auto;">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <input
                type="text"
                v-model="searchQuery"
                class="form-control form-control-sm animate__animated animate__fadeInRight"
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
                  <tr v-for="(review, index) in filteredReviews" :key="review.review_id" 
                      :class="['animate__animated', 'animate__fadeInUp']" 
                      :style="{'animation-delay': `${index * 0.05}s`}">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3 hover-rotate"
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
                      <span class="badge animate__animated animate__bounceIn" :class="getDepartmentClass(review.department)">
                        {{ review.department }}
                      </span>
                    </td>
                    <td>
                      <div class="progress" style="height: 8px; width: 100px;">
                        <div
                          class="progress-bar progress-bar-striped"
                          :class="getScoreClass(review.score)"
                          :style="{ width: review.score + '%' }"
                          role="progressbar"
                        ></div>
                      </div>
                      <small class="fw-medium">{{ review.score }}</small>
                    </td>
                    <td>
                      <span class="badge animate__animated animate__bounceIn" :class="getStatusClass(review.status)">
                        {{ review.status }}
                      </span>
                    </td>
                    <td>
                      <small class="date-animation">{{ formatDate(review.review_date) }}</small>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary animate__animated animate__pulse animate__infinite" 
                              @click="viewDetails(review)"
                              style="animation-delay: 1s">
                        <i class="bi bi-eye"></i> Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- No Results -->
              <div v-if="filteredReviews.length === 0" class="text-center py-5 animate__animated animate__fadeIn">
                <i class="bi bi-graph-up fs-1 text-muted mb-3 animate__animated animate__bounce animate__infinite"></i>
                <h5 class="text-muted mb-2">No performance reviews found</h5>
                <p class="text-muted mb-0">Try adjusting your search criteria</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Footer -->
        <div class="mt-4 pt-3 border-top animate__animated animate__fadeInUp">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small animate__animated animate__fadeInLeft">
              <i class="bi bi-database me-1"></i> Connected to MySQL database |
              Showing {{ filteredReviews.length }} of {{ performanceData.length }} reviews
            </div>
            <button @click="fetchPerformanceData" class="btn btn-link text-decoration-none animate__animated animate__fadeInRight">
              <i class="bi bi-arrow-clockwise me-1 animate__animated animate__rotate animate__infinite"></i>Refresh Data
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

        // Animate number counters
        animateCounters();

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

    const animateCounters = () => {
      const counters = document.querySelectorAll('.count-up');
      counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        if (!isNaN(target)) {
          let current = 0;
          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = Math.round(current);
          }, 20);
        }
      });
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
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            },
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
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            },
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

/* Animation classes */
.card-hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover-scale:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.card-hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.hover-rotate {
  transition: transform 0.3s ease;
}

.hover-rotate:hover {
  transform: rotate(15deg);
}

.date-animation {
  position: relative;
  transition: color 0.3s ease;
}

.date-animation:hover {
  color: #0d6efd !important;
}

/* Progress bar animation */
.progress-bar-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}

/* Loading animations */
.loading-container {
  animation: fadeIn 0.5s ease;
}

.shimmer-card {
  position: relative;
  overflow: hidden;
}

.shimmer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

.spinner-container {
  position: relative;
  display: inline-block;
}

.pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(13, 110, 253, 0.3);
  border-radius: 50%;
  animation: pulse 1.5s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animated-text {
  background: linear-gradient(90deg, #6c757d, #0d6efd, #6c757d);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShine 2s linear infinite;
}

@keyframes textShine {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.progress-bar-animated {
  animation: progress-animation 1.5s ease-in-out infinite alternate;
}

@keyframes progress-animation {
  0% {
    width: 30%;
  }
  100% {
    width: 90%;
  }
}

/* Skeleton loaders */
.skeleton-card {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.shimmer-bg {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Table row animations */
.table-hover tbody tr {
  transition: all 0.3s ease;
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
  transform: translateX(5px);
}

/* Badge animations */
.badge {
  transition: all 0.3s ease;
}

.badge:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Button animations */
.btn-outline-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-outline-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(13, 110, 253, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-outline-primary:hover::before {
  width: 300px;
  height: 300px;
}

/* Animation utilities */
.animate__rotate {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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