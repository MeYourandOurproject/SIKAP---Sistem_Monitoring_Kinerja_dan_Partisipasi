<template>
  <nav class="teacher-mobile-navbar">
    <div class="brand">
      <img src="../../assets/sikap_logo.PNG" alt="Logo SIKAP" />
      <div>
        <strong>SIKAP</strong>
        <small>{{ menuTitle }}</small>
      </div>
    </div>

    <div class="dropdown">
      <button
        class="user-menu-button"
        type="button"
        id="teacherMobileUserMenu"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Menu pengguna"
      >
        <span class="avatar">{{ initials }}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="teacherMobileUserMenu">
        <li class="dropdown-header">{{ userName }}</li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <button class="dropdown-item text-danger" type="button" @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TeacherMobileNavbar",
  props: {
    menuTitle: {
      type: String,
      default: "Dashboard",
    },
  },
  data() {
    return {
      userName: "Guru",
    };
  },
  computed: {
    initials() {
      return this.userName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "G";
    },
  },
  mounted() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      this.userName = user.name || user.username || "Guru";
    } catch (error) {
      console.error("Gagal membaca data pengguna:", error);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("session_expires_at");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.teacher-mobile-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 900;
  display: flex;
  width: 100%;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.brand img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  color: #4ade80;
  font-size: 1rem;
  letter-spacing: 0.16em;
}

.brand small {
  max-width: 220px;
  overflow: hidden;
  color: #cbd5e1;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu-button {
  display: grid;
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
}

.user-menu-button:hover,
.user-menu-button:focus-visible {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
}

.dropdown-menu {
  min-width: 180px;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

@media (max-width: 575px) {
  .teacher-mobile-navbar {
    min-height: 68px;
    padding: 8px 14px;
  }

  .brand img {
    width: 40px;
    height: 40px;
  }
}
</style>
