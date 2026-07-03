<template>
  <div class="mobile-bottom-nav">
    <router-link
      to="/ketua-murid/dashboard"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-grid-fill"></i>
      <span>Dashboard</span>
    </router-link>

    <router-link
      to="/ketua-murid/validasi"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-check2-square"></i>
      <span>Validasi</span>
    </router-link>

    <router-link
      to="/ketua-murid/laporan"
      class="bottom-nav-item"
      active-class="active"
    >
      <i class="bi bi-journal-text"></i>
      <span>Laporan</span>
    </router-link>
  </div>
</template>

<style scoped>
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

.bottom-nav-item.active {
  color: #22c55e;
}

.bottom-nav-item i {
  font-size: 18px;
}

.bottom-nav-item span {
  font-size: 11px;
}
</style>
