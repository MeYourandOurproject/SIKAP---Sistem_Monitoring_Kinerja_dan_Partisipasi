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
              to="/super-admin/teacher"
              class="nav-link"
              :class="{ active: isActive('/super-admin/teacher') }"
              @click="closeSidebar"
            >
              <i class="bi bi-person-fill text-white"></i>
              <span class="text-white">Manajemen Guru</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/schedule"
              class="nav-link"
              :class="{ active: isActive('/super-admin/schedule') }"
              @click="closeSidebar"
            >
              <i class="bi bi-calendar-check-fill text-white"></i>
              <span class="text-white">Jadwal Pelajaran</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/user"
              class="nav-link"
              :class="{ active: isActive('/super-admin/user') }"
              @click="closeSidebar"
            >
              <i class="bi bi-people-fill text-white"></i>
              <span class="text-white">Manajemen Pengguna</span>
            </router-link>
          </li>

          <li class="nav-item">
            <button
              class="nav-link w-100 border-0 text-start"
              :class="{ active: isClassesRoute }"
              type="button"
              :aria-expanded="classesMenuOpen"
              @click="classesMenuOpen = !classesMenuOpen"
            >
              <i class="bi bi-building-fill text-white"></i>
              <span class="text-white flex-grow-1">Manajemen Kelas</span>
              <i
                class="bi"
                :class="classesMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'"
                aria-hidden="true"
              ></i>
            </button>
            <ul v-if="classesMenuOpen" class="nav flex-column class-submenu">
              <li class="nav-item">
                <router-link
                  to="/super-admin/classes/students"
                  class="nav-link"
                  :class="{ active: $route.path === '/super-admin/classes/students' }"
                  @click="closeSidebar"
                >
                  <i class="bi bi-person-lines-fill"></i>
                  <span>Kelola Data Siswa</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  to="/super-admin/classes/homeroom"
                  class="nav-link"
                  :class="{ active: $route.path === '/super-admin/classes/homeroom' }"
                  @click="closeSidebar"
                >
                  <i class="bi bi-person-badge"></i>
                  <span>Kelola Wali Kelas</span>
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link
              to="/super-admin/settings"
              class="nav-link"
              :class="{ active: isActive('/super-admin/settings') }"
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
  data() {
    return {
      classesMenuOpen: this.$route.path.startsWith("/super-admin/classes"),
    };
  },
  watch: {
    "$route.path"(path) {
      this.classesMenuOpen = path.startsWith("/super-admin/classes");
    },
  },
  computed: {
    isClassesRoute() {
      return this.$route.path.startsWith("/super-admin/classes");
    },
  },
  methods: {
    closeSidebar() {
      this.$emit("close-sidebar");
    },
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(`${path}/`);
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
  background: linear-gradient(180deg, #10243c 0%, #0b1729 100%);
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
  min-height: 90px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  font-size: 0.92rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav-link.active {
  background-color: rgba(34, 197, 94, 0.16);
  color: #86efac;
  font-weight: 600;
}

.nav-link.active i,
.nav-link.active span {
  color: #86efac !important;
}

.nav-link i {
  font-size: 1.2rem;
}

.class-submenu {
  margin: 0 0 8px 14px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
}

.class-submenu .nav-link {
  gap: 10px;
  padding: 10px 12px;
  font-size: 0.86rem;
}

.class-submenu .nav-link i {
  font-size: 1rem;
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
