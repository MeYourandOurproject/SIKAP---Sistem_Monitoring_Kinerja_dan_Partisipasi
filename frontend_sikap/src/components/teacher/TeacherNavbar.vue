<template>
  <header class="teacher-navbar">
    <div class="breadcrumb">
      <span>Dashboard</span>
      <strong>Dashboard / {{ menuTitle }}</strong>
    </div>
    <div class="dropdown user-dropdown">
      <button
        class="user-menu-button dropdown-toggle"
        type="button"
        id="teacherUserMenu"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="avatar">{{ initials }}</span>
        <div class="user-info">
          <small>Guru</small>
          <strong>{{ userName }}</strong>
        </div>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="teacherUserMenu">
        <li>
          <button class="dropdown-item text-danger" type="button" @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: "TeacherNavbar",
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
.teacher-navbar {
  position: sticky;
  top: 0;
  z-index: 900;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 28px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(15, 23, 42, 0.94);
  backdrop-filter: blur(12px);
}

.breadcrumb {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.breadcrumb span {
  color: #4ade80;
  font-size: 1.15rem;
  font-weight: 700;
}

.breadcrumb strong {
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 400;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: #f8fafc;
  text-align: left;
}

.user-menu-button:hover,
.user-menu-button:focus-visible {
  background: rgba(255, 255, 255, 0.08);
}

.user-info small,
.user-info strong {
  display: block;
}

.user-info small {
  color: #94a3b8;
  font-size: 0.7rem;
}

.user-info strong {
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
}

.avatar {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: #2563eb;
  font-weight: 700;
}

.dropdown-menu {
  min-width: 160px;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}
</style>
