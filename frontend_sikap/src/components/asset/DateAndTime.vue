<template>
<!-- TIME AND DATE -->

      <div class="row mt-3 mb-4">
        <div class="col-12">
          <div class="datetime-bar">
            <div class="datetime-item">
              <i class="bi bi-calendar-week"></i>
              <span>{{ dayName }}</span>
            </div>

            <div class="divider"></div>

            <div class="datetime-item">
              <i class="bi bi-calendar3"></i>
              <span>{{ fullDate }}</span>
            </div>

            <div class="divider"></div>

            <div class="datetime-item">
              <i class="bi bi-clock"></i>
              <span class="fw-bold">{{ currentTime }}</span>
            </div>
          </div>
        </div>
      </div>
      </template>

      <script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const now = ref(new Date());

const dayName = computed(() =>
  now.value.toLocaleDateString("id-ID", {
    weekday: "long",
  }),
);

const fullDate = computed(() =>
  now.value.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
);

const currentTime = computed(() =>
  now.value.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);

let timer;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.datetime-bar {
  /* background: rgba(255, 255, 255, 0.08); */
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  /* border-radius: 14px; */
  padding: 12px 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.datetime-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 0.95rem;
}

.datetime-item i {
  color: #60a5fa;
}

.divider {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .datetime-bar {
    padding: 10px 12px;
  }

  .datetime-item {
    font-size: 0.82rem;
    gap: 5px;
  }

  .divider {
    margin: 0 6px;
  }
}</style>