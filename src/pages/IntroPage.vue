<template>
  <div class="intro-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="content-box text-center p-5 shadow-lg" v-if="!showVideo">
      <h1 class="intro-title mb-3">
        <i class="bi bi-briefcase-fill me-2"></i> ModernTech HR Portal
      </h1>
      <p class="intro-subtitle mb-5">HUMAN RESOURCES STUDIO</p>
      
      <button class="btn btn-intro-primary" @click="goToLogin">
        Sign In to HR Portal <i class="bi bi-box-arrow-in-right ms-2"></i>
      </button>
    </div>

    <!-- Loading Video Overlay -->
    <div v-if="showVideo" class="video-overlay d-flex justify-content-center align-items-center">
      <video 
        ref="loadingVideo" 
        :src="videoSrc" 
        autoplay 
        muted 
        playsinline 
        @ended="videoEnded"
        class="loading-video"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import loadingVideoFile from "@/assets/Hailuo_Video_454780089505865728.mp4";

const router = useRouter();
const showVideo = ref(false);
const videoSrc = loadingVideoFile;

function goToLogin() {
  showVideo.value = true;

  // Optional fallback: navigate after 8 seconds if video doesn't fire "ended"
  setTimeout(() => {
    if (showVideo.value) {
      videoEnded();
    }
  }, 8000); // adjust based on video duration
}

function videoEnded() {
  router.push("/login");
}
</script>


<style scoped>
.intro-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.intro-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.25);
  z-index: 2;
}

.content-box {
  position: relative;
  z-index: 3;
  max-width: 550px;
  width: 90%;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.3);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
}

/* Video Overlay */
/* Video Overlay */
.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;       /* black background behind video */
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Make the video fill full screen */
.loading-video {
  width: 100%;
  height: 100%;
  object-fit: cover;       /* ensures the video covers entire area without stretching */
}
</style>
