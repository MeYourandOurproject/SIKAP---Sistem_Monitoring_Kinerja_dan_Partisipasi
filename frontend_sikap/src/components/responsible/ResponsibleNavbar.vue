<template>
  <nav class="navbar person-responsible-navbar sticky-top shadow-sm d-none d-md-block">
    <div class="container-fluid px-1 px-md-3">
      <div class="d-flex align-items-center gap-3 w-100 p-md-2 p-0 d-flex">
        <button
          class="btn btn-link text-white d-lg-none p-0"
          type="button"
          @click="$emit('toggle-sidebar')"
          aria-label="Toggle sidebar"
        >
          <i class="bi bi-list fs-4"></i>
        </button>

        <div class="navbar-breadcrumb d-flex flex-column text-white text-start">
          <span class="text-success">Penanggung Jawab</span>
          <strong class="navbar-title text-secondary">{{ menuTitle }}</strong>
        </div>

        <div class="ms-auto d-flex align-items-center gap-2">
          <button class="btn btn-icon" type="button" aria-label="Notifications">
            <i class="bi bi-bell-fill text-success"></i>
            <span class="notification-badge badge bg-danger">2</span>
          </button>

          <div class="dropdown user-dropdown">
            <button
              class="btn btn-sm rounded-4 dropdown-toggle d-flex align-items-center gap-2 text-light"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="user-avatar">{{ userName.charAt(0).toUpperCase() }}</span>
              <div class="col d-flex flex-column text-start">
                <small class="d-block" style="font-size: 0.65rem;">Penanggung Jawab</small>
                <span class="user-name d-none d-sm-inline">{{ userName }}</span>
              </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userMenu">
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
  name: 'PersonResponsibleNavbar',
  props: {
    menuTitle: {
      type: String,
      default: 'Dashboard',
    },
  },
  data() {
    return {
      userName: 'Penanggung Jawab',
    };
  },
  mounted() {
    this.loadUserName();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.userName = user.fullname || user.name || 'Penanggung Jawab';
      } catch (error) {
        console.error('Error loading user name:', error);
      }
    },
    goToProfile() {
      this.$router.push('/penanggung-jawab/profile');
    },
    handleLogout() {
      if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/');
      }
    },
  },
};
</script>

<style scoped>
.person-responsible-navbar {
  /* background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); */
  background-color: #0F172A;
  border-radius: 10px;
  /* color: #f8fafc; */
}

.person-responsible-navbar .btn-icon {
  background: rgba(255, 255, 255, 0.08);
}

.person-responsible-navbar .notification-badge {
  background: #22c55e;
}

.person-responsible-navbar .user-avatar {
  background: #16a34a;
}

.navbar-breadcrumb .text-success {
  opacity: 0.85;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.02em;
}

.navbar-title {
  font-size: 1rem;
  letter-spacing: 0.01em;
  font-weight: lighter;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  font-size: 0.65rem;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #10b981;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.dropdown-menu {
  min-width: 200px;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

@media (max-width: 991px) {
  .person-responsible-navbar {
    padding-left: 1rem;
  }
}
</style>
