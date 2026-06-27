<template>
  <div>
    <!-- NAVBAR -->
    <div ref="navbarRef" class="container-fluid fixed-top custom-navbar">
      <div class="container-xxl py-3">
        <div class="row align-items-center justify-content-between">
          <!-- LOGO -->
          <div class="col-2 col-md-2">
            <router-link
              to="/"
              class="d-flex align-items-center justify-content-center text-decoration-none"
            >
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
            </router-link>
          </div>

          <!-- MENU DESKTOP -->
          <div class="col-7 col-md-8 d-none d-lg-block">
            <ul class="nav justify-content-end fw-medium">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Beranda</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/fitur">Fitur</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/untuk-siapa"
                  >Untuk Siapa</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/tentang"
                  >Tentang</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/kontak">Kontak</router-link>
              </li>
            </ul>
          </div>

          <!-- BUTTON -->
          <div class="col-2 d-none d-lg-flex justify-content-center">
            <router-link to="/login" class="btn-login">
              Akses Login <i class="bi bi-box-arrow-in-right ms-2"></i>
            </router-link>
          </div>

          <!-- HAMBURGER -->
          <div
            class="col-2 d-lg-none text-center justify-content-center d-flex"
          >
            <button class="navbar-toggler" @click.stop="toggleMenu">
              <i class="bi bi-list fs-1 hamburger-icon text-success"></i>
            </button>
          </div>
        </div>

        <!-- MOBILE MENU -->
        <div v-if="showMenuMobile" class="mobile-menu d-lg-none">
          <ul class="navbar-nav text-center">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Beranda</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/fitur">Fitur</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/untuk-siapa"
                >Untuk Siapa</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tentang">Tentang</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/kontak">Kontak</router-link>
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

<style>
:root {
  --primary-color: #1d4ed8;
  --primary-hover: #fff;
  --text-color: #94a3b8;
}

/* NAVBAR */
.custom-navbar {
  background: #0F172A;
  backdrop-filter: blur(40px);
  border-bottom: 1px solid #000000;
}

/* LOGO */
.logo-brand {
  height: 45px;
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* HAMBURGER */
.navbar-toggler {
  border: none;
  background: transparent;
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
</style>
