<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">ModernTech HR Web</a>
      </div>
    </nav>

  <!--- This section contains the sidebar and page content in a responsive layout - the row and columns --->
    <div class="container mt-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-12 col-md-3 mb-3">
          <div class="list-group sidebar">
            <router-link to="/" class="list-group-item list-group-item-action">Home</router-link>
            <router-link to="/dashboard" class="list-group-item list-group-item-action">Dashboard</router-link>
            <router-link to="/employees" class="list-group-item list-group-item-action">Employees</router-link>
            <router-link to="/timeoff" class="list-group-item list-group-item-action">Time Off</router-link>
            <router-link to="/payroll" class="list-group-item list-group-item-action">Payroll</router-link>
            <router-link to="/performance" class="list-group-item list-group-item-action">Performance</router-link>
          </div>
        </div>

        <!-- Page Content -->
        <div class="col-12 col-md-9">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}
</style>
