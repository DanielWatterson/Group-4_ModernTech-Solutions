<template>
  <div class="card shadow-sm border-0">
    <div class="card-body">
      <h5 class="fw-bold mb-3">
        {{ isEdit ? 'Update Employee' : 'Add New Employee' }}
      </h5>

      <form @submit.prevent="submitForm">
        <div class="row g-3">

          <div class="col-md-6">
            <label class="form-label">Name</label>
            <input v-model="form.name" class="form-control" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">Position</label>
            <input v-model="form.position" class="form-control" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">Department</label>
            <select v-model="form.department" class="form-select" required>
              <option value="">Select Department</option>
              <option>Development</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>QA</option>
              <option>Sales</option>
              <option>Support</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">Salary (R)</label>
            <input v-model.number="form.salary" type="number" class="form-control" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">Days Off</label>
            <input v-model.number="form.days_off" type="number" class="form-control" />
          </div>

          <div class="col-12">
            <label class="form-label">Employment History</label>
            <textarea
              v-model="form.employment_history"
              rows="3"
              class="form-control"
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Recruitment Date</label>
            <input v-model="form.recruitment_date" type="date" class="form-control" />
          </div>

        </div>

        <div class="mt-4 d-flex gap-2">
          <button class="btn btn-primary" type="submit">
            {{ isEdit ? 'Update Employee' : 'Add Employee' }}
          </button>
          <button class="btn btn-secondary" type="button" @click="$emit('cancel')">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import apiService from '@/services/api';

export default {
  props: {
    employee: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: {
        name: '',
        position: '',
        department: '',
        email: '',
        salary: null,
        employment_history: '',
        recruitment_date: '',
        days_off: 0
      }
    };
  },

  computed: {
    isEdit() {
      return !!this.employee;
    }
  },

  mounted() {
    if (this.employee) {
      this.form = { ...this.employee };
    }
  },

  methods: {
    async submitForm() {
      try {
        if (this.isEdit) {
          await apiService.updateEmployee(
            this.employee.employee_id,
            this.form
          );
        } else {
          await apiService.createEmployee(this.form);
        }

        this.$emit('saved');
      } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save employee');
      }
    }
  }
};
</script>
