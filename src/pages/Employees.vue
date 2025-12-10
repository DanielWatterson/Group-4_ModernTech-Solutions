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
import employeeData from "@/data/employee_info.json";

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

<style scoped>
/* Employees page container */
.container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)),
              url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') 
              center/cover no-repeat;
  color: #fff;
}

/* Page Header */
h2.fw-bold {
  color: #fff;
  margin-bottom: 20px;
}

/* Filters */
.form-control, .form-select {
  background: rgba(87, 150, 240, 0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: 0.3s ease;
}

.form-control::placeholder {
  color: rgba(255,255,255,0.7);
}

.form-select:focus {
  background: rgba(255,255,255,0.15);
  border-color: #6c63ff;
  color: #fff;
  outline: none;
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.4);
}

/* Dropdown options styling */
.form-select option {
  background: rgba(24, 40, 72, 0.9); /* dark background for readability */
  color: #fff;                        /* white text */
}

/* Employee Cards */
.hover-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 25px 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.15);
}

/* Employee text */
.hover-card h5 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.hover-card p {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
}

/* Department Badge */
.badge {
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transition: 0.2s ease;
}

/* Department badge colors */
.badge.bg-primary { background: rgba(108, 99, 255, 0.4); color: #fff; }
.badge.bg-danger { background: rgba(255, 72, 72, 0.4); color: #fff; }
.badge.bg-warning { background: rgba(255, 196, 0, 0.4); color: #000; }
.badge.bg-success { background: rgba(72, 255, 99, 0.4); color: #000; }
.badge.bg-info { background: rgba(0, 183, 255, 0.4); color: #000; }
.badge.bg-secondary { background: rgba(128, 128, 128, 0.4); color: #fff; }
.badge.bg-dark { background: rgba(50, 50, 50, 0.4); color: #fff; }

/* Salary */
.salary {
  font-weight: 600;
}

/* Salary colors */
.text-success { color: #4caf50 !important; }
.text-warning { color: #ffb74d !important; }
.text-danger { color: #e57373 !important; }

/* Select Dropdown */
.form-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 12px;
  transition: 0.3s ease;
}

.form-select:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #6c63ff;
  outline: none;
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.4);
}

/* Focus states */
.form-control:focus,
.form-select:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #6c63ff;
  outline: none;
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
    gap: 15px;
  }
}

</style>
