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

/* Sidebar */
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 20px;
  transform: translateX(-260px);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-show {
  transform: translateX(0);
}

/* Page content shifts when sidebar is open on desktop */
.page-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  padding: 20px;
}

.content-shift {
  margin-left: 250px;
}

/* Overlay for mobile */
.overlay {
  position: fixed;
  top: 56px; /* navbar height */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 900;
}

/* Sidebar links */
.list-group-item {
  border: none;
  border-radius: 0;
}
</style>
