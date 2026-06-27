<template>
  <!-- Desktop Navbar Only -->
  <nav class="navbar superadmin-navbar sticky-top shadow-sm d-none d-md-block">
    <div class="container-fluid px-1 px-md-3">
      <div class="align-items-center gap-3 w-100 p-md-2 p-0 d-flex">
        <button
          class="btn btn-link text-white d-lg-none p-0"
          type="button"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <i class="bi bi-list fs-4"></i>
        </button>

        <div class="navbar-breadcrumb d-flex flex-column text-white text-start">
          <span class="text-opacity text-success">Admin</span>
          <strong class="navbar-title text-secondary"
            >Admin / {{ menuTitle }}</strong
          >
        </div>

        <div class="ms-auto d-flex align-items-center gap-2">
          <button class="btn btn-icon" type="button" aria-label="Notifications">
            <i class="bi bi-bell-fill text-primary"></i>
            <span class="notification-badge badge bg-danger">0</span>
          </button>

          <div class="dropdown user-dropdown">
            <button
              class="btn btn-sm rounded-4 dropdown-toggle d-flex align-items-center gap-2 text-light"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="user-avatar">{{
                userName.charAt(0).toUpperCase()
              }}</span>
              <div class="col d-flex flex-column text-start">
                <small class="d-block" style="font-size: 0.65rem"
                  >Super Admin</small
                >
                <span class="user-name d-none d-sm-inline">{{ userName }}</span>
              </div>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end shadow-sm"
              aria-labelledby="userMenu"
            >
              <li>
                <button class="dropdown-item" @click="goToProfile">
                  <i class="bi bi-person me-2"></i>
                  Profil
                </button>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "SuperAdminNavbar",
  props: {
    menuTitle: {
      type: String,
      default: "Dashboard",
    },
    sidebarOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userName: "Super Admin",
    };
  },
  mounted() {
    this.loadUserName();
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.userName = user.fullname || "Super Admin";
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    },
    goToProfile() {
      this.$router.push("/super-admin/profil");
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
.superadmin-navbar {
  background-color: #0f172a;
  border-radius: 10px;
}

.navbar-breadcrumb .text-opacity {
  opacity: 0.85;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 0.02em;
}

.navbar-title {
  font-size: 1rem;
  letter-spacing: 0.01em;
  font-weight: lighter;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.6rem;
  padding: 2px 4px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.user-name {
  font-size: 0.9rem;
}

.dropdown-menu {
  border: 1px solid #e5e7eb;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.text-danger:hover {
  background-color: #fee2e2;
}
</style>
