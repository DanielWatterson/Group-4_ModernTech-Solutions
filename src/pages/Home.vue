/* Home.vue */
/* This is the default page that the user will see but will also be able to link back to from any other tabs. */

<template>
  <div class="text-center mt-5">
    <h1>Welcome to ModernTech HR</h1>
    <p>Your all-in-one HR management system! :D</p>
    <router-link to="/dashboard" class="btn btn-primary mt-3">Go to Dashboard</router-link>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>


