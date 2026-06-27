<template>
  <div class="headmaster-layout">
    <!-- Sidebar (fixed kiri full) -->
    <headmasterSidebar />

    <!-- Area kanan -->
    <div class="main-area">
      <!-- Navbar -->
      <headmasterNavbar :menu-title="currentMenuTitle" />
      <HeadmasterMobileNavbar />

      <!-- Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import headmasterNavbar from "@/components/headmaster/HeadmasterNavbar.vue";
import HeadmasterMobileNavbar from "@/components/headmaster/HeadmasterMobileNavbar.vue";
import headmasterSidebar from "@/components/headmaster/HeadmasterSidebar.vue";

export default {
  name: "headmasterLayout",
  components: {
    headmasterNavbar,
    HeadmasterMobileNavbar,
    headmasterSidebar,
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
        "/headmaster/dashboard": "Dashboard",
        "/headmaster/journal": "Jurnal",
        "/headmaster/attendance": "Absensi",
        "/headmaster/assessment": "Penilaian",
        "/headmaster/report": "Laporan",
        "/headmaster/industry-info": "Info Industri",
        "/headmaster/announcements": "Pengumuman",
        "/headmaster/settings": "Pengaturan",
        "/headmaster/profile": "Profil",
      };
      this.currentMenuTitle = titleMap[path] || "Dashboard";
    },
    handleResize() {
      if (window.innerWidth >= 992) {
        this.sidebarOpen = false;
      }
    },
  },
};
</script>

<style>
.headmaster-layout {
  display: flex;
  height: 100vh; /* ganti min-height */
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
