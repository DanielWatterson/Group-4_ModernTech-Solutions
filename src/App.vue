<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showSidebar = ref(false)
const isDesktop = ref(true)
const pageLoading = ref(false)

// Check if current page should hide header
const hideHeader = computed(() => {
  const hidePaths = ['/', '/intro', '/login']
  return hidePaths.includes(route.path)
})

// User data from localStorage
const userName = ref('')
const userRole = ref('')
const userAvatar = ref('')
const isLoggedIn = ref(false)

function updateUserData() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'
  isLoggedIn.value = loggedIn
  
  if (loggedIn) {
    userName.value = localStorage.getItem('userName') || ''
    userRole.value = localStorage.getItem('userRole') || ''
    userAvatar.value = localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=0d6efd&color=fff`
  } else {
    userName.value = ''
    userRole.value = ''
    userAvatar.value = ''
  }
}

// Check authentication function
function checkAuth() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'
  const hidePaths = ['/', '/intro', '/login']
  
  // Update login state
  isLoggedIn.value = loggedIn
  
  // If not logged in and trying to access protected route, redirect to login
  if (!loggedIn && !hidePaths.includes(route.path)) {
    router.push('/login')
  }
  
  // Update user data
  updateUserData()
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // Initial check
  checkAuth()
  
  // Listen for storage changes
  window.addEventListener('storage', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('storage', checkAuth)
})

// Watch for route changes to show loading
let routeChangeTimeout
watch(() => route.path, (to, from) => {
  if (from && to !== from) {
    // Show loading for route changes (except initial load)
    pageLoading.value = true
    
    // Hide loading after 300ms (minimum loading time for smooth UX)
    clearTimeout(routeChangeTimeout)
    routeChangeTimeout = setTimeout(() => {
      pageLoading.value = false
    }, 300)
  }
})

// Initial page load
onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 500)
})

// Watch for route changes to check auth
watch(() => route.path, () => {
  checkAuth()
})

// Watch for localStorage changes
const originalSetItem = localStorage.setItem
const originalRemoveItem = localStorage.removeItem
const originalClear = localStorage.clear

localStorage.setItem = function(key, value) {
  originalSetItem.apply(this, arguments)
  if (key === 'loggedIn' || key === 'userName' || key === 'userRole' || key === 'userAvatar') {
    setTimeout(checkAuth, 0)
  }
}

localStorage.removeItem = function(key) {
  originalRemoveItem.apply(this, arguments)
  if (key === 'loggedIn' || key === 'userName' || key === 'userRole' || key === 'userAvatar') {
    setTimeout(checkAuth, 0)
  }
}

localStorage.clear = function() {
  originalClear.apply(this, arguments)
  setTimeout(checkAuth, 0)
}

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
  isLoggedIn.value = false
  router.push('/login')
}
</script>

<template>
  <div id="app">
    <!-- Global Page Loading Overlay -->
    <div v-if="pageLoading" class="global-loading-overlay">
      <div class="global-loading-content">
        <div class="spinner-container">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="loading-pulse-ring"></div>
        </div>
        <p class="mt-3 text-muted">Loading page...</p>
      </div>
    </div>

    <!-- Only show header if not on intro/login page AND user is logged in -->
    <nav v-if="!hideHeader && isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div class="container-fluid px-3">
        <button class="btn btn-light border me-3" @click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>

        <a class="navbar-brand fw-bold text-primary" href="#">
          <i class="bi bi-building me-2"></i>ModernTech HR
        </a>

        <div class="ms-auto d-flex align-items-center">
          <div v-if="userName" class="text-end me-3 d-none d-md-block">
            <div class="fw-medium text-dark">{{ userName }}</div>
            <small class="text-muted">{{ userRole }}</small>
          </div>
          <div class="dropdown">
            <a href="#" class="d-block text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="rounded-circle border" width="36" height="36" />
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" @click="logout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="showSidebar && !isDesktop && !hideHeader && isLoggedIn" class="sidebar-overlay" @click="toggleSidebar"></div>

    <div class="main-wrapper">
      <!-- Only show sidebar if not on intro/login page AND user is logged in -->
      <div v-if="!hideHeader && isLoggedIn" :class="['sidebar', { 'sidebar-visible': showSidebar }]">
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

      <div :class="['main-content', { 
        'sidebar-active': showSidebar && isDesktop && !hideHeader && isLoggedIn,
        'full-width': hideHeader
      }]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.main-content.full-width {
  min-height: 100vh;
  padding: 0;
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

/* Global Loading Styles */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.global-loading-content {
  text-align: center;
  animation: fadeInUp 0.4s ease;
}

.spinner-container {
  position: relative;
  display: inline-block;
}

.loading-pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(13, 110, 253, 0.3);
  border-radius: 50%;
  animation: loadingPulse 1.5s ease-out infinite;
}

@keyframes loadingPulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 992px) {
  .sidebar-active {
    margin-left: 0;
  }
}

.full-width > * {
  width: 100%;
  min-height: 100vh;
}
</style>