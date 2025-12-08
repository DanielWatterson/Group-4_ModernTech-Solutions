<template>
  <div class="container mt-4">
    <h2 class="mb-3">Employee Performance Reviews</h2>
    <p class="text-muted">
      Track employee performance, review periods, and feedback from managers.
    </p>

    <div v-if="reviews.length === 0" class="alert alert-info mt-4">
      No performance reviews available yet.
    </div>

    <!-- Review Cards (once we add them) -->
    <div class="row mt-4">
      <div class="col-md-4" v-for="review in reviews" :key="review.id">
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ review.employeeName }}</h5>
            <p class="text-muted">{{ review.department }}</p>

            <div class="d-flex justify-content-between">
              <span><strong>Score:</strong></span>
              <span>{{ review.score }}</span>
            </div>

            <div class="d-flex justify-content-between">
              <span><strong>Status:</strong></span>
              <span>{{ review.status }}</span>
            </div>

            <router-link
              :to="`/performance/${review.id}`"
              class="btn btn-primary btn-sm mt-3"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import performanceJSON from "../data/performance_info.json";

export default {
  name: "Performance",
  data() {
    return {
      reviews: performanceJSON   // ← This is the correct value
    };
  }
};
</script>

