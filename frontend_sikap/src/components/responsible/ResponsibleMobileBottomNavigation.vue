<template>
  <nav class="mobile-bottom-nav" aria-label="Navigasi penanggung jawab">
    <router-link
      to="/penanggung-jawab/dashboard"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-grid-fill"></i>
      <span>Dashboard</span>
    </router-link>

    <router-link
      to="/penanggung-jawab/kbm/realtime"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-journal-text"></i>
      <span>KBM</span>
    </router-link>

    <router-link
      to="/penanggung-jawab/kegiatan"
      class="bottom-nav-item"
      :class="{
        active:
          $route.path.startsWith('/penanggung-jawab/kegiatan') ||
          $route.path.startsWith('/penanggung-jawab/absensi'),
      }"
    >
      <i class="bi bi-calendar-event-fill"></i>
      <span>Kegiatan</span>
    </router-link>

    <span class="bottom-nav-item disabled" aria-disabled="true">
      <i class="bi bi-gear-fill"></i>
      <span>Pengaturan</span>
    </span>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: space-around;
  padding: 6px 10px env(safe-area-inset-bottom);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(12px);
}

.bottom-nav-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 11px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.bottom-nav-item i {
  font-size: 18px;
}

.bottom-nav-item.active {
  color: #22c55e;
}

.bottom-nav-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
