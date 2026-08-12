<template>
  <div class="headmaster-layout">
    <!-- ================= DESKTOP ================= -->
    <template v-if="!isMobile">
      <HeadmasterSidebar class="sidebar" />

      <div class="desktop-wrapper">
        <HeadmasterNavbar class="desktop-navbar" :menu-title="currentMenuTitle" />

        <main class="desktop-content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- ================= MOBILE ================= -->
    <template v-else>
      <HeadmasterMobileNavbar v-if="showMobileNavbar" />
      <main class="mobile-content">
        <router-view />
      </main>
      <HeadmasterMobileBottomNavigation />
    </template>
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
      currentMenuTitle: "Dashboard",
      windowWidth: window.innerWidth,
    };
  },

  computed: {
    isMobile() {
      return this.windowWidth < 992;
    },

    showMobileNavbar() {
      return this.$route.path === "/kepala-sekolah/dashboard";
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
      const map = {
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

      this.currentMenuTitle = map[path] || "Dashboard";
    },
  },
};
</script>

<style scoped>
.headmaster-layout {
  min-height: 100vh;
}

/* ==========================
DESKTOP
========================== */

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  z-index: 1000;
}

.desktop-wrapper {
  margin-left: 300px;
  width: calc(100% - 300px);
  min-height: 100vh;
  display: flex;
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
  padding: 24px;
  overflow-x: hidden;
}

/* ==========================
MOBILE
========================== */

.mobile-content {
  padding: 16px;
  padding-bottom: 90px;
}
</style>
