<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Sidebar toggle (BUTTON) -->
        <button
          v-if="!isLoginPage"
          class="btn btn-outline-secondary me-3"
          @click="toggleSidebar"
        >
          ☰
        </button>

        <a class="navbar-brand" href="#">ModernTech HR Web</a>

        <!-- This optional section is for logged-in users to log back out -->
        <div v-if="!isLoginPage" class="ms-auto d-flex align-items-center">
          <img :src="userAvatar" alt="Avatar" class="rounded-circle me-2" width="36" height="36" />
          <span class="me-3">{{ userName }}</span>
          <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
        </div>
      </div>
    </nav>


    <!-- Overlay for mobile (for mobile sidebar, making it more user-friendly) -->
    <div 
      v-if="showSidebar && !isDesktop" 
      class="overlay" 
      @click="toggleSidebar"
    ></div>

    <!-- Main layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <div
        v-if="!isLoginPage"
        :class="['sidebar', { 'sidebar-show': showSidebar }]"
      >
        <div class="list-group mt-3">
          <router-link to="/home" class="list-group-item list-group-item-action">Home</router-link>
          <router-link to="/dashboard" class="list-group-item list-group-item-action">Dashboard</router-link>
          <router-link to="/employees" class="list-group-item list-group-item-action">Employees</router-link>
          <router-link to="/timeoff" class="list-group-item list-group-item-action">Time Off</router-link>
          <router-link to="/payroll" class="list-group-item list-group-item-action">Payroll</router-link>
          <router-link to="/performance" class="list-group-item list-group-item-action">Performance</router-link>
        </div>
      </div>

      <!-- Page content -->
      <div :class="['page-content', { 'content-shift': showSidebar }]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const showSidebar = ref(false);
const isDesktop = ref(true);
const isLoginPage = computed(() => route.path === "/" || route.path === "/login");

// Make user info reactive
const userName = ref(localStorage.getItem("userName") || "");
const userAvatar = ref(localStorage.getItem("userAvatar") || "");

// Listen for login events
window.addEventListener("userChanged", () => {
  userName.value = localStorage.getItem("userName") || "";
  userAvatar.value = localStorage.getItem("userAvatar") || "";
});

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) showSidebar.value = true;
}

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

function logout() {
  localStorage.clear();
  userName.value = "";
  userAvatar.value = "";
  router.push("/login");
}


</script>
<style scoped>
/* Layout */
.main-layout {
  display: flex;
  margin-top: 0;
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.1);  /* Transparent white background */
  backdrop-filter: blur(12px); /* Glass effect */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);  /* Slight shadow for better visibility */
  position: sticky;
  top: 0;
  z-index: 1100;
  color: #003366; /* Navy text color */
}

.navbar-brand {
  font-weight: 700;
  color: #003366; /* Navy text for the brand */
}

/* Sidebar */
.sidebar {
  width: 300px;
  min-height: 100vh;
  background: rgba(211, 211, 211, 0.8);  /* Grey with transparency */
  backdrop-filter: blur(15px); /* Glass blur effect */
  padding-top: 20px;
  transform: translateX(-260px);
  transition: transform 0.3s ease;
  z-index: 1000;
  color: #003366; /* Navy text color */
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 15px 0 0 15px;
}

/* Show sidebar */
.sidebar-show {
  transform: translateX(0);
}

/* Sidebar links */
.list-group-item {
  border: none;
  border-radius: 12px;
  margin: 6px 10px;
  transition: 0.25s ease;
  background: rgba(255, 255, 255, 0.1);  /* Subtle background for items */
  color: #003366 !important; /* Ensures navy text color */
}

.list-group-item:hover {
  background: rgba(255, 255, 255, 0.3);  /* Slight hover effect */
  color: #003366 !important;
  transform: translateX(3px);
}

.list-group-item.router-link-exact-active {
  background: rgba(0, 0, 0, 0.1);  /* Darker background when active */
  font-weight: 600;
}

/* Page content */
.page-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(
    rgba(24, 40, 72, 0.85),
    rgba(75, 108, 183, 0.85)
  );
  color: #ffffff; /* White text for content */
}

/* Shifted content when sidebar open */
.content-shift {
  margin-left: 250px;
}

/* Overlay for mobile */
.overlay {
  position: fixed;
  top: 56px;  /* Navbar height */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 900;
  backdrop-filter: blur(2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 56px;
    height: calc(100vh - 56px);
    border-radius: 0;
  }

  .page-content.content-shift {
    margin-left: 0;
  }
}
</style>
