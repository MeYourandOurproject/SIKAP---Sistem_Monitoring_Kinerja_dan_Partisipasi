<template>
  <!-- Mobile Navbar -->
  <nav class="navbar superadmin-mobile-navbar d-md-none sticky-top shadow-sm">
    <div class="container-fluid px-3">
      <div class="d-flex align-items-center justify-content-between w-100 py-2">
        <button
          class="btn btn-link text-white p-0"
          type="button"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <i class="bi bi-list fs-4"></i>
        </button>

        <div class="text-center flex-grow-1">
          <span class="text-success fw-bold">SIKAP Admin</span>
        </div>

        <div class="dropdown">
          <button
            class="btn btn-link text-white p-0"
            type="button"
            @click="handleLogout"
            aria-label="Logout"
          >
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "SuperAdminMobileNavbar",
  methods: {
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    handleLogout() {
      if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.superadmin-mobile-navbar {
  background-color: #0f172a;
}
</style>
