/* This employee page will display a list of employees within the business and their positions. */
/* This file imports data from a .json file called employees.json */

<template>
  <div>
    <h2>Employees</h2>

    <ul class="list-group mt-3">
      <li
        v-for="employee in employees"
        :key="employee.employeeId"
        class="list-group-item"
      >
        <strong>{{ employee.name }}</strong><br>
        Position: {{ employee.position }}<br>
        Department: {{ employee.department }}
      </li>
    </ul>
  </div>
</template>

<script>
import employeeData from '../data/employee_info.json';

export default {
  name: "Employees",

  data() {
    return {
      employees: employeeData.employeeInformation
    };
  }
};
</script>
