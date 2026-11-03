<template>
  <nav class="mobile-bottom-nav" aria-label="Navigasi guru">
    <RouterLink to="/guru/dashboard" class="bottom-nav-item">
      <i class="bi bi-grid-fill"></i>
      <span>Dashboard</span>
    </RouterLink>
    <RouterLink to="/guru/jadwal" class="bottom-nav-item">
      <i class="bi bi-calendar-week-fill"></i>
      <span>Jadwal</span>
    </RouterLink>
    <RouterLink to="/guru/kegiatan" class="bottom-nav-item">
      <i class="bi bi-clipboard2-check-fill"></i>
      <span>Kegiatan</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 991px) {
  .mobile-bottom-nav {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    display: flex;
    height: 72px;
    align-items: center;
    justify-content: space-around;
    padding: 6px 12px env(safe-area-inset-bottom);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
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
  }

  .bottom-nav-item.router-link-active {
    color: #4ade80;
  }

  .bottom-nav-item i {
    font-size: 18px;
  }
}
</style>
