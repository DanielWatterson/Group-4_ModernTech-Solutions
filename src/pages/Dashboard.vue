<template>
  <div class="dashboard p-3">
    <h2 class="mb-4">Dashboard Overview</h2>

    <!-- KPI CARDS -->
    <div class="row mb-4">
      <div class="col-md-3" v-for="kpi in kpis" :key="kpi.label">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5>{{ kpi.label }}</h5>
            <h2>{{ kpi.value }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- PERFORMANCE SNAPSHOT section -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h5>Performance Snapshot</h5>
        <ul class="list-group mt-3">
          <li class="list-group-item"><strong>Average Score:</strong> {{ averageScore }}</li>

          <li class="list-group-item">
            <strong>Top Performer:</strong>
            {{ topPerformer.employeeName }} ({{ topPerformer.score }})
          </li>
        </ul>
      </div>
    </div>

    <!-- EMPLOYEES BY DEPARTMENT - Section -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h5>Employees by Department</h5>
        <ul class="list-group mt-3">
          <li v-for="(count, dept) in deptCounts" :key="dept" class="list-group-item">
            {{ dept }} — {{ count }} employees
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import employeesJSON from '../data/employee_info.json'
import performanceJSON from '../data/performance_info.json'

export default {
  name: 'Dashboard',

  /**
   * Returns an object containing dashboard data.
   *
   * @property {Array} employees - Employee information from employee_info.json
   * @property {Array} performance - Performance information from performance_info.json
   * @property {Array} kpis - Dashboard KPIs
   * @property {Object} kpis[0] - Total employees
   * @property {Object} kpis[1] - Departments
   * @property {Object} kpis[2] - Average performance score
   * @property {Object} kpis[3] - Top performer score
   */
  data() {
    return {
      employees: employeesJSON.employeeInformation,
      performance: performanceJSON,

      kpis: [
        { label: 'Total Employees', value: 0 },
        { label: 'Departments', value: 0 },
        { label: 'Avg Performance Score', value: 0 },
        { label: 'Top Performer Score', value: 0 },
      ],
    }
  },

  computed: {
    // Count employees per department, as an object
    deptCounts() {
      const counts = {}
      this.employees.forEach((e) => {
        counts[e.department] = (counts[e.department] || 0) + 1
      })
      return counts
    },

    // Average performance score caclulated among all employees
    averageScore() {
      const scores = this.performance.map((p) => p.score)
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    },

    // Best performer - Not really explainable
    topPerformer() {
      return this.performance.reduce((best, p) => (p.score > best.score ? p : best))
    },
  },

  mounted() {
    // Fill KPI card values with data
    this.kpis[0].value = this.employees.length
    this.kpis[1].value = Object.keys(this.deptCounts).length
    this.kpis[2].value = this.averageScore
    this.kpis[3].value = this.topPerformer.score
  },
}
</script>
<style scoped>
/* Dashboard main container */
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
  gap: 40px;
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

/* Headings */
.dashboard h2,
.dashboard h5 {
  color: #fff;
  margin-bottom: 15px;
}

.dashboard h2 {
  font-weight: 700;
}

/* Glassy card effect */
.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  transition: 0.3s ease;
}

/* Card hover effect */
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

/* KPI cards */
.kpi-card {
  text-align: center;
  padding: 25px 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.08);
  transition: 0.3s ease;
}

.kpi-card h2 {
  color: #fff;
  font-weight: 700;
}

.kpi-card h5 {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

/* List groups */
.list-group-item {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: none;
  padding: 12px 16px;
  margin-bottom: 6px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.25s ease;
}

.list-group-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(3px);
}

.list-group-item strong {
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard .row {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
