<template>
  <div
    class="container-fluid vh-100 d-flex align-items-center position-relative"
  >
    <!-- BACK TO HOME -->
    <div class="back-wrapper">
      <router-link to="/" class="back-home">
        <i class="bi bi-arrow-left"></i> Beranda
      </router-link>
    </div>

    <div class="row w-100">
      <div
        class="col-lg-12 col-12 d-flex justify-content-center align-items-center"
      >
        <div class="card p-4 shadow login-card">
          <div class="col mb-3">
            <img
              src="../../assets/sikap_logo.PNG"
              style="width: 200px; height: auto"
              alt=""
            />
          </div>
          

          <div
            v-if="errorMessage"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i class="bi bi-exclamation-circle me-2"></i>
            {{ errorMessage }}
            <button
              type="button"
              class="btn-close"
              @click="errorMessage = ''"
              aria-label="Close"
            ></button>
          </div>
 
          <form @submit.prevent="handleLogin" class="text-start fw-bold">
            <div class="mb-3">
              <label>Email</label>
              <input
                v-model="email"
                type="email"
                class="form-control mt-3"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="mb-3">
              <label>Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control mt-3"
                required
                :disabled="isLoading"
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mt-3"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{ isLoading ? "Sedang login..." : "Akses Login" }}
              <i v-if="!isLoading" class="bi bi-box-arrow-in-right ms-2"></i>
            </button>
          </form>

          <!-- <p class="text-center mt-3 fst-italic">
            Belum punya akun?
            <router-link to="/register">Register</router-link>
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userAPI, apiHelper } from '@/services/api';

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await userAPI.login(this.email, this.password);

        if (!response.success) {
          this.errorMessage =
            response.error || "Login gagal. Silakan coba lagi.";
          return;
        }

        const data = response.data;

        // Clear old data first
        localStorage.clear();

        // Simpan token dan user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Route berdasarkan role
        const role = data.user.role;
        let redirectPath = "/";

        switch (role) {
          case "admin":
            redirectPath = "/admin/dashboard";
            break;
          case "headmaster":
            redirectPath = "/kepala-sekolah/dashboard";
            break;
          case "responsible":
            redirectPath = "/wakasek/dashboard";
            break;
          case "teacher":
            redirectPath = "/guru/dashboard";
            break;
          case "student":
            redirectPath = "/ketua-murid/dashboard";
            break;
          default:
            redirectPath = "/";
        }

        // Redirect ke dashboard
        this.$router.push(redirectPath);
      } catch (error) {
        // console.error('Login error:', error);
        this.errorMessage = apiHelper.formatError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
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

/* HERO LEFT */
.hero-section {
  /* background: linear-gradient(135deg, #e0edff, #ffffff); */
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

/* LOGIN CARD */
.login-card {
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
