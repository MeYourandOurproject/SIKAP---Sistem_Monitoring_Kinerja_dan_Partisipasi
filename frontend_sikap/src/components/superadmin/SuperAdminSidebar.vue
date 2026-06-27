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
            <small
              ><span class="fs-3 fw-bold text-success">S I K A P</span><br />
              <span class="text-secondary"
                >Sistem Informasi Kinerja & Partisipasi</span
              ></small
            >
          </div>
        </div>
      </div>

      <nav class="sidebar-nav px-2 py-3">
        <ul class="nav flex-column text-white">
          <li class="nav-item">
            <router-link
              to="/super-admin/dashboard"
              class="nav-link"
              :class="{ active: isActive('/super-admin/dashboard') }"
              @click="closeSidebar"
            >
              <i class="bi bi-grid-fill text-white"></i>
              <span class="text-white">Dashboard</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/guru"
              class="nav-link"
              :class="{ active: isActive('/super-admin/guru') }"
              @click="closeSidebar"
            >
              <i class="bi bi-person-fill text-white"></i>
              <span class="text-white">Manajemen Guru</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/jadwal"
              class="nav-link"
              :class="{ active: isActive('/super-admin/jadwal') }"
              @click="closeSidebar"
            >
              <i class="bi bi-calendar-check-fill text-white"></i>
              <span class="text-white">Jadwal Pelajaran</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/pengguna"
              class="nav-link"
              :class="{ active: isActive('/super-admin/pengguna') }"
              @click="closeSidebar"
            >
              <i class="bi bi-people-fill text-white"></i>
              <span class="text-white">Manajemen Pengguna</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/pengaturan"
              class="nav-link"
              :class="{ active: isActive('/super-admin/pengaturan') }"
              @click="closeSidebar"
            >
              <i class="bi bi-gear-fill text-white"></i>
              <span class="text-white">Pengaturan</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  name: "SuperAdminSidebar",
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

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background-color: #0f172a;
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 1040;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1030;
}

.sidebar-top {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-white {
  width: 100%;
  max-width: 60px;
}

.sidebar-nav {
  padding-top: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.nav-link:hover {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  transform: translateX(5px);
}

.nav-link.active {
  background-color: #22c55e;
  color: #0f172a;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.2rem;
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-wrapper.open .sidebar {
    transform: translateX(0);
  }
}

@media (min-width: 992px) {
  .sidebar {
    position: static;
    height: auto;
    min-height: 100vh;
  }

  .sidebar-overlay {
    display: none;
  }
}
</style>
