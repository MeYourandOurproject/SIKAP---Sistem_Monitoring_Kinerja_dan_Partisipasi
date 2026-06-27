<template>
  <div class="student-mobile-nav d-md-none">
    <nav class="mobile-top-navbar sticky-top shadow-sm">
      <div class="container-fluid px-4 py-2">
        <div class="row d-flex align-items-center justify-content-between">
          <div class="col-8 d-flex align-items-center gap-3">
            <img src="../../assets/sikap_logo.PNG" alt="SIKAP Logo" style="height: 50px" />
            <div class="row text-start">
              <div class="col-12 text-success fw-bold" style="font-size: 20px; letter-spacing: 10px">SIKAP</div>
              <div class="col-12 text-white" style="font-size: 9px">Sistem Informasi Kinerja & Partisipasi</div>
            </div>
          </div>

          <div class="col-4 d-flex justify-content-end align-items-center gap-1">
            <div class="dropdown user-dropdown-mobile">
              <button
                class="btn btn-icon"
                type="button"
                id="userMenuMobile"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="User menu"
              >
                <span class="user-avatar-mobile">{{ userName.charAt(0).toUpperCase() }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userMenuMobile">
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

    <div class="mobile-bottom-nav">
      <router-link to="/ketua-murid/dashboard" class="bottom-nav-item" active-class="active">
        <i class="bi bi-grid-fill"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link to="/ketua-murid/validasi" class="bottom-nav-item" active-class="active">
        <i class="bi bi-check2-square"></i>
        <span>Validasi</span>
      </router-link>

      <router-link to="/ketua-murid/laporan" class="bottom-nav-item" active-class="active">
        <i class="bi bi-journal-text"></i>
        <span>Laporan</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentMobileNavbar',
  data() {
    return {
      userName: 'Ketua Murid',
    };
  },
  mounted() {
    this.loadUserName();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.userName = user.fullname || user.name || 'Ketua Murid';
      } catch (error) {
        console.error('Error loading user name:', error);
      }
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
.mobile-top-navbar {
  background-color: #0f172a;
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

.user-avatar-mobile {
  width: 36px;
  /* height: 36px; */
  border-radius: 50%;
  background: #10B981;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.dropdown-menu {
  min-width: 160px;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 9999;
  padding: 6px 10px env(safe-area-inset-bottom);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 11px;
  transition: 0.2s ease;
}

.bottom-nav-item.active {
  color: #f8fafc;
}

.bottom-nav-item i {
  font-size: 18px;
}

.bottom-nav-item span {
  font-size: 11px;
}
</style>
