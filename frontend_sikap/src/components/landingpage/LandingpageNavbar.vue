<template>
  <div>
    <!-- NAVBAR -->
    <div ref="navbarRef" class="container-fluid custom-navbar">
      <div class="container-xxl py-3">
        <div class="row align-items-center justify-content-between">
          <!-- LOGO -->
          <div class="col-auto">
            <a
              href="#beranda"
              class="brand-link d-flex align-items-center text-decoration-none"
            >
              <img
                src="../../assets/sikap_logo.PNG"
                alt="SIKAP Logo"
                class="brand-logo"
              />
              <div class="brand-copy text-start">
                <div class="brand-name text-success fw-bold">SIKAP</div>
                <div class="brand-tagline text-white">
                  Sistem Informasi Kinerja &amp; Partisipasi
                </div>
              </div>
            </a>
          </div>

          <!-- MENU DESKTOP -->
          <div class="col d-none d-lg-block">
            <ul class="nav justify-content-end fw-medium">
              <li class="nav-item">
                <a class="nav-link" href="#beranda">Beranda</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#fitur">Fitur</a>
              </li>
            </ul>
          </div>

          <!-- BUTTON -->
          <div class="col-auto d-none d-lg-flex justify-content-center">
            <router-link to="/login" class="btn-login">
              Akses Login <i class="bi bi-box-arrow-in-right ms-2"></i>
            </router-link>
          </div>

          <!-- HAMBURGER -->
          <div class="col-auto d-lg-none text-center justify-content-center d-flex">
            <button class="navbar-toggler" @click.stop="toggleMenu">
              <i class="bi bi-list fs-1 hamburger-icon text-success"></i>
            </button>
          </div>
        </div>

        <!-- MOBILE MENU -->
        <div v-if="showMenuMobile" class="mobile-menu d-lg-none">
          <ul class="navbar-nav text-center">
            <li class="nav-item">
              <a class="nav-link" href="#beranda" @click="closeMenu">Beranda</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#fitur" @click="closeMenu">Fitur</a>
            </li>

            <li class="nav-item mt-3">
              <router-link to="/login" class="btn-login w-100">
                Akses Login
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const showMenuMobile = ref(false);
const navbarRef = ref(null);

const toggleMenu = () => {
  showMenuMobile.value = !showMenuMobile.value;
};

const closeMenu = () => {
  showMenuMobile.value = false;
};

const handleClickOutside = (event) => {
  if (!navbarRef.value) return;
  if (!navbarRef.value.contains(event.target)) {
    showMenuMobile.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.custom-navbar {
  --primary-color: #1d4ed8;
  --primary-hover: #fff;
  --text-color: #94a3b8;
}

/* NAVBAR */
.custom-navbar {
  position: sticky;
  top: 0;
  z-index: 1020;
  background: #0F172A;
  backdrop-filter: blur(40px);
  border-bottom: 1px solid #000000;
}

.brand-link {
  gap: 12px;
}

.brand-logo {
  width: 50px;
  height: 50px;
  flex: 0 0 auto;
  object-fit: contain;
}

.brand-name {
  font-size: 20px;
  letter-spacing: 0.35em;
  line-height: 1.2;
}

.brand-tagline {
  font-size: 9px;
  white-space: nowrap;
}

/* NAV */
.nav {
  gap: 10px;
}

/* NAV LINK DEFAULT (HITAM) */
.nav-link {
  color: var(--text-color);
  font-weight: 500;
  position: relative;
  padding: 8px 14px;
  transition: all 0.3s ease;
}

/* HOVER (BIRU) */
.nav-link:hover {
  color: var(--primary-hover);
}

/* ACTIVE */
.router-link-active {
  color: var(--primary-hover) !important;
  font-weight: 600;
}

/* UNDERLINE */
.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 0%;
  height: 2px;
  background: var(--primary-hover);
  transition: 0.3s;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 60%;
}

.router-link-active::after {
  width: 70%;
}

/* BUTTON LOGIN (BISA DIATUR WARNA) */
.btn-login {
  background: var(--primary-color);
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  transition: 0.3s;
  text-decoration: none;
}

.btn-login:hover {
  background: var(--primary-hover);
  color: #0f172a;
}

/* MOBILE MENU */
.mobile-menu {
  margin-top: 12px;
  padding: 20px;
  background: #0F172A;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* HAMBURGER */
.navbar-toggler {
  border: none;
  background: transparent;
  padding: 0;
}

.hamburger-icon {
  color: var(--primary-color);
}

/* DEFAULT HITAM */
.nav-link {
  color: var(--text-color) !important;
}

/* HOVER */
.nav-link:hover {
  color: var(--primary-hover) !important;
}

/* ACTIVE (SEMUA KASUS) */
.nav-link.router-link-active,
.nav-link.router-link-exact-active,
.nav-link.active {
  color: var(--primary-hover) !important;
  font-weight: 600;
}

@media (max-width: 575px) {
  .brand-link {
    gap: 8px;
  }

  .brand-logo {
    width: 42px;
    height: 42px;
  }

  .brand-name {
    font-size: 17px;
  }

  .brand-tagline {
    font-size: 8px;
  }
}
</style>
