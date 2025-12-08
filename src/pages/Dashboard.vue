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

          <li class="list-group-item">
            <strong>Average Score:</strong> {{ averageScore }}
          </li>

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
import employeesJSON from "../data/employee_info.json";
import performanceJSON from "../data/performance_info.json";

export default {
  name: "Dashboard",

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
        { label: "Total Employees", value: 0 },
        { label: "Departments", value: 0 },
        { label: "Avg Performance Score", value: 0 },
        { label: "Top Performer Score", value: 0 }
      ]
    };
  },

  computed: {
    // Count employees per department, as an object
    deptCounts() {
      const counts = {};
      this.employees.forEach(e => {
        counts[e.department] = (counts[e.department] || 0) + 1;
      });
      return counts;
    },

    // Average performance score caclulated among all employees
    averageScore() {
      const scores = this.performance.map(p => p.score);
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    },

    // Best performer - Not really explainable
    topPerformer() {
      return this.performance.reduce((best, p) =>
        p.score > best.score ? p : best
      );
    }
  },

  mounted() {
    // Fill KPI card values with data
    this.kpis[0].value = this.employees.length;
    this.kpis[1].value = Object.keys(this.deptCounts).length;
    this.kpis[2].value = this.averageScore;
    this.kpis[3].value = this.topPerformer.score;
  }
};
</script>
