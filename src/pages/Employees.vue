/* This employee page will display a list of employees within the business and their positions. */
/* This file imports data from a .json file called employees.json */

<template>
  <div>
    <h2>Employees Page</h2>
    <p>This is the employees page.</p>
  </div>

  <div>
    <ul class="list-group">
    <li v-for="employee in employees" :key="employee.id" class="list-group-item">
        {{ employee.name }} - {{ employee.position }}
    </li>
    </ul>
  </div>
</template>

<script>
import employees from '../data/employees.json';

export default {
  data() {
    return { employees };
  }
}
</script>
