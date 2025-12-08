<template>
  <div>
    <h2>Performance Reviews</h2>

    <ul class="list-group mt-3">
      <li
        v-for="employee in employees"
        :key="employee.id"
        class="list-group-item"
      >
        <strong>{{ employee.employeeName }}</strong><br>
        Department: {{ employee.department }}<br>
        Score: {{ employee.score }}<br>
        Status: <span :class="getStatusClass(employee.status)">
          {{ employee.status }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import performanceData from "../data/performance_info.json";

export default {
  name: "Performance",

  data() {
    return {
      employees: performanceData
    };
  },

  methods: {
    getStatusClass(status) {
      if (status === "Excellent") return "text-success fw-bold";
      if (status === "Good") return "text-primary fw-bold";
      return "text-muted";
    }
  }
};
</script>
