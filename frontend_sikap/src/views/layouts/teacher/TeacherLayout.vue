<template>
  <div class="teacher-layout">
    <template v-if="!isMobile">
      <TeacherSidebar class="teacher-sidebar" />
      <div class="teacher-main">
        <TeacherNavbar :menu-title="currentMenuTitle" />
        <main class="teacher-content">
          <router-view />
        </main>
      </div>
    </template>

    <template v-else>
      <TeacherMobileNavbar
        v-if="showMobileNavbar"
        :menu-title="currentMenuTitle"
      />
      <main class="teacher-content" :class="{ 'has-mobile-navbar': showMobileNavbar }">
        <router-view />
      </main>
      <TeacherMobileBottomNavigation />
    </template>
  </div>
</template>

<script>
import TeacherMobileBottomNavigation from "@/components/teacher/TeacherMobileBottomNavigation.vue";
import TeacherMobileNavbar from "@/components/teacher/TeacherMobileNavbar.vue";
import TeacherNavbar from "@/components/teacher/TeacherNavbar.vue";
import TeacherSidebar from "@/components/teacher/TeacherSidebar.vue";

export default {
  name: "TeacherLayout",
  components: {
    TeacherMobileBottomNavigation,
    TeacherMobileNavbar,
    TeacherNavbar,
    TeacherSidebar,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth < 992;
    },
    showMobileNavbar() {
      return this.$route.path === "/guru/dashboard";
    },
    currentMenuTitle() {
      const titles = {
        "/guru/dashboard": "Dashboard",
        "/guru/jadwal": "Jadwal Mengajar",
        "/guru/kegiatan": "Tugas & Kegiatan",
      };
      return titles[this.$route.path] || "Dashboard";
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.teacher-layout {
  min-height: 100vh;
  background: #0f172a;
}

.teacher-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 300px;
  z-index: 1000;
}

.teacher-main {
  min-height: 100vh;
  width: calc(100% - 300px);
  margin-left: 300px;
  display: flex;
  flex-direction: column;
}

.teacher-content {
  flex: 1;
  padding: 24px;
  overflow-x: hidden;
}

@media (max-width: 991px) {
  .teacher-content {
    padding: 16px 16px 96px;
  }

  .teacher-content.has-mobile-navbar {
    padding-top: 92px;
  }
}
</style>
