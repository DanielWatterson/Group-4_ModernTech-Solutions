<template>
  <div class="home-page p-6 bg-gray-100 min-h-screen">

    <!-- Header / Welcome -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold">Welcome, {{ user.name }}</h1>
      <p class="text-gray-600">Here’s a quick overview before you dive into the dashboard</p>
    </div>

    <!-- Profile Card -->
    <div class="profile-card bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 mb-6 max-w-4xl mx-auto">
      <img :src="user.avatar" alt="Profile" class="w-24 h-24 rounded-full object-cover">
      <div class="flex-1">
        <h2 class="text-xl font-semibold">{{ user.name }}</h2>
        <p class="text-gray-500">{{ user.role }} | {{ user.department }}</p>
        <p class="text-gray-600 mt-2">{{ user.email }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <router-link to="/dashboard" class="btn btn-primary">Go to Dashboard</router-link>
      </div>
    </div>

    <!-- Quick HR Stats -->
    <div class="stats-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-6">
      <div class="stat-card bg-white shadow rounded-xl p-4 text-center">
        <p class="text-gray-500">Total Employees</p>
        <h3 class="text-2xl font-bold">{{ totalEmployees }}</h3>
      </div>
      <div class="stat-card bg-white shadow rounded-xl p-4 text-center">
        <p class="text-gray-500">Departments</p>
        <h3 class="text-2xl font-bold">{{ totalDepartments }}</h3>
      </div>
      <div class="stat-card bg-white shadow rounded-xl p-4 text-center">
        <p class="text-gray-500">Recent Joiners</p>
        <h3 class="text-2xl font-bold">{{ recentJoiners.length }}</h3>
      </div>
      <div class="stat-card bg-white shadow rounded-xl p-4 text-center">
        <p class="text-gray-500">Pending Tasks</p>
        <h3 class="text-2xl font-bold">{{ pendingTasks }}</h3>
      </div>
    </div>

    <!-- Recent Joiners List -->
    <div class="recent-activity bg-white shadow-md rounded-xl p-6 max-w-6xl mx-auto">
      <h3 class="text-xl font-semibold mb-4">Recently Joined Employees</h3>
      <ul class="flex flex-col gap-3">
        <li v-for="employee in recentJoiners" :key="employee.employeeId" class="flex justify-between items-center border-b border-gray-200 pb-2">
          <p>{{ employee.name }} - {{ employee.position }}</p>
          <span class="text-gray-400 text-sm">{{ employee.department }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import userData from "../data/user.json";
import employeeInfo from "../data/employee_info.json";

const user = userData;

// Total employees
const totalEmployees = employeeInfo.employeeInformation.length;

// Total unique departments
const totalDepartments = new Set(employeeInfo.employeeInformation.map(e => e.department)).size;

// Recent joiners (last 3 by employmentHistory date string — simple demo)
const recentJoiners = employeeInfo.employeeInformation.slice(-3);

// Pending tasks (placeholder for now)
const pendingTasks = 5;
</script>

<style scoped>
.home-page {
  font-family: 'Inter', sans-serif;
}
.btn {
  @apply px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600;
}
</style>
