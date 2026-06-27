<template>
  <div class="sidebar-wrapper" :class="{ open: isOpen }">
    <div
      v-if="isOpen"
      class="sidebar-overlay d-lg-none"
      @click="closeSidebar"
    ></div>

    <aside class="sidebar">
      <div class="sidebar-top px-4 py-4">
        <div class="row d-flex align-items-center justify-content-center">
          <div class="col-4">
            <img
              src="../../assets/sikap_logo.PNG"
              alt="Sikap Logo"
              class="logo-white"
            />
          </div>
          <div class="col-8 text-start">
            <small>
              <span class="fs-3 fw-bold text-success">S I K A P</span><br />
              <span class="text-secondary"
                >Sistem Informasi Kinerja & Partisipasi</span
              >
            </small>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav px-2 py-3">
        <ul class="nav flex-column text-white">
          <li class="nav-item">
            <router-link
              to="/ketua-murid/dashboard"
              class="nav-link"
              :class="{ active: isActive('/ketua-murid/dashboard') }"
              @click="closeSidebar"
            >
              <i class="bi bi-grid-fill text-white"></i>
              <span class="text-white">Dashboard</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/ketua-murid/validasi"
              class="nav-link"
              :class="{ active: isActive('/ketua-murid/validasi') }"
              @click="closeSidebar"
            >
              <i class="bi bi-check2-square text-white"></i>
              <span class="text-white">Validasi Guru</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/ketua-murid/laporan"
              class="nav-link"
              :class="{ active: isActive('/ketua-murid/laporan') }"
              @click="closeSidebar"
            >
              <i class="bi bi-journal-text text-white"></i>
              <span class="text-white">Laporan</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  name: "StudentSidebar",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeSidebar() {
      this.$emit("close-sidebar");
    },
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>

<style scoped>
.sidebar-wrapper {
  position: relative;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1040;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 290px;
  box-sizing: border-box;
  color: #e7f5e7;
  border-right: 3px solid rgba(166, 255, 175, 0.12);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1050;
  background-color: #0f172a;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(231, 245, 231, 0.95);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(16, 185, 129, 0.18);
  color: #f8fafc;
}

.nav-link.active i,
.nav-link:hover i {
  color: #a7f3d0;
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-wrapper.open .sidebar {
    transform: translateX(0);
  }
}

.logo-white {
  width: 70px; /* opsional, biar rapi */
  /* filter: brightness(0) invert(1); */
}
</style>
