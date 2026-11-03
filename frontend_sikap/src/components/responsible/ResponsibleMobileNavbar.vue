<template>
  <div class="d-md-none">
    <!-- Mobile Top Navbar -->
    <nav v-if="showTopNavbar" class="mobile-top-navbar sticky-top shadow-sm">
      <div class="container-fluid px-4 py-2">
        <div class="row d-flex align-items-center justify-content-between">
          <div class="col-8 d-flex align-items-center gap-3">
            <img
              src="../../assets/sikap_logo.PNG"
              alt="SIKAP Logo"
              style="height: 50px"
            />
            <div class="row text-start">
              <div
                class="col-12 text-success fw-bold"
                style="font-size: 20px; letter-spacing: 10px"
              >
                SIKAP
              </div>
              <div class="col-12 text-white" style="font-size: 9px">
                Sitem Informasi Kinerja & Partisipasi
              </div>
            </div>
          </div>

          <div
            class="col-4 d-flex justify-content-end align-items-center gap-1"
          >
            <button
              class="btn btn-icon"
              type="button"
              aria-label="Notifications"
            >
              <i class="bi bi-bell text-white fs-3"></i>
              <span class="notification-badge badge bg-danger">3</span>
            </button>

            <div class="dropdown user-dropdown-mobile">
              <button
                class="btn btn-icon"
                type="button"
                id="userMenuMobile"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="User menu"
              >
                <span class="user-avatar-mobile">{{
                  userName.charAt(0).toUpperCase()
                }}</span>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end shadow-sm"
                aria-labelledby="userMenuMobile"
              >
                <li>
                  <button class="dropdown-item" @click="goToProfile">
                    <i class="bi bi-person me-2"></i>
                    Profil
                  </button>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button
                    class="dropdown-item text-danger"
                    @click="handleLogout"
                  >
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
  </div>
</template>

<script>
export default {
  name: "ResponsibleMobileNavbar",
  props: {
    showTopNavbar: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      userName: "Kepala Sekolah",
    };
  },
  mounted() {
    this.loadUserName();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.userName = user.name || "Kepala Sekolah";
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    },
    goToProfile() {
      this.$router.push("/kepala-sekolah/profile");
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
.mobile-top-navbar {
  background-color: #0f172a;
  /* border-radius: 10px; */
  /* margin-bottom: 10px; */
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.6rem;
  padding: 2px 5px;
}

.user-avatar-mobile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #10B981;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.user-dropdown-mobile .btn {
  padding: 0;
}

.dropdown-menu {
  min-width: 160px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

</style>
