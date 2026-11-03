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
        "/super-admin/teacher": "Manajemen Guru",
        "/super-admin/schedule": "Jadwal Pelajaran",
        "/super-admin/user": "Manajemen Pengguna",
        "/super-admin/classes/students": "Kelola Data Siswa",
        "/super-admin/classes/homeroom": "Kelola Wali Kelas",
        "/super-admin/classes": "Kelola Data Siswa",
        "/super-admin/students": "Kelola Data Siswa",
        "/super-admin/settings": "Pengaturan",
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
  min-height: 100vh;
  background: #f3f6fb;
}

.main-area-admin {
  width: calc(100% - 250px);
  margin-left: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #f3f6fb;
}

.main-content {
  width: 100%;
  max-width: 1600px;
  padding: 1.5rem clamp(1rem, 2.5vw, 2.5rem) 2.5rem;
  margin: 0 auto;
  flex: 1;
}

:deep(.superadmin-dashboard),
:deep(.superadmin-teacher),
:deep(.superadmin-schedule),
:deep(.superadmin-user),
:deep(.superadmin-classes),
:deep(.superadmin-homeroom),
:deep(.superadmin-settings) {
  color: #172033;
}

:deep(.sidebar) {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  z-index: 1040;
}

:deep(.superadmin-dashboard h2),
:deep(.superadmin-teacher h2),
:deep(.superadmin-schedule h2),
:deep(.superadmin-user h2),
:deep(.superadmin-classes h2),
:deep(.superadmin-homeroom h2),
:deep(.superadmin-settings h2) {
  color: #172033;
  font-size: clamp(1.45rem, 2vw, 1.85rem);
  font-weight: 750;
  letter-spacing: -0.035em;
}

:deep(.superadmin-dashboard .card),
:deep(.superadmin-teacher .card),
:deep(.superadmin-schedule .card),
:deep(.superadmin-user .card),
:deep(.superadmin-classes .card),
:deep(.superadmin-homeroom .card),
:deep(.superadmin-settings .card) {
  color: #172033;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 18px;
  box-shadow: 0 8px 26px rgba(22, 34, 51, 0.045) !important;
}

:deep(.superadmin-dashboard .card-header),
:deep(.superadmin-teacher .card-header),
:deep(.superadmin-schedule .card-header),
:deep(.superadmin-user .card-header),
:deep(.superadmin-classes .card-header),
:deep(.superadmin-homeroom .card-header),
:deep(.superadmin-settings .card-header) {
  padding: 1rem 1.25rem;
  color: #172033;
  background: #fff !important;
  border-bottom: 1px solid #edf0f5;
  border-radius: 18px 18px 0 0;
}

:deep(.superadmin-dashboard .welcome-card) {
  color: #fff;
  background: linear-gradient(120deg, #12395b 0%, #176b58 100%);
  border: 0;
  overflow: hidden;
}

:deep(.superadmin-dashboard .welcome-card .card-body) {
  min-height: 190px;
  display: flex;
  align-items: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: radial-gradient(circle at 90% 15%, rgba(255,255,255,.13), transparent 34%);
}

:deep(.superadmin-dashboard .welcome-card .text-muted) {
  color: rgba(255,255,255,.72) !important;
}

:deep(.superadmin-dashboard .stat-card) {
  min-height: 168px;
}

:deep(.superadmin-dashboard .stat-card .card-body) {
  padding: 1.35rem;
}

:deep(.superadmin-dashboard .status-main) {
  color: #172033;
  font-size: 1.85rem;
  font-weight: 750;
  line-height: 1.1;
}

:deep(.superadmin-dashboard .stat-label) {
  color: #667085;
  font-weight: 650;
}

:deep(.superadmin-dashboard .status-sub) {
  color: #667085;
}

:deep(.superadmin-dashboard .card-body),
:deep(.superadmin-teacher .card-body),
:deep(.superadmin-schedule .card-body),
:deep(.superadmin-user .card-body),
:deep(.superadmin-classes .card-body),
:deep(.superadmin-homeroom .card-body),
:deep(.superadmin-settings .card-body) {
  color: #344054;
}

:deep(.superadmin-dashboard .table),
:deep(.superadmin-teacher .table),
:deep(.superadmin-schedule .table),
:deep(.superadmin-user .table),
:deep(.superadmin-classes .table),
:deep(.superadmin-homeroom .table),
:deep(.superadmin-settings .table) {
  --bs-table-color: #344054;
  --bs-table-bg: transparent;
  --bs-table-hover-bg: #f7f9fc;
  margin-bottom: 0;
}

:deep(.superadmin-dashboard .table thead th),
:deep(.superadmin-teacher .table thead th),
:deep(.superadmin-schedule .table thead th),
:deep(.superadmin-user .table thead th),
:deep(.superadmin-classes .table thead th),
:deep(.superadmin-homeroom .table thead th),
:deep(.superadmin-settings .table thead th) {
  color: #667085;
  background: #f8fafc;
  border-bottom: 1px solid #e8edf3;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  white-space: nowrap;
}

:deep(.superadmin-dashboard .form-control),
:deep(.superadmin-dashboard .form-select),
:deep(.superadmin-teacher .form-control),
:deep(.superadmin-teacher .form-select),
:deep(.superadmin-schedule .form-control),
:deep(.superadmin-schedule .form-select),
:deep(.superadmin-user .form-control),
:deep(.superadmin-user .form-select),
:deep(.superadmin-settings .form-control),
:deep(.superadmin-settings .form-select) {
  min-height: 44px;
  color: #172033;
  background-color: #fff;
  border-color: #d8dee8;
  border-radius: 10px;
}

:deep(.superadmin-dashboard .form-control:focus),
:deep(.superadmin-dashboard .form-select:focus),
:deep(.superadmin-teacher .form-control:focus),
:deep(.superadmin-teacher .form-select:focus),
:deep(.superadmin-schedule .form-control:focus),
:deep(.superadmin-schedule .form-select:focus),
:deep(.superadmin-user .form-control:focus),
:deep(.superadmin-user .form-select:focus),
:deep(.superadmin-settings .form-control:focus),
:deep(.superadmin-settings .form-select:focus) {
  border-color: #78a8ff;
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.12);
}

:deep(.superadmin-dashboard .form-label),
:deep(.superadmin-teacher .form-label),
:deep(.superadmin-schedule .form-label),
:deep(.superadmin-user .form-label),
:deep(.superadmin-settings .form-label) {
  color: #344054;
  font-size: 0.9rem;
  font-weight: 650;
}

:deep(.superadmin-dashboard .btn),
:deep(.superadmin-teacher .btn),
:deep(.superadmin-schedule .btn),
:deep(.superadmin-user .btn),
:deep(.superadmin-settings .btn) {
  border-radius: 10px;
  font-weight: 600;
}

:deep(.superadmin-dashboard .btn-success),
:deep(.superadmin-teacher .btn-success),
:deep(.superadmin-schedule .btn-success),
:deep(.superadmin-user .btn-success),
:deep(.superadmin-settings .btn-success) {
  background: #16834a;
  border-color: #16834a;
}

:deep(.superadmin-dashboard .alert),
:deep(.superadmin-teacher .alert),
:deep(.superadmin-schedule .alert),
:deep(.superadmin-user .alert),
:deep(.superadmin-settings .alert) {
  border: 0;
  border-radius: 12px;
}

:deep(.superadmin-dashboard .text-muted),
:deep(.superadmin-teacher .text-muted),
:deep(.superadmin-schedule .text-muted),
:deep(.superadmin-user .text-muted),
:deep(.superadmin-settings .text-muted) {
  color: #667085 !important;
}

:deep(.superadmin-dashboard .welcome-card .text-muted) {
  color: rgba(255,255,255,.72) !important;
}

@media (max-width: 991px) {
  .main-area-admin {
    margin-left: 0;
    width: 100%;
  }

  .main-content {
    padding: 1rem 1rem 2rem;
    margin-bottom: 60px;
  }
}

@media (max-width: 575px) {
  .main-content {
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }
}
</style>
