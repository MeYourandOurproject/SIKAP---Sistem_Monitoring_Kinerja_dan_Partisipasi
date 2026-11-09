<!-- Mobile Bottom Navigation -->
<template>
  <div class="mobile-bottom-nav">
    <router-link
      to="/kepala-sekolah/dashboard"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-grid-fill"></i>
      <span>Dashboard</span>
    </router-link>

    <router-link
      to="/kepala-sekolah/kbm/realtime"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-activity"></i>
      <span>KBM</span>
    </router-link>

    <router-link
      to="/kepala-sekolah/aktivitas-piket"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-calendar2-check"></i>
      <span>Kegiatan & Piket</span>
    </router-link>

    <!-- <router-link
      to="/kepala-sekolah/profile"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-person-fill"></i>
      <span>Profil</span>
    </router-link> -->
  </div>
</template>

<style scoped>
/* MOBILE BOTTOM NAV */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 9999;
  padding: 6px 10px env(safe-area-inset-bottom);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 11px;
  transition: 0.2s ease;
}

.bottom-nav-item i {
  font-size: 20px;
}

.bottom-nav-item.active {
  color: #22c55e;
}

.bottom-nav-item.active i {
  transform: translateY(-2px);
}

/* AGAR CONTENT TIDAK KETUTUP NAV */
@media (max-width: 768px) {
  body {
    padding-bottom: 80px;
  }
}
</style>
