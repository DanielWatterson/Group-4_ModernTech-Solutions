<template>
  <div class="login-page">
    <div class="container-fluid">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-lg-5 col-md-8">
          <!-- Login Card -->
          <div class="card border-0 shadow-lg">
            <div class="card-body p-5">
              <!-- Logo/Title Section -->
              <div class="text-center mb-5">
                <div class="mb-4">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-people-fill fs-2 text-primary"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-dark mb-2">HR Portal Login</h2>
                <p class="text-muted">Sign in to access your HR management system</p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="login">
                <div class="mb-4">
                  <label for="email" class="form-label fw-medium text-dark mb-2">
                    <i class="bi bi-envelope me-1"></i>Email Address
                  </label>
                  <input 
                    v-model="email" 
                    type="email" 
                    class="form-control form-control-lg" 
                    id="email"
                    placeholder="Enter your email address"
                    required
                    :disabled="loading"
                  />
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-medium text-dark mb-2">
                    <i class="bi bi-lock me-1"></i>Password
                  </label>
                  <input 
                    v-model="password" 
                    type="password" 
                    class="form-control form-control-lg" 
                    id="password"
                    placeholder="Enter your password"
                    required
                    :disabled="loading"
                  />
                </div>

                <div class="mb-4 form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="rememberMe" 
                    v-model="rememberMe"
                    :disabled="loading"
                  />
                  <label class="form-check-label text-muted" for="rememberMe">
                    Remember me
                  </label>
                </div>

                <!-- Login Button -->
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100 mb-4" 
                  :disabled="loading"
                >
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Signing in...
                  </span>
                  <span v-else>
                    <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </span>
                </button>

                <!-- Error Message -->
                <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                  <button type="button" class="btn-close" @click="error = ''"></button>
                </div>
              </form>

              <!-- Test Login Section -->
              <div class="mt-5 pt-4 border-top">
                <h6 class="text-dark fw-medium mb-3">
                  <i class="bi bi-person-check me-2 text-primary"></i>Test Login
                </h6>
                <p class="text-muted small mb-3">
                  Use these credentials to test the application:
                </p>
                
                <div class="card border h-100">
                  <div class="card-body p-4">
                    <div class="row align-items-center">
                      <div class="col-md-8">
                        <div class="d-flex align-items-center mb-3">
                          <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" 
                               style="width: 50px; height: 50px;">
                            <i class="bi bi-person-fill text-primary fs-4"></i>
                          </div>
                          <div>
                            <h6 class="fw-bold mb-1">Serena McCoy</h6>
                            <p class="text-muted mb-0">
                              <i class="bi bi-briefcase me-1"></i>HR Manager • Human Resources
                            </p>
                          </div>
                        </div>
                        
                        <div class="row">
                          <div class="col-6">
                            <div class="mb-3">
                              <small class="text-muted d-block mb-1">Email:</small>
                              <div class="fw-medium text-dark">SerenaMC@moderntech.com</div>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="mb-3">
                              <small class="text-muted d-block mb-1">Password:</small>
                              <div class="fw-medium text-dark">admin123</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="col-md-4 text-md-end">
                        <button 
                          class="btn btn-outline-primary btn-lg w-100"
                          @click="useTestCredentials"
                        >
                          <i class="bi bi-rocket-takeoff me-1"></i>Use Credentials
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <p class="text-muted small mb-0">
                    <i class="bi bi-info-circle me-1"></i>
                    This is a valid user from the SQL database. Use any user from the 'users' table.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)

onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberedEmail')
  if (rememberedEmail) {
    email.value = rememberedEmail
    rememberMe.value = true
  }
})

// Function to use test credentials
function useTestCredentials() {
  email.value = 'SerenaMC@moderntech.com'
  password.value = 'admin123'
  error.value = ''
  
  // Auto-submit after a short delay
  setTimeout(() => {
    document.querySelector('form').dispatchEvent(new Event('submit'))
  }, 100)
}

// Login function
async function login() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email: email.value,
      password: password.value
    })

    if (response.data.success) {
      const user = response.data.data
      
      // Save login session
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('userName', user.name)
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userDepartment', user.department)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userAvatar', user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d6efd&color=fff`)
      localStorage.setItem('userId', user.id)
      
      // Remember email if checkbox is checked 
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', user.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // Redirect to home
      router.push('/home')
    } else {
      error.value = response.data.message || 'Login failed. Please check your credentials.'
    }
  } catch (err) {
    console.error('Login error:', err)
    
    if (err.response) {
      error.value = err.response.data?.message || `Error: ${err.response.status}`
    } else if (err.request) {
      error.value = 'Cannot connect to server. Make sure backend is running on port 5000.'
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
}

.card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.form-control-lg {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 12px 16px;
  font-size: 1rem;
}

.form-control-lg:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-lg {
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  transform: translateY(-1px);
}

.btn-outline-primary {
  color: #0d6efd;
  border-color: #0d6efd;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

/* Test card styling */
.card.border {
  border-radius: 10px;
  border-color: #dee2e6;
  background-color: #f8f9fa;
}

.card.border:hover {
  border-color: #0d6efd;
  background-color: white;
}

/* Alert styling */
.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
  border-radius: 8px;
}

/* Form check styling */
.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Text colors */
.text-primary {
  color: #0d6efd !important;
}

.text-muted {
  color: #6c757d !important;
}

/* Background opacity classes */
.bg-primary.bg-opacity-10 {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 2rem !important;
  }
  
  .col-lg-5 {
    padding: 0 15px;
  }
  
  .btn-outline-primary.btn-lg {
    margin-top: 1rem;
  }
}
</style>