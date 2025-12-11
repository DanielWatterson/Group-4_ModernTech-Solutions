<template>
  <div class="container mt-4">
    <h2 class="mb-3">Employee Performance Reviews</h2>

    <div v-if="reviews.length === 0" class="alert alert-info mt-4">
      No performance reviews available yet.
    </div>

    <!-- Charts -->
    <div class="charts row mt-4 mb-4">
      <div class="col-md-6 mb-3">
        <div class="card chart-card p-3">
          <h5 class="mb-2">Performance Scores</h5>
          <canvas id="scoreLineChart"></canvas>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card chart-card p-3">
          <h5 class="mb-2">Status Distribution</h5>
          <canvas id="statusDoughnutChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Review Cards -->
    <div class="row mt-4">
      <div class="col-md-4" v-for="review in reviews" :key="review.id">
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ review.employeeName }}</h5>
            <p class="text-muted">{{ review.department }}</p>

            <div class="d-flex justify-content-between">
              <span><strong>Score:</strong></span>
              <span>{{ review.score }}</span>
            </div>

            <div class="d-flex justify-content-between">
              <span><strong>Status:</strong></span>
              <span>{{ review.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import performanceJSON from '../data/performance_info.json'
import Chart from 'chart.js/auto'

export default {
  name: 'Performance',
  data() {
    return {
      reviews: performanceJSON,
      lineChart: null,
      doughnutChart: null,
    }
  },
  mounted() {
    this.renderCharts()
  },
  methods: {
    renderCharts() {
      // --- Line chart for scores ---
      const ctxLine = document.getElementById('scoreLineChart').getContext('2d')
      this.lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: this.reviews.map((r) => r.employeeName),
          datasets: [
            {
              label: 'Score',
              data: this.reviews.map((r) => r.score),
              borderColor: '#6c63ff',
              backgroundColor: 'rgba(108, 99, 255, 0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: { stepSize: 10 },
            },
          },
        },
      })

      // --- Doughnut chart for status distribution ---
      const statusCounts = this.reviews.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1
        return acc
      }, {})

      const ctxDoughnut = document.getElementById('statusDoughnutChart').getContext('2d')
      this.doughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusCounts),
          datasets: [
            {
              label: 'Status Count',
              data: Object.values(statusCounts),
              backgroundColor: [
                '#28a745', // Excellent
                '#ffc107', // Good
                '#fd7e14', // Average
                '#dc3545', // Poor
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#fff' },
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped>
.container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;
  background:
    linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)),
    url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop')
      center/cover no-repeat;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 30px;
    animation: fadeIn 0.8s ease-out;
}

h2 {
  font-weight: 700;
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

p.text-muted {
  color: rgba(255, 0, 0, 0.85);
}
#scoreLineChart,
#statusDoughnutChart {
  height: 260px !important;
  max-height: 260px !important;
}

/* Charts cards */
.chart-card {
  border-radius: 20px;
  background: rgba(24, 40, 72, 0.5);
  backdrop-filter: blur(12px);
  color: #fff;
}

/* Review Cards */
.card {
  border-radius: 20px;
  background: rgba(24, 40, 72, 0.5);
  backdrop-filter: blur(12px);
  color: #fff;
  transition: 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  background: rgba(24, 40, 72, 0.6);
}

.card-title {
  font-weight: 600;
}

.text-muted {
  color: #ffffff !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    text-align: center;
  }
}
</style>
