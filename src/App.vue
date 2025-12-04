<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">ModernTech HR</a>
      </div>
    </nav>

    <!-- Main Layout -->
    <div class="container mt-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-12 col-md-3 mb-3">
          <div class="list-group">
            <button class="list-group-item list-group-item-action">Dashboard</button>
            <button class="list-group-item list-group-item-action">Employees</button>
            <button class="list-group-item list-group-item-action">Time Off</button>
            <button class="list-group-item list-group-item-action">Payroll</button>
            <button class="list-group-item list-group-item-action">Performance</button>
          </div>
        </div>

        <!-- Page Content Goes here -->
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

<style>
/* Add Styling here for later use */
</style>
