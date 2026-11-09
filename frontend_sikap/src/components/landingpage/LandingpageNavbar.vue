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
  background: rgba(8, 20, 38, 0.94);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.custom-navbar > .container-xxl {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
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
  padding: 0.65rem 0.85rem;
  transition: color 0.2s ease;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 0.7rem 1.1rem;
  border-radius: 10px;
  font-weight: 650;
  text-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  text-decoration: none;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.28);
  color: white;
}

/* MOBILE MENU */
.mobile-menu {
  margin: 0.5rem 0 0;
  padding: 0.85rem;
  border: 1px solid rgba(148, 163, 184, 0.12);
  background: #111f34;
  border-radius: 14px;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.24);
}

/* HAMBURGER */
.navbar-toggler {
  border: none;
  background: transparent;
  padding: 0;
}

.hamburger-icon {
  color: #4ade80;
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

  .custom-navbar > .container-xxl {
    padding-top: 0.55rem !important;
    padding-bottom: 0.55rem !important;
  }

  .navbar-toggler {
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border-radius: 10px;
  }

  .navbar-toggler:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .hamburger-icon {
    font-size: 1.6rem !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn-login,
  .nav-link {
    transition: none;
  }
}
</style>
