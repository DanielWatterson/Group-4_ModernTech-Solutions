<template>
  <div class="container py-4">

    <div class="row justify-content-center">
      <div class="col-lg-11">

        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold">Employees</h2>
        </div>

        <!-- Filters -->
        <div class="d-flex gap-3 mb-4">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search by name or position..."
            v-model="searchQuery"
          />

          <select class="form-select w-25" v-model="selectedDepartment">
            <option value="">All Departments</option>
            <option 
              v-for="dept in uniqueDepartments" 
              :key="dept" 
              :value="dept"
            >
              {{ dept }}
            </option>
          </select>
        </div>

        <!-- Employee Cards -->
        <div class="row g-4">
          <div 
            class="col-md-6" 
            v-for="employee in filteredEmployees" 
            :key="employee.employeeId"
          >
            <div class="border rounded p-3 shadow-sm hover-card">

              <!-- Name & Position -->
              <h5 class="fw-bold mb-1">{{ employee.name }}</h5>
              <p class="text-muted mb-1">{{ employee.position }}</p>

              <!-- Department Badge -->
              <p class="mb-1">
                <strong>Department:</strong>
                <span :class="['badge', departmentBadge(employee.department)]">
                  {{ employee.department }}
                </span>
              </p>

              <!-- Salary with Status Color -->
              <p class="mb-1">
                <strong>Salary:</strong>
                <span :class="['fw-bold', salaryColor(employee.salary)]">
                  R{{ employee.salary }}
                </span>
              </p>

              <!-- Contact -->
              <p class="mb-1"><strong>Email:</strong> {{ employee.contact }}</p>

              <!-- History -->
              <p class="mb-0 text-muted small">{{ employee.employmentHistory }}</p>

            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import employeeData from "../data/employee_info.json";

export default {
  name: "Employees",

  data() {
    return {
      searchQuery: "",
      selectedDepartment: "",
      employees: employeeData.employeeInformation
    };
  },

  computed: {
    uniqueDepartments() {
      return [...new Set(this.employees.map(e => e.department))];
    },

    filteredEmployees() {
      return this.employees.filter(employee => {
        const matchesSearch =
          employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          employee.position.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesDept =
          this.selectedDepartment === "" ||
          employee.department === this.selectedDepartment;

        return matchesSearch && matchesDept;
      });
    }
  },

  methods: {
    departmentBadge(dept) {
      const colors = {
        Development: "bg-primary",
        HR: "bg-danger",
        QA: "bg-warning text-dark",
        Sales: "bg-success",
        Marketing: "bg-info text-dark",
        Design: "bg-secondary",
        IT: "bg-dark",
        Finance: "bg-success",
        Support: "bg-primary"
      };
      return colors[dept] || "bg-secondary";
    },

    salaryColor(salary) {
      if (salary >= 70000) return "text-success";
      if (salary >= 60000) return "text-warning";
      return "text-danger";
    }
  }
};
</script>
