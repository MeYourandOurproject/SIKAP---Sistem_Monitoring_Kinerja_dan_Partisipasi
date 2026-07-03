<template>
  <div class="student-layout">
    <!-- ================= DESKTOP ================= -->
    <template v-if="!isMobile">
      <StudentSidebar class="sidebar" />

      <div class="desktop-wrapper">
        <StudentNavbar class="desktop-navbar" :menu-title="currentMenuTitle" />

        <main class="desktop-content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- ================= MOBILE ================= -->
    <template v-else>
      <StudentMobileNavbar v-if="showMobileNavbar" />

      <main class="mobile-content">
        <router-view />
      </main>

      <StudentMobileBottomNavigation />
    </template>
  </div>
</template>

<script>
import StudentNavbar from "@/components/student/StudentNavbar.vue";
import StudentSidebar from "@/components/student/StudentSidebar.vue";
import StudentMobileNavbar from "@/components/student/StudentMobileNavbar.vue";
import StudentMobileBottomNavigation from "@/components/student/StudentMobileBottomNavigation.vue";

export default {
  components: {
    StudentNavbar,
    StudentSidebar,
    StudentMobileNavbar,
    StudentMobileBottomNavigation,
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
      return this.$route.path === "/ketua-murid/dashboard";
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
        "/ketua-murid/dashboard": "Dashboard",
        "/ketua-murid/validasi": "Validasi Guru",
        "/ketua-murid/laporan": "Laporan",
      };

      this.currentMenuTitle = map[path] || "Dashboard";
    },
  },
};
</script>

<style scoped>
.student-layout {
  min-height: 100vh;
  /* background: #f8fafc; */
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
  /* background-color: aqua; */
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

  min-height: 100vh;
}
</style>
