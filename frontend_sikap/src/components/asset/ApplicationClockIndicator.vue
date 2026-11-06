<template>
  <div
    v-if="applicationClock.loaded && applicationClock.mode === 'simulation'"
    class="simulation-indicator"
    role="status"
  >
    <i class="bi bi-clock-history"></i>
    <span>
      Mode demo ·
      {{
        applicationClock.currentTime.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          dateStyle: "medium",
          timeStyle: "medium",
        })
      }}
      WIB
    </span>
  </div>
</template>

<script setup>
import { applicationClock } from "@/services/applicationClock";
</script>

<style scoped>
.simulation-indicator {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1080;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid #facc15;
  border-radius: 999px;
  background: #422006;
  color: #fef3c7;
  box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 576px) {
  .simulation-indicator {
    right: 0.5rem;
    bottom: 0.5rem;
    max-width: calc(100vw - 1rem);
    font-size: 0.75rem;
  }
}
</style>
