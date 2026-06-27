<template>
  <div class="superadmin-layout">
    <!-- Sidebar (fixed kiri full) -->
    <SuperAdminSidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Area kanan -->
    <div class="main-area-admin">
      <!-- Navbar -->
      <SuperAdminNavbar :menu-title="currentMenuTitle" @toggle-sidebar="toggleSidebar" />
      <SuperAdminMobileNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SuperAdminNavbar from "@/components/superadmin/SuperAdminNavbar.vue";
import SuperAdminMobileNavbar from "@/components/superadmin/SuperAdminMobileNavbar.vue";
import SuperAdminSidebar from "@/components/superadmin/SuperAdminSidebar.vue";

export default {
  name: "SuperAdminLayout",
  components: {
    SuperAdminNavbar,
    SuperAdminMobileNavbar,
    SuperAdminSidebar,
  },
  data() {
    return {
      sidebarOpen: false,
      currentMenuTitle: "Dashboard",
    };
  },
  watch: {
    "$route.path"(newPath) {
      this.updateMenuTitle(newPath);
      this.sidebarOpen = false; // Close sidebar on route change
    },
  },
  mounted() {
    this.updateMenuTitle(this.$route.path);
    // Close sidebar on screen resize if opening
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    updateMenuTitle(path) {
      const titleMap = {
        "/super-admin/dashboard": "Dashboard",
        "/super-admin/guru": "Manajemen Guru",
        "/super-admin/jadwal": "Jadwal Pelajaran",
        "/super-admin/pengguna": "Manajemen Pengguna",
        "/super-admin/pengaturan": "Pengaturan",
        "/super-admin/profil": "Profil",
      };
      this.currentMenuTitle = titleMap[path] || "Dashboard";
    },
    handleResize() {
      if (window.innerWidth >= 992) {
        this.sidebarOpen = false;
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
};
</script>

<style scoped>
.superadmin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #0f172a;
}

/* ===== SIDEBAR FIX ===== */
:deep(.sidebar) {
  position: fixed !important;
  top: 0 !important;
  left: 0;
  height: 100vh !important;
  width: 250px;
  z-index: 1000;
  overflow-y: auto;
}

/* ===== AREA KANAN ===== */
.main-area-admin {
  width: calc(100% - 250px);
  margin-left: 250px;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #0b1220;
}

/* ===== NAVBAR ===== */
:deep(.superadmin-navbar) {
  position: sticky;
  top: 0;
  z-index: 900;
  height: 70px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ===== CONTENT ===== */
.main-content {
  padding: 1.5rem 1.5rem 2rem;
  flex: 1;
}

:deep(.card) {
  background-color: #111827;
  border-color: rgba(148, 163, 184, 0.15);
  color: #e5e7eb;
}

:deep(.card-header),
:deep(.card-header.bg-light) {
  background-color: #0f172a !important;
  border-color: rgba(148, 163, 184, 0.15) !important;
  color: #e5e7eb !important;
}

:deep(.card-body) {
  color: #e5e7eb;
}

:deep(.table) {
  color: #e5e7eb;
}

:deep(.table thead th) {
  background-color: #111827;
  color: #e5e7eb;
  border-color: rgba(148, 163, 184, 0.15);
}

:deep(.table tbody tr:hover) {
  background-color: rgba(148, 163, 184, 0.08);
}

:deep(.btn-outline-primary),
:deep(.btn-outline-info),
:deep(.btn-outline-warning),
:deep(.btn-outline-secondary) {
  border-color: rgba(148, 163, 184, 0.4);
  color: #f8fafc;
}

:deep(.btn-outline-primary:hover),
:deep(.btn-outline-info:hover),
:deep(.btn-outline-warning:hover),
:deep(.btn-outline-secondary:hover) {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(148, 163, 184, 0.6);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 991px) {
  .main-area-admin {
    margin-left: 0;
    width: 100%;
  }

  :deep(.sidebar) {
    transform: translateX(-100%);
    transition: 0.3s ease;
  }

  :deep(.sidebar-wrapper.open) :deep(.sidebar) {
    transform: translateX(0);
  }

  .main-content {
    padding-top: 1rem;
    margin-bottom: 60px;
  }
}
</style>
