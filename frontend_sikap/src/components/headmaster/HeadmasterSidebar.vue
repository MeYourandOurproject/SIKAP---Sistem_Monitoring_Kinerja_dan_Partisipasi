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
              to="/kepala-sekolah/dashboard"
              class="nav-link"
              :class="{ active: isActive('/kepala-sekolah/dashboard') }"
              @click="closeSidebar"
            >
              <i class="bi bi-grid-fill text-white"></i>
              <span class="text-white">Dashboard</span>
            </router-link>
          </li>

          <li class="nav-item">
            <button
              type="button"
              class="nav-link nav-menu-toggle"
              :class="{ active: $route.path.startsWith('/kepala-sekolah/kbm') }"
              :aria-expanded="kbmMenuOpen"
              aria-controls="headmaster-kbm-submenu"
              @click="toggleKbmMenu"
            >
              <i class="bi bi-journal-text text-white"></i>
              <span class="text-white">KBM</span>
              <i
                class="bi submenu-chevron"
                :class="kbmMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'"
                aria-hidden="true"
              ></i>
            </button>
            <div
              v-if="kbmMenuOpen"
              id="headmaster-kbm-submenu"
              class="kbm-submenu"
            >
              <router-link
                to="/kepala-sekolah/kbm/realtime"
                class="kbm-sub-link"
                :class="{ active: isActive('/kepala-sekolah/kbm/realtime') }"
                @click="closeSidebar"
              >
                <i class="bi bi-activity" aria-hidden="true"></i>
                Realtime Keterisian Kelas
              </router-link>
              <router-link
                to="/kepala-sekolah/kbm/riwayat"
                class="kbm-sub-link"
                :class="{ active: isActive('/kepala-sekolah/kbm/riwayat') }"
                @click="closeSidebar"
              >
                <i class="bi bi-clock-history" aria-hidden="true"></i>
                Riwayat Keterisian Kelas
              </router-link>
            </div>
          </li>

          <li class="nav-item">
            <router-link
              to="/kepala-sekolah/aktivitas-piket"
              class="nav-link"
              :class="{ active: isActive('/kepala-sekolah/aktivitas-piket') }"
              @click="closeSidebar"
            >
              <i class="bi bi-calendar2-check text-white"></i>
              <span class="text-white">Kegiatan & Piket</span>
            </router-link>
          </li>

          <!-- <li class="nav-item">
            <router-link
              to="/kepala-sekolah/penilaian"
              class="nav-link"
              :class="{ active: isActive('/kepala-sekolah/penilaian') }"
              @click="closeSidebar"
            >
              <i class="bi bi-star-fill text-white"></i>
              <span class="text-white">Penilaian</span>
            </router-link>
          </li> -->

          <!-- <li class="nav-item">
            <router-link
              to="/kepala-sekolah/pengumuman"
              class="nav-link"
              :class="{ active: isActive('/kepala-sekolah/pengumuman') }"
              @click="closeSidebar"
            >
              <i class="bi bi-megaphone-fill text-white"></i>
              <span class="text-white">Pengumuman</span>
            </router-link>
          </li> -->

          <!-- <li class="nav-item">
            <router-link
              to="/kepala-sekolah/settings"
              class="nav-link"
              :class="{ active: isActive('/kepala-sekolah/settings') }"
              @click="closeSidebar"
              style="pointer-events: none; opacity: 0.5"
            >
              <i class="bi bi-gear-fill text-white"></i>
              <span class="text-white">Pengaturan</span>
            </router-link>
          </li> -->
        </ul>
      </nav>

      <!-- <div class="sidebar-footer px-4 text-white">
        <div
          class="row d-flex align-items-center bg-white bg-opacity-10 py-2 px-3 rounded-3 justify-content-between"
        >
          <div class="col-3">
            <div class="avatar">{{ userName.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="col-7 ">
            <div class="text-start">
              <div class="fw-bold">{{ userName }}</div>
              <small>Siswa</small>
            </div>
          </div>
          <div class="col-2">
            <i class="bi bi-caret-down-fill"></i>
          </div>
        </div>
      </div> -->
    </aside>
  </div>
</template>

<script>
export default {
  name: "headmasterSidebar",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userName: "Kepala Sekolah",
      kbmMenuOpen: false,
    };
  },
  mounted() {
    this.loadUserName();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.userName = user.name || "Kepala Sekolah";
      } catch (error) {
        console.error("Error loading sidebar user:", error);
      }
    },
    closeSidebar() {
      this.$emit("close-sidebar");
    },
    toggleKbmMenu() {
      const shouldOpen = !this.kbmMenuOpen;
      this.kbmMenuOpen = shouldOpen;

      if (shouldOpen && !this.$route.path.startsWith("/kepala-sekolah/kbm")) {
        this.$router.push("/kepala-sekolah/kbm/realtime");
      }
    },
    goToProfile() {
      this.$emit("close-sidebar");
      this.$router.push("/headmaster/profile");
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
  background: #0f172a;
  color: #cbd5e1;
  border-right: 3px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1050;
  /* transform: translateX(0);
  transition: transform 0.3s ease; */
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-wrapper.open .sidebar {
    transform: translateX(0);
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  display: grid;
  place-items: center;
  font-weight: 700;
}

.sidebar-top h5,
.sidebar-top small,
.sidebar-tag,
.sidebar-footer .fw-bold,
.sidebar-footer small {
  color: #f8fafc;
}

.sidebar-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #c7d2fe;
  font-size: 0.8rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  padding: 0 0.75rem;
  margin-bottom: 0.35rem;
}

.nav-link {
  /* padding: 0.95rem 1.15rem; */
  /* margin-bottom: 0.35rem; */
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-left-color: #38bdf8;
  font-weight: 500;
}

.nav-link i {
  font-size: 1.1rem;
}

.nav-menu-toggle {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
}

.nav-menu-toggle .submenu-chevron {
  margin-left: auto;
  font-size: 0.8rem;
}

.kbm-submenu {
  display: grid;
  gap: 3px;
  margin: 4px 0 8px 26px;
  padding-left: 12px;
  border-left: 1px solid rgba(148, 163, 184, 0.2);
}

.kbm-sub-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 0.78rem;
  text-decoration: none;
}

.kbm-sub-link:hover,
.kbm-sub-link.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.sidebar-footer {
  padding: 1.25rem 1rem;
}

.sidebar-footer .avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #93c5fd;
  color: #0f172a;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.sidebar-footer button {
  border-radius: 999px;
}

@media (min-width: 992px) {
  .sidebar {
    position: static;
    top: auto;
    transform: none;
    /* width: 250px; */
  }

  .sidebar-overlay {
    display: none;
  }
}

.logo-white {
  width: 70px; /* opsional, biar rapi */
  /* filter: brightness(0) invert(1); */
}
</style>
