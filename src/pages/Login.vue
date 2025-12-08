<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-sm p-4" style="width: 360px; border-radius: 12px;">
      <h3 class="text-center fw-bold mb-4">HR Portal Login</h3>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label>Email</label>
          <input v-model="email" type="email" class="form-control" required>
        </div>

        <div class="mb-3">
          <label>Password</label>
          <input v-model="password" type="password" class="form-control" required>
        </div>

        <button class="btn btn-primary w-100">Login</button>

        <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import usersData from "../data/user.json";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

function login() {
  const user = usersData.find(
    u => u.email === email.value && u.password === password.value
  );

  if (user) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userDepartment", user.department);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userAvatar", user.avatar);
    router.push("/home");
  } else {
    error.value = "Invalid email or password.";
  }
}
</script>
