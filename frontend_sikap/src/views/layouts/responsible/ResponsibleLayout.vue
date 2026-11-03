<template>
  <div class="personresponsible-layout">
    <!-- Desktop layout -->
    <template v-if="!isMobile">
      <ResponsibleSidebar class="sidebar" />

      <div class="desktop-wrapper">
        <ResponsibleNavbar
          class="desktop-navbar"
          :menu-title="currentMenuTitle"
        />
        <main class="desktop-content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- Mobile layout -->
    <template v-else>
      <ResponsibleMobileNavbar :show-top-navbar="showMobileNavbar" />
      <main class="mobile-content">
        <nav
          v-if="showTeacherManagementTabs"
          class="teacher-management-tabs"
          aria-label="Navigasi tugas dan kegiatan guru"
        >
          <router-link
            v-if="previousTeacherManagementPage"
            :to="previousTeacherManagementPage.path"
            class="submenu-step-link"
            :aria-label="`Sebelumnya: ${previousTeacherManagementPage.label}`"
          >
            <i class="bi bi-chevron-left" aria-hidden="true"></i>
            <span>Sebelumnya</span>
          </router-link>
          <span v-else class="submenu-step-link disabled" aria-hidden="true"></span>

          <div class="submenu-current-page" aria-live="polite">
            <small>Menu {{ currentTeacherManagementIndex + 1 }} dari {{ teacherManagementPages.length }}</small>
            <span>
              <i :class="['bi', currentTeacherManagementPage.icon]" aria-hidden="true"></i>
              {{ currentTeacherManagementPage.label }}
            </span>
          </div>

          <router-link
            v-if="nextTeacherManagementPage"
            :to="nextTeacherManagementPage.path"
            class="submenu-step-link"
            :aria-label="`Berikutnya: ${nextTeacherManagementPage.label}`"
          >
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
            <span>Berikutnya</span>
          </router-link>
          <span v-else class="submenu-step-link disabled" aria-hidden="true"></span>
        </nav>
        <router-view />
      </main>
      <ResponsibleMobileBottomNavigation />
    </template>
  </div>
</template>

<script>
import ResponsibleNavbar from "@/components/responsible/ResponsibleNavbar.vue";
import ResponsibleSidebar from "@/components/responsible/ResponsibleSidebar.vue";
import ResponsibleMobileNavbar from "@/components/responsible/ResponsibleMobileNavbar.vue";
import ResponsibleMobileBottomNavigation from "@/components/responsible/ResponsibleMobileBottomNavigation.vue";

export default {
  name: "ResponsibleLayout",
  components: {
    ResponsibleNavbar,
    ResponsibleSidebar,
    ResponsibleMobileNavbar,
    ResponsibleMobileBottomNavigation,
  },
  data() {
    return {
      currentMenuTitle: "Dashboard",
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth < 992;
    },
    showMobileNavbar() {
      return this.$route.path === "/penanggung-jawab/dashboard";
    },
    showTeacherManagementTabs() {
      return (
        this.$route.path.startsWith("/penanggung-jawab/kegiatan") ||
        this.$route.path.startsWith("/penanggung-jawab/absensi")
      );
    },
    teacherManagementPages() {
      return [
        {
          path: "/penanggung-jawab/kegiatan",
          label: "Kelola Tugas dan Kegiatan",
          icon: "bi-calendar-check",
        },
        {
          path: "/penanggung-jawab/absensi",
          label: "Kelola Kehadiran Guru",
          icon: "bi-person-check",
        },
        {
          path: "/penanggung-jawab/kegiatan/riwayat-kehadiran",
          label: "Riwayat Kehadiran Guru",
          icon: "bi-clock-history",
        },
      ];
    },
    currentTeacherManagementIndex() {
      const currentIndex = this.teacherManagementPages.findIndex(
        (page) => page.path === this.$route.path,
      );
      return currentIndex >= 0 ? currentIndex : 0;
    },
    currentTeacherManagementPage() {
      return this.teacherManagementPages[this.currentTeacherManagementIndex];
    },
    previousTeacherManagementPage() {
      return this.teacherManagementPages[this.currentTeacherManagementIndex - 1] || null;
    },
    nextTeacherManagementPage() {
      return this.teacherManagementPages[this.currentTeacherManagementIndex + 1] || null;
    },
  },
  watch: {
    "$route.path"(path) {
      this.updateMenuTitle(path);
    },
  },
  mounted() {
    this.updateMenuTitle(this.$route.path);
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    updateMenuTitle(path) {
      const titleMap = {
        "/penanggung-jawab/dashboard": "Dashboard",
        "/penanggung-jawab/kbm": "Realtime Keterisian Kelas",
        "/penanggung-jawab/kbm/realtime": "Realtime Keterisian Kelas",
        "/penanggung-jawab/kbm/riwayat": "Riwayat Keterisian Kelas",
        "/penanggung-jawab/kegiatan": "Kegiatan",
        "/penanggung-jawab/absensi": "Kelola Kehadiran Guru",
        "/penanggung-jawab/kegiatan/riwayat-kehadiran": "Riwayat Kehadiran Guru",
        "/penanggung-jawab/settings": "Pengaturan",
        "/penanggung-jawab/profile": "Profil",
      };
      this.currentMenuTitle = titleMap[path] || "Dashboard";
    },
  },
};
</script>

<style scoped>
.personresponsible-layout {
  min-height: 100vh;
  background: #0f172a;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 290px;
  height: 100vh;
}

.desktop-wrapper {
  display: flex;
  width: calc(100% - 290px);
  min-width: 0;
  min-height: 100vh;
  margin-left: 290px;
  flex-direction: column;
}

.desktop-navbar {
  position: sticky;
  top: 0;
  z-index: 900;
  flex-shrink: 0;
}

.desktop-content {
  flex: 1;
  min-width: 0;
  padding: 24px;
  overflow-x: hidden;
}

.mobile-content {
  min-height: 100vh;
  padding: 16px 16px 90px;
}

.teacher-management-tabs {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 72px;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  padding: 10px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
}

.submenu-step-link {
  display: flex;
  min-height: 48px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  color: #cbd5e1;
  font-size: 0.68rem;
  text-decoration: none;
}

.submenu-step-link i {
  font-size: 1rem;
}

.submenu-step-link:hover {
  border-color: rgba(52, 211, 153, 0.5);
  background: rgba(16, 185, 129, 0.16);
  color: #f8fafc;
}

.submenu-step-link.disabled {
  visibility: hidden;
}

.submenu-current-page {
  display: grid;
  min-width: 0;
  gap: 5px;
  justify-items: center;
  text-align: center;
}

.submenu-current-page small {
  color: #94a3b8;
  font-size: 0.68rem;
}

.submenu-current-page > span {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.submenu-current-page i {
  flex: 0 0 auto;
  color: #6ee7b7;
}

@media (max-width: 991px) {
  .desktop-wrapper {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .teacher-management-tabs {
    grid-template-columns: 56px minmax(0, 1fr) 56px;
    gap: 7px;
    padding: 8px;
  }

  .submenu-step-link {
    min-height: 44px;
    font-size: 0.62rem;
  }

  .submenu-current-page > span {
    font-size: 0.78rem;
  }
}
</style>
