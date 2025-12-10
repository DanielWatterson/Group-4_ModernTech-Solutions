  <template>
    <div id="app">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <button v-if="!isLoginPage" class="btn btn-outline-secondary me-3" @click="toggleSidebar">
            ☰
          </button>

          <a class="navbar-brand" href="#">ModernTech HR Web</a>

          <div v-if="!isLoginPage" class="ms-auto d-flex align-items-center">
            <img :src="userAvatar" alt="Avatar" class="rounded-circle me-2" width="36" height="36" />
            <span class="me-3">{{ userName }}</span>
            <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
          </div>
        </div>
      </nav>

      <div v-if="showSidebar && !isDesktop" class="overlay" @click="toggleSidebar"></div>

      <div class="main-layout">
        <div v-if="!isLoginPage" :class="['sidebar', { 'sidebar-show': showSidebar }]">
          <div class="list-group mt-3">
            <router-link to="/home" class="list-group-item list-group-item-action">Home</router-link>
            <router-link to="/dashboard" class="list-group-item list-group-item-action"
              >Dashboard</router-link
            >
            <router-link to="/employees" class="list-group-item list-group-item-action"
              >Employees</router-link
            >
            <router-link to="/timeoff" class="list-group-item list-group-item-action"
              >Time Off</router-link
            >
            <router-link to="/payroll" class="list-group-item list-group-item-action"
              >Payroll</router-link
            >
            <router-link to="/performance" class="list-group-item list-group-item-action"
              >Performance</router-link
            >
          </div>
        </div>

        <div :class="['page-content', { 'content-shift': showSidebar && isDesktop }]">
          <router-view />
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // STATE MANAGEMENT
  const showSidebar = ref(false)
  const isDesktop = ref(true)

  // COMPUTED PROPERTIES
  const isLoginPage = computed(() => route.path === '/' || route.path === '/login')

  // USER DATA
  const userName = ref(localStorage.getItem('userName') || '')
  const userAvatar = ref(localStorage.getItem('userAvatar') || '')

  // HOOKS
  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    // Listener to update user info after a successful login (if triggered elsewhere)
    window.addEventListener('userChanged', updateUserDisplay)
  })

  // METHODS
  function handleResize() {
    const breakpoint = 768
    isDesktop.value = window.innerWidth >= breakpoint
    // Automatically show sidebar on desktop sizes
    if (isDesktop.value) showSidebar.value = true
  }

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  function updateUserDisplay() {
    userName.value = localStorage.getItem('userName') || ''
    userAvatar.value = localStorage.getItem('userAvatar') || ''
  }

  function logout() {
    localStorage.clear()
    userName.value = ''
    userAvatar.value = ''
    router.push('/login')
  }
  </script>

  <style scoped>
  /* The main layout container uses flex to handle the content area */
  .main-layout {
    display: flex;
    margin-top: 0;
    position: relative;
    width: 100%;
    overflow-x: hidden;
  }

  .navbar {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    z-index: 1100;
    color: #003366;
  }

  .navbar-brand {
    font-weight: 700;
    color: #003366;
  }

  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;

    width: 300px;
    min-height: 100vh;
    background: rgba(211, 211, 211, 0.8);
    backdrop-filter: blur(15px);
    padding-top: 20px;

    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    color: #003366;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 15px 0 0 15px;
  }

  .sidebar-show {
    transform: translateX(0);
  }

  .list-group-item {
    border: none;
    border-radius: 12px;
    margin: 6px 10px;
    transition: 0.25s ease;
    background: rgba(255, 255, 255, 0.1);
    color: #003366 !important;
    max-width: 280px; 
  }

  .list-group-item:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #003366 !important;
    transform: translateX(3px);
  }

  .list-group-item.router-link-exact-active {
    background: rgba(0, 0, 0, 0.1);
    font-weight: 600;
  }

  .page-content {
    flex-grow: 1;
    transition: padding-left 0.3s ease;
    padding: 20px;
    padding-left: 20px;
    min-height: 100vh;
    background: linear-gradient(rgba(24, 40, 72, 0.85), rgba(75, 108, 183, 0.85));
    color: #ffffff;
  }

  .content-shift {
    padding-left: 320px;
  }

  .overlay {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 900;
    backdrop-filter: blur(2px);
  }

  @media (max-width: 768px) {
    .sidebar {
      top: 56px;
      height: calc(100vh - 56px);
      border-radius: 0;
    }

    .page-content {
      padding-left: 20px !important;
    }
  }
  </style>
