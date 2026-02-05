<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showSidebar = ref(false)
const isDesktop = ref(true)

const isLoginPage = computed(() => route.path === '/' || route.path === '/login')

// User data from localStorage
const userName = ref('')
const userRole = ref('')
const userAvatar = ref('')

function updateUserData() {
  userName.value = localStorage.getItem('userName') || 'Guest'
  userRole.value = localStorage.getItem('userRole') || ''
  userAvatar.value = localStorage.getItem('userAvatar') || 'https://ui-avatars.com/api/?name=User&background=0d6efd&color=fff'
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  updateUserData()
  
  // Listen for storage changes (login/logout)
  window.addEventListener('storage', updateUserData)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('storage', updateUserData)
})

function handleResize() {
  const breakpoint = 992
  isDesktop.value = window.innerWidth >= breakpoint
  showSidebar.value = false
}

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function closeSidebarIfMobile() {
  if (!isDesktop.value) {
    showSidebar.value = false
  }
}

function logout() {
  localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div class="container-fluid px-3">
        <button v-if="!isLoginPage" class="btn btn-light border me-3" @click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>

        <a class="navbar-brand fw-bold text-primary" href="#">
          <i class="bi bi-building me-2"></i>ModernTech HR
        </a>

        <div v-if="!isLoginPage" class="ms-auto d-flex align-items-center">
          <div class="text-end me-3 d-none d-md-block">
            <div class="fw-medium text-dark">{{ userName }}</div>
            <small class="text-muted">{{ userRole }}</small>
          </div>
          <div class="dropdown">
            <a href="#" class="d-block text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
              <img :src="userAvatar" alt="Avatar" class="rounded-circle border" width="36" height="36" />
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" @click="logout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="showSidebar && !isDesktop" class="sidebar-overlay" @click="toggleSidebar"></div>

    <div class="main-wrapper">
      <div v-if="!isLoginPage" :class="['sidebar', { 'sidebar-visible': showSidebar }]">
        <div class="sidebar-header p-4 border-bottom">
          <h5 class="mb-0 text-dark">Navigation</h5>
        </div>
        <div class="sidebar-menu p-3">
          <router-link to="/home" class="sidebar-item" @click="closeSidebarIfMobile">
            <i class="bi bi-house me-3"></i>Home
          </router-link>
          <router-link to="/dashboard" class="sidebar-item" @click="closeSidebarIfMobile">
            <i class="bi bi-speedometer2 me-3"></i>Dashboard
          </router-link>
          <router-link to="/employees" class="sidebar-item" @click="closeSidebarIfMobile">
            <i class="bi bi-people me-3"></i>Employees
          </router-link>
          <router-link to="/timeoff" class="sidebar-item" @click="closeSidebarIfMobile">
            <i class="bi bi-calendar-event me-3"></i>Time Off
          </router-link>
          <router-link to="/payroll" class="sidebar-item" @click="closeSidebarIfMobile">
            <i class="bi bi-cash-coin me-3"></i>Payroll
          </router-link>
          <router-link to="/performance" class="sidebar-item" @click="closeSidebarIfMobile">
            <i class="bi bi-graph-up me-3"></i>Performance
          </router-link>
        </div>
      </div>

      <div :class="['main-content', { 'sidebar-active': showSidebar && isDesktop }]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your existing CSS styles remain the same */
.main-wrapper {
  display: flex;
  min-height: calc(100vh - 56px);
}

.navbar {
  height: 56px;
  z-index: 1030;
}

.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e9ecef;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  position: fixed;
  top: 56px;
  bottom: 0;
  left: 0;
  z-index: 1020;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar-visible {
  transform: translateX(0);
}

.sidebar-header {
  background: #f8f9fa;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-item {
  padding: 12px 16px;
  color: #495057;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.sidebar-item:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.sidebar-item.router-link-exact-active {
  background-color: #e7f1ff;
  color: #0d6efd;
  font-weight: 500;
  border-left: 4px solid #0d6efd;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 56px);
  transition: margin-left 0.3s ease;
}

.sidebar-active {
  margin-left: 250px;
}

.sidebar-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1015;
  backdrop-filter: blur(2px);
}

@media (max-width: 992px) {
  .sidebar-active {
    margin-left: 0;
  }
}
</style>