<template>
  <div class="home-page py-5">

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
/* Home page main container */
.home-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;

  /* Full background image with gradient overlay */
  background: linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)), 
              url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') 
              center/cover no-repeat;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 40px;
  animation: fadeIn 0.8s ease-out;
}

/* Fade-in effect */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* HEADER */
.home-page h1,
.home-page h4 {
  color: #ffffff;
}

.home-page p {
  color: rgba(255, 255, 255, 0.85);
}

/* Glass card effect */
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

/* Profile card */
.profile-card {
  max-width: 900px; /* wider for longer text */
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card .card-body {
  display: flex;
  flex-direction: row;         /* always row for desktop */
  align-items: flex-start;     /* top-align profile image and text */
  justify-content: space-between;
  flex-wrap: wrap;             /* allows text to wrap without overlapping button */
  gap: 20px;                   /* space between text block and button */
}

.profile-card .d-flex {
  align-items: flex-start;     /* profile image and text aligned at top */
  gap: 20px;                   /* space between image and text */
}

.profile-card .profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
  transition: 0.3s ease;
}

.profile-card .profile-img:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* Stat cards */
.stat-card {
  border-radius: 15px;
  text-align: center;
  padding: 25px 15px;
  cursor: default;
  background: rgba(255, 255, 255, 0.08);
  transition: 0.3s ease;
}

.stat-card h3 {
  color: #fff;
}

.stat-card p {
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
  background: rgba(255,255,255,0.15);
}

/* Recent joiners list */
.list-group-item {
  background: rgba(255,255,255,0.05);
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
  background: rgba(255,255,255,0.15);
  transform: translateX(3px);
}

.list-group-item strong {
  font-weight: 600;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 10px;
  padding: 4px 10px;
}

/* Buttons */
.btn-primary {
  background: #6c63ff;
  border: none;
  transition: 0.3s ease;
}

.btn-primary:hover {
  background: #5548c8;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-card .d-flex {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
