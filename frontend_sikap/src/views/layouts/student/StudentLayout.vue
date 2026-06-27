<template>
  <div class="student-layout">
    <StudentSidebar />

    <div class="main-area-student">
      <StudentNavbar :menu-title="currentMenuTitle" />
      <StudentMobileNavbar />

      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import StudentNavbar from "@/components/student/StudentNavbar.vue";
import StudentSidebar from "@/components/student/StudentSidebar.vue";
import StudentMobileNavbar from "@/components/student/StudentMobileNavbar.vue";

export default {
  name: "StudentLayout",
  components: {
    StudentNavbar,
    StudentSidebar,
    StudentMobileNavbar,
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
      this.sidebarOpen = false;
    },
  },
  mounted() {
    this.updateMenuTitle(this.$route.path);
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    updateMenuTitle(path) {
      const titleMap = {
        "/ketua-murid/dashboard": "Dashboard",
        "/ketua-murid/validasi": "Validasi Guru",
        "/ketua-murid/laporan": "Laporan",
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
.student-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #0f172a;
}

:deep(.sidebar) {
  position: fixed !important;
  top: 0 !important;
  left: 0;
  height: 100vh !important;
  width: 300px;
  z-index: 1000;
  overflow-y: auto;
}

.main-area-student {
  margin-left: 300px;
  width: calc(100% - 290px);
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

:deep(.student-navbar) {
  position: sticky;
  top: 0;
  z-index: 900;
  height: 70px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.main-content {
  padding: 0 1.5rem 2rem;
  flex: 1;
}

@media (max-width: 991px) {
  .main-area-student {
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
