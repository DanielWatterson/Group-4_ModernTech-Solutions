import { createRouter, createWebHistory } from 'vue-router';

// Import components
import Intro from '../pages/IntroPage.vue'; 
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Dashboard from '../pages/Dashboard.vue';
import Employees from '../pages/Employees.vue';
import TimeOff from '../pages/TimeOff.vue';
import Payroll from '../pages/Payroll.vue';
import Performance from '../pages/Performance.vue';

const routes = [
  { path: '/', name: 'Intro', component: Intro },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/home', 
    name: 'Home', 
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/employees', 
    name: 'Employees', 
    component: Employees,
    meta: { requiresAuth: true }
  },
  { 
    path: '/timeoff', 
    name: 'TimeOff', 
    component: TimeOff,
    meta: { requiresAuth: true }
  },
  { 
    path: '/payroll', 
    name: 'Payroll', 
    component: Payroll,
    meta: { requiresAuth: true }
  },
  { 
    path: '/performance', 
    name: 'Performance', 
    component: Performance,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard - checks if user is logged in
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true'
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})

export default router;