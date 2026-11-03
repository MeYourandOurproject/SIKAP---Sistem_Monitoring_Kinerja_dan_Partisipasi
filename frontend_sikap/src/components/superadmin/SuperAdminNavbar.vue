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
          <span class="text-opacity text-primary">SIKAP</span>
          <strong class="navbar-title"
            >Super Admin <span class="breadcrumb-divider">/</span> {{ menuTitle }}</strong
          >
        </div>

        <div class="ms-auto d-flex align-items-center gap-2">
          <div class="dropdown user-dropdown">
            <button
              class="btn btn-sm rounded-4 dropdown-toggle d-flex align-items-center gap-2 text-dark"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="user-avatar">{{ userInitial }}</span>
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
  computed: {
    userInitial() {
      return this.userName.trim().charAt(0).toUpperCase() || "A";
    },
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
        this.userName = user.name || user.fullname || "Super Admin";
      } catch (error) {
        console.error("Error loading user name:", error);
      }
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
  min-height: 76px;
  background-color: #fff;
  border-bottom: 1px solid #e8edf3;
}

.navbar-breadcrumb .text-opacity {
  font-size: 0.72rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.navbar-title {
  color: #172033;
  font-size: 0.94rem;
  letter-spacing: 0.01em;
  font-weight: 600;
}

.breadcrumb-divider {
  color: #98a2b3;
  margin: 0 0.3rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e8f5ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #16834a;
}

.user-name {
  color: #172033;
  font-size: 0.9rem;
}

.user-dropdown small {
  color: #667085;
}

.user-dropdown > button {
  padding: 0.35rem 0.65rem;
  border: 1px solid #edf0f5;
  background: #fff;
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
