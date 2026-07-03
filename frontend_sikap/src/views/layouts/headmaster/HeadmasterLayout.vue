<template>
  <div class="headmaster-layout">
    <!-- Sidebar (fixed kiri full) -->
    <headmasterSidebar />

    <!-- Area kanan -->
    <div class="main-area">
      <!-- Navbar -->
      <headmasterNavbar :menu-title="currentMenuTitle" />
      <HeadmasterMobileNavbar v-if="showMobileNavbar" />
      <HeadmasterMobileBottomNavigation />

      <!-- Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import HeadmasterNavbar from "@/components/headmaster/HeadmasterNavbar.vue";
import HeadmasterMobileNavbar from "@/components/headmaster/HeadmasterMobileNavbar.vue";
import HeadmasterSidebar from "@/components/headmaster/HeadmasterSidebar.vue";
import HeadmasterMobileBottomNavigation from "@/components/headmaster/HeadmasterMobileBottomNavigation.vue";

export default {
  name: "headmasterLayout",
  components: {
    HeadmasterNavbar,
    HeadmasterMobileNavbar,
    HeadmasterSidebar,
    HeadmasterMobileBottomNavigation,
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
        "/kepala-sekolah/dashboard": "Dashboard",
        "/kepala-sekolah/journal": "Jurnal",
        "/kepala-sekolah/attendance": "Absensi",
        "/kepala-sekolah/assessment": "Penilaian",
        "/kepala-sekolah/report": "Laporan",
        "/kepala-sekolah/industry-info": "Info Industri",
        "/kepala-sekolah/announcements": "Pengumuman",
        "/kepala-sekolah/settings": "Pengaturan",
        "/kepala-sekolah/profile": "Profil",
      };
      this.currentMenuTitle = titleMap[path] || "Dashboard";
    },
    handleResize() {
      if (window.innerWidth >= 992) {
        this.sidebarOpen = false;
      }
    },
  },
  computed: {
    showMobileNavbar() {
      return this.$route.path === "/kepala-sekolah/dashboard";
    },
  },
};
</script>

<style>
.headmaster-layout {
  display: flex;
  min-height: 100vh; /* ganti min-height */
  overflow: hidden; /* cegah scroll parent */
  background: #0f172a;
}

/* ===== SIDEBAR FIX ===== */
:deep(.sidebar) {
  position: fixed !important;
  top: 0 !important;
  left: 0;
  height: 100vh !important;
  width: 300px;
  z-index: 1000;
  overflow-y: auto; /* kalau menu sidebar panjang */
}

/* ===== AREA KANAN ===== */
.main-area {
  /* margin-left: 300px; aktifkan lagi */
  width: calc(100% - 300px);
  height: 100vh;
  overflow-y: auto; /* hanya konten kanan yang scroll */
  display: flex;
  flex-direction: column;
}

/* ===== NAVBAR ===== */
:deep(.headmaster-navbar) {
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
  padding: 0 1.5rem 2rem;
  flex: 1;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 991px) {
  .main-area {
    margin-left: 0;
    width: 100%;
  }

  :deep(.sidebar) {
    transform: translateX(-100%);
    transition: 0.3s ease;
  }

  :deep(.sidebar.open) {
    transform: translateX(0);
  }
  .main-content {
    padding-top: 1rem;
    margin-bottom: 60px;
  }
}
</style>
