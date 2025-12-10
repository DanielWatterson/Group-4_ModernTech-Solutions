<template>
  <div class="container mt-4">
    <h2 class="mb-3">Employee Performance Reviews</h2>
    <p class="text-muted">
      Track employee performance, review periods, and feedback from managers.
    </p>

    <div v-if="reviews.length === 0" class="alert alert-info mt-4">
      No performance reviews available yet.
    </div>

    <!-- Review Cards for employees -->
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
      reviews: performanceJSON   
    };
  }
};
</script>

<style scoped>
/* Full-page container with background image + gradient overlay */
.container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;
  background: linear-gradient(rgba(24, 40, 72, 0.6), rgba(75, 108, 183, 0.6)),
              url('https://images.unsplash.com/photo-1606778303077-3780ea8d5420?q=80&w=1170&auto=format&fit=crop') 
              center/cover no-repeat;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: fadeIn 0.8s ease-out;
}

/* Fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Headers */
h2 {
  color: #ffffff;
  font-weight: 700;
}

p.text-muted {
  color: rgba(255, 255, 255, 0.85);
}

/* Review Cards */
.card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: #fff;
  transition: 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
  background: rgba(255, 255, 255, 0.15);
}

.card-title {
  color: #fff;
  font-weight: 600;
}

.text-muted {
  color: rgba(255,255,255,0.7);
}

/* Buttons */
.btn-primary {
  background: #6c63ff;
  border: none;
  transition: 0.3s ease;
}

.btn-primary:hover {
  background: #5548c8;
  transform: translateY(-2px);
}

/* Alerts */
.alert-info {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    text-align: center;
  }
}
</style>
