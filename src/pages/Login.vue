<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="login-card text-center p-5 shadow-lg">
      <h3 class="login-title mb-4">HR Portal Login</h3>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label>Email</label>
          <input v-model="email" type="email" class="form-control modern-input" required />
        </div>

        <div class="mb-3">
          <label>Password</label>
          <input v-model="password" type="password" class="form-control modern-input" required />
        </div>

        <button type="submit" class="btn login-btn w-100">Login</button>

        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import usersData from '../data/user.json'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function login() {
  const user = usersData.find((u) => u.email === email.value && u.password === password.value)

  if (user) {
    localStorage.setItem('loggedIn', 'true')
    localStorage.setItem('userName', user.name)
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('userDepartment', user.department)
    localStorage.setItem('userEmail', user.email)
    localStorage.setItem('userAvatar', user.avatar)

    window.dispatchEvent(new Event('userChanged'))
    router.push('/home')
  } else {
    error.value = 'Invalid email or password.'
  }
}
</script>

<style scoped>
/* ------------------------- */
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1074&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  z-index: 2;
}

.login-card {
  position: relative;
  z-index: 3;
  max-width: 400px;
  width: 90%;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
}

/* Inputs Styling */
.modern-input {
  border-radius: 12px;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(6px);
  transition: 0.3s;
}

.modern-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.modern-input:focus {
  border-color: #3f51b5;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.3);
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* Button Styling */
.login-btn {
  background-color: #3f51b5;
  border: none;
  padding: 12px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #303f9f;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(63, 81, 181, 0.4);
}

/* Error Message */
.text-danger {
  color: #ff6b6b;
  font-weight: 500;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .login-card {
    padding: 2.5rem 1.5rem;
  }
  .login-title {
    font-size: 1.6rem;
  }
}
</style>
