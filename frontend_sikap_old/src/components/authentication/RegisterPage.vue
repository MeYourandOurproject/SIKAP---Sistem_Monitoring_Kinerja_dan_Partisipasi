<template>
  <div class="container-fluid vh-100 d-flex align-items-center position-relative">

    <!-- BACK TO HOME -->
    <div class="back-wrapper">
      <router-link to="/" class="back-home">
        <i class="bi bi-arrow-left"></i> Beranda
      </router-link>
    </div>

    <div class="row w-100">

      <!-- LEFT: HERO -->
      <div class="col-lg-7 d-none d-lg-flex align-items-center hero-section">
        <div class="px-5">
          <div class="hero-badge">#1 SOLUSI MANAJEMEN PKL SMK</div>

          <h1 class="home-title fw-bold text-dark">
            Bergabung dengan <br />
            <span class="text-title-hero">
              PRISKA Sekarang
            </span>
          </h1>

          <p class="hero-subtitle mt-3">
            Daftarkan akun Anda dan mulai kelola Praktik Kerja Lapangan
            secara digital, mudah, dan terintegrasi.
          </p>

          <div class="info mt-4 d-flex gap-3 flex-wrap small fw-medium">
            <div><i class="bi bi-shield-check text-success me-2"></i>Aman</div>
            <div><i class="bi bi-check-circle text-primary me-2"></i>Mudah</div>
            <div><i class="bi bi-cloud-download text-success me-2"></i>Akses Dimana Saja</div>
          </div>
        </div>
      </div>

      <!-- RIGHT: REGISTER -->
      <div class="col-lg-5 col-12 d-flex justify-content-center align-items-center">
        <div class="card p-4 shadow register-card">
          <h3 class="text-center mb-3">Buat Akun Priska</h3>

          <form @submit.prevent="handleRegister">

            <div class="mb-3">
              <label>Nama</label>
              <input v-model="name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>

            <button class="btn btn-success w-100">Register</button>
          </form>

          <p class="text-center mt-3 fst-italic">
            Sudah punya akun?
            <router-link to="/login">Login</router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    }
  },
  methods: {
    handleRegister() {
      console.log("Register:", this.name, this.email, this.password)
    }
  }
}
</script>

<style scoped>
/* BACK BUTTON */
.back-wrapper {
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 10;
}

.back-home {
  text-decoration: none;
  color: #1d4ed8;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.3s;
}

.back-home:hover {
  color: #1e3a8a;
}

/* HERO */
.hero-section {
  background: linear-gradient(135deg, #e0edff, #ffffff);
  height: 100vh;
}

/* TEXT */
.home-title {
  font-size: 5rem;
  line-height: 1.2;
}

.text-title-hero {
  color: #1d4ed8;
}

.hero-subtitle {
  font-size: 1rem;
  max-width: 500px;
}

/* BADGE */
.hero-badge {
  background: #e0edff;
  color: #1d4ed8;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
  width: fit-content;
}

/* CARD */
.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}

/* MOBILE */
@media (max-width: 992px) {
  .hero-section {
    display: none;
  }

  .back-wrapper {
    left: 15px;
    top: 15px;
  }
}
</style>