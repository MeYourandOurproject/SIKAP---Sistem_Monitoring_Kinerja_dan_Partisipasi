<template>
  <aside class="teacher-sidebar">
    <div class="brand">
      <img src="../../assets/sikap_logo.PNG" alt="Logo SIKAP" />
      <div>
        <strong>SIKAP</strong>
        <small>Sistem Informasi Kinerja &amp; Partisipasi</small>
      </div>
    </div>

    <div class="role-label">MENU GURU</div>
    <nav class="nav flex-column">
      <RouterLink to="/guru/dashboard" class="nav-link">
        <i class="bi bi-grid-fill"></i>
        <span>Dashboard</span>
      </RouterLink>
      <RouterLink to="/guru/jadwal" class="nav-link">
        <i class="bi bi-calendar-week-fill"></i>
        <span>Jadwal Mengajar</span>
      </RouterLink>
      <RouterLink to="/guru/kegiatan" class="nav-link">
        <i class="bi bi-clipboard2-check-fill"></i>
        <span>Tugas &amp; Kegiatan</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="avatar">{{ initials }}</div>
      <div class="user-details">
        <strong>{{ userName }}</strong>
        <small>Guru</small>
      </div>
      <button type="button" aria-label="Keluar" title="Keluar" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: "TeacherSidebar",
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
        .join("");
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
.teacher-sidebar {
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  color: #e2e8f0;
  background: #111c31;
  border-right: 1px solid rgba(148, 163, 184, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 32px;
}

.brand img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.brand strong {
  display: block;
  color: #4ade80;
  font-size: 1.15rem;
  letter-spacing: 0.18em;
}

.brand small {
  display: block;
  max-width: 180px;
  color: #94a3b8;
  font-size: 0.68rem;
  line-height: 1.35;
}

.role-label {
  padding: 0 12px 10px;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 3px 0;
  padding: 12px;
  border-radius: 12px;
  color: #cbd5e1;
  text-align: left;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #f8fafc;
  background: rgba(34, 197, 94, 0.14);
}

.nav-link.router-link-active i {
  color: #4ade80;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 16px 4px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}

.avatar {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #16a34a;
  color: #fff;
  font-weight: 700;
}

.user-details {
  min-width: 0;
  flex: 1;
  text-align: left;
}

.user-details strong,
.user-details small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-details small {
  color: #94a3b8;
}

.sidebar-footer button {
  border: 0;
  background: transparent;
  color: #94a3b8;
  font-size: 1.1rem;
}

.sidebar-footer button:hover {
  color: #f87171;
}
</style>
