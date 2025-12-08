<template>
  <div class="home-page container py-5">

    <!-- HEADER -->
    <div class="text-center mb-5">
      <h1 class="fw-bold">Welcome, {{ user.name }}</h1>
      <p class="text-muted">Your HR overview and quick access panel</p>
    </div>

    <!-- PROFILE CARD -->
    <div class="card profile-card mb-5 shadow-sm mx-auto">
      <div class="card-body d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div class="d-flex align-items-center mb-3 mb-md-0">
          <img :src="user.avatar" alt="Profile" class="profile-img me-3">
          <div>
            <h4 class="fw-semibold mb-1">{{ user.name }}</h4>
            <p class="text-muted mb-0">{{ user.role }} — {{ user.department }}</p>
            <p class="text-secondary mb-0">{{ user.email }}</p>
          </div>
        </div>

        <router-link to="/dashboard" class="btn btn-primary px-4">
          Go to Dashboard
        </router-link>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="row g-4 mb-5">
      <div class="col-6 col-md-3" v-for="card in statCards" :key="card.label">
        <div class="card stat-card text-center shadow-sm">
          <div class="card-body">
            <p class="text-muted small mb-1">{{ card.label }}</p>
            <h3 class="fw-bold">{{ card.value }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- RECENT JOINERS -->
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="fw-semibold mb-3">Recently Joined Employees</h5>

        <ul class="list-group list-group-flush">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="employee in recentJoiners"
            :key="employee.employeeId"
          >
            <span>
              <strong>{{ employee.name }}</strong>
              <span class="text-muted">— {{ employee.position }}</span>
            </span>
            <span class="badge bg-light text-dark border">
              {{ employee.department }}
            </span>
          </li>
        </ul>

      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive } from "vue";
import employeeInfo from "../data/employee_info.json";

// reactive user object
const user = reactive({
  name: localStorage.getItem("userName") || "Guest",
  role: localStorage.getItem("userRole") || "",
  department: localStorage.getItem("userDepartment") || "",
  email: localStorage.getItem("userEmail") || "",
  avatar: localStorage.getItem("userAvatar") || "https://via.placeholder.com/100"
});

// update user when login occurs
window.addEventListener("userChanged", () => {
  user.name = localStorage.getItem("userName") || "Guest";
  user.role = localStorage.getItem("userRole") || "";
  user.department = localStorage.getItem("userDepartment") || "";
  user.email = localStorage.getItem("userEmail") || "";
  user.avatar = localStorage.getItem("userAvatar") || "https://via.placeholder.com/100";
});

// stats setup
const employees = employeeInfo.employeeInformation;
const totalEmployees = employees.length;
const totalDepartments = new Set(employees.map(e => e.department)).size;
const recentJoiners = employees.slice(-3);
const pendingTasks = 5;

const statCards = [
  { label: "Total Employees", value: totalEmployees },
  { label: "Departments", value: totalDepartments },
  { label: "Recent Joiners", value: recentJoiners.length },
  { label: "Pending Tasks", value: pendingTasks }
];
</script>


<style scoped>
.home-page {
  font-family: 'Inter', sans-serif;
}

/* Profile Card */
.profile-card {
  max-width: 900px;
  border-radius: 15px;
}

.profile-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

/* Stat cards */
.stat-card {
  border-radius: 12px;
  transition: 0.3s ease;
  background: #ffffff;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

/* Recent joiners list */
.list-group-item {
  padding: 12px 10px;
  font-size: 15px;
}

.list-group-item strong {
  font-weight: 600;
}

/* Global cards */
.card {
  border-radius: 12px;
}
</style>
