<template>
  <div class="pj-dashboard">
    <div class="hero-card">
      <div class="hero-overlay"></div>
      <div
        class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4 position-relative"
      >
        <div class="text-start">
          <span class="hero-badge">PANEL PENANGGUNG JAWAB</span>
          <h2 class="hero-title mt-3">Halo, {{ userName }} 👋</h2>
          <p class="hero-subtitle mb-0 text-start">
            Pantau agenda sekolah hari ini dan kelola sesi absensi guru dari
            satu tempat.
          </p>
        </div>
        <div class="hero-actions">
          <router-link
            class="hero-btn primary-btn"
            to="/penanggung-jawab/kegiatan"
          >
            <i class="bi bi-calendar-event"></i>
            Kelola Kegiatan
          </router-link>

          <router-link
            class="hero-btn secondary-btn"
            to="/penanggung-jawab/absensi"
          >
            <i class="bi bi-check2-square"></i>
            Kelola Absensi
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="loadError" class="dashboard-error" role="alert">
      <div>
        <i class="bi bi-exclamation-circle-fill me-2"></i>
        {{ loadError }}
      </div>
      <button class="btn btn-sm btn-outline-light mt-3" @click="loadDashboard">
        <i class="bi bi-arrow-clockwise me-1"></i>
        Coba lagi
      </button>
    </div>

    <div v-if="isLoading" class="dashboard-loading">
      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
      Memuat ringkasan dashboard...
    </div>

    <div v-else-if="!loadError" class="row g-4 mt-1 text-start">
      <div class="col-6 col-md-3">
        <div class="stat-card blue-card">
          <div class="stat-icon">
            <i class="bi bi-calendar2-week"></i>
          </div>
          <div>
            <h3>{{ activities.length }}</h3>
            <p>Total Kegiatan</p>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="stat-card green-card">
          <div class="stat-icon">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div>
            <h3>{{ todayActivities.length }}</h3>
            <p>Agenda Hari Ini</p>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card orange-card">
          <div class="stat-icon">
            <i class="bi bi-arrow-repeat"></i>
          </div>
          <div>
            <h3>{{ routineActivitiesCount }}</h3>
            <p>Kegiatan Rutin</p>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card purple-card">
          <div class="stat-icon">
            <i class="bi bi-person-check"></i>
          </div>
          <div>
            <h3>{{ activeSessions.length }}</h3>
            <p>Sesi Absensi Aktif</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && !loadError" class="row g-4 mt-2 text-start">
      <div class="col-12 col-xl-7">
        <div class="glass-card">
          <div class="d-flex justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h5 class="section-title mb-1">Agenda Hari Ini</h5>
              <small class="section-subtitle">{{ todayLabel }}</small>
            </div>
            <router-link
              class="section-link"
              to="/penanggung-jawab/kegiatan"
            >
              Semua kegiatan <i class="bi bi-arrow-right ms-1"></i>
            </router-link>
          </div>

          <div v-if="todayActivities.length" class="activity-list">
            <div
              v-for="activity in todayActivities.slice(0, 5)"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-left">
                <div class="activity-icon">
                  <i
                    class="bi"
                    :class="activity.type === 'routine' ? 'bi-arrow-repeat' : 'bi-calendar-event-fill'"
                  ></i>
                </div>
                <div class="activity-info">
                  <h6>{{ activity.name || activity.title || "Kegiatan sekolah" }}</h6>
                  <small>
                    {{ activity.type === "routine" ? "Rutin" : "Tentatif" }}
                    <span v-if="activity.type !== 'routine' && (activity.start_date || activity.date)">
                      · {{ formatDate(activity.start_date || activity.date) }}
                    </span>
                  </small>
                </div>
              </div>
              <span
                class="activity-status"
                :class="{ 'pending-status': !hasActiveSession(activity) }"
              >
                {{ hasActiveSession(activity) ? "Sesi dibuka" : "Belum dibuka" }}
              </span>
            </div>
          </div>
          <div v-else class="empty-state">
            <i class="bi bi-calendar2-check display-6 d-block mb-2"></i>
            Tidak ada agenda terjadwal hari ini.
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-5">
        <div class="glass-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h5 class="section-title mb-1">Sesi Absensi Hari Ini</h5>
              <small class="section-subtitle">Sesi yang siap dikelola</small>
            </div>
            <router-link
              class="section-link"
              to="/penanggung-jawab/absensi"
              aria-label="Buka halaman absensi"
            >
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>

          <div v-if="activeSessions.length" class="attendance-list">
            <div
              v-for="session in activeSessions.slice(0, 5)"
              :key="session.id"
              class="attendance-item"
            >
              <div class="attendance-avatar">
                <i class="bi bi-people-fill"></i>
              </div>
              <div class="attendance-content">
                <h6>{{ session.activity_name || "Kegiatan sekolah" }}</h6>
                <small>
                  {{ formatSession(session.session) }}
                  <span v-if="session.target_type">
                    · {{ formatTarget(session.target_type) }}
                  </span>
                </small>
              </div>
              <span class="attendance-status success-status">Aktif</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <i class="bi bi-clipboard-check display-6 d-block mb-2"></i>
            Belum ada sesi absensi yang dibuka hari ini.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivities, getActiveActivitySessions } from "@/services/api";
import {
  applicationClock,
  getApplicationDateKey,
} from "@/services/applicationClock";

export default {
  name: "PersonResponsibleDashboard",
  data() {
    return {
      userName: "Penanggung Jawab",
      activities: [],
      activeSessions: [],
      isLoading: true,
      loadError: "",
    };
  },
  computed: {
    todayActivities() {
      const today = this.getTodayDateKey();
      const weekday = new Date(`${today}T00:00:00.000Z`).getUTCDay();
      return this.activities.filter((activity) =>
        this.activityOccursToday(activity, today, weekday),
      );
    },
    routineActivitiesCount() {
      return this.activities.filter((activity) => activity.type === "routine").length;
    },
    todayLabel() {
      return applicationClock.currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      });
    },
  },
  mounted() {
    this.loadUserName();
    this.loadDashboard();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.userName = user.fullname || user.name || "Penanggung Jawab";
      } catch (error) {
        console.error("Gagal memuat nama pengguna:", error);
      }
    },
    async loadDashboard() {
      this.isLoading = true;
      this.loadError = "";
      try {
        const [activityResponse, sessionResponse] = await Promise.all([
          getActivities(),
          getActiveActivitySessions(),
        ]);
        if (!activityResponse.success) {
          throw new Error(activityResponse.message || "Gagal memuat kegiatan.");
        }
        if (!sessionResponse.success) {
          throw new Error(sessionResponse.message || "Gagal memuat sesi absensi.");
        }
        if (!Array.isArray(activityResponse.data) || !Array.isArray(sessionResponse.data)) {
          throw new Error("Format data dashboard tidak valid.");
        }
        this.activities = activityResponse.data;
        this.activeSessions = sessionResponse.data;
      } catch (error) {
        console.error("Gagal memuat dashboard penanggung jawab:", error);
        this.loadError = error.message || "Dashboard gagal dimuat. Silakan coba lagi.";
      } finally {
        this.isLoading = false;
      }
    },
    getTodayDateKey() {
      return getApplicationDateKey();
    },
    activityOccursToday(activity, today, weekday) {
      if (activity.type === "routine") {
        const activityDay = String(activity.day_of_week || "").toLowerCase();
        if (activityDay) {
          const weekdayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const weekdayNamesId = [
            "minggu",
            "senin",
            "selasa",
            "rabu",
            "kamis",
            "jumat",
            "sabtu",
          ];
          return (
            activityDay === weekdayNames[weekday] ||
            activityDay === weekdayNamesId[weekday]
          );
        }
        const assignments =
          activity.Teacherassignments ||
          activity.teacherassignments ||
          activity.TeacherAssignments ||
          [];
        if (!assignments.length) return true;
        const weekdayNames = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const weekdayNamesId = [
          "minggu",
          "senin",
          "selasa",
          "rabu",
          "kamis",
          "jumat",
          "sabtu",
        ];
        return assignments.some((assignment) => {
          const day = String(assignment.day_of_week || "").toLowerCase();
          return day === weekdayNames[weekday] || day === weekdayNamesId[weekday];
        });
      }
      const startDate = this.toDateKey(activity.start_date || activity.date);
      const endDate = this.toDateKey(activity.end_date || activity.start_date || activity.date);
      return Boolean(startDate && endDate && today >= startDate && today <= endDate);
    },
    toDateKey(date) {
      if (!date) return "";
      if (typeof date === "string") return date.slice(0, 10);
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return "";
      return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
    },
    hasActiveSession(activity) {
      return this.activeSessions.some(
        (session) => Number(session.activity_id) === Number(activity.id),
      );
    },
    formatDate(date) {
      if (!date) return "-";
      const dateKey = this.toDateKey(date);
      return new Date(`${dateKey}T00:00:00`).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    formatSession(session) {
      const labels = {
        morning: "Pagi",
        afternoon: "Siang",
        all_day: "Seharian",
      };
      return labels[session] || session || "Sesi";
    },
    formatTarget(target) {
      return target === "all_teachers" ? "Semua guru aktif" : "Guru terpilih";
    },
  },
};
</script>

<style scoped>
.pj-dashboard {
  color: white;

  animation: fadePage 0.3s ease;
}

/* HERO */
.hero-card {
  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      rgba(37, 99, 235, 0.25),
      rgba(15, 23, 42, 0.95)
    );

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 28px;

  padding: 32px;

  margin-bottom: 20px;
}

.hero-overlay {
  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at top right,
      rgba(59,130,246,0.35),
      transparent 40%
    );
}

.hero-badge {
  background: rgba(34,197,94,0.15);

  color: #4ade80;

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 1px;
}

.hero-title {
  font-size: 36px;

  font-weight: 700;

  color: white;
}

.hero-subtitle {
  max-width: 700px;

  color: #94a3b8;

  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 14px;

  flex-wrap: wrap;
}

.hero-btn {
  height: 52px;

  padding: 0 22px;

  border-radius: 16px;

  display: flex;
  align-items: center;

  gap: 10px;

  text-decoration: none;

  font-weight: 600;

  transition: 0.25s ease;
}

.primary-btn {
  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );

  color: white;
}

.secondary-btn {
  background: rgba(255,255,255,0.05);

  border: 1px solid rgba(255,255,255,0.08);

  color: white;
}

.hero-btn:hover {
  transform: translateY(-2px);

  color: white;
}

/* STAT */
.stat-card {
  border-radius: 24px;

  padding: 22px;

  display: flex;
  align-items: center;

  gap: 16px;

  color: white;

  min-height: 120px;

  position: relative;

  overflow: hidden;
}

.stat-card::before {
  content: "";

  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at top right,
      rgba(255,255,255,0.12),
      transparent 45%
    );
}

.stat-icon {
  width: 60px;
  height: 60px;

  border-radius: 18px;

  background: rgba(255,255,255,0.15);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.stat-card h3 {
  margin: 0;

  font-size: 30px;
  font-weight: 700;
}

.stat-card p {
  margin: 4px 0 0;

  opacity: 0.8;

  font-size: 13px;
}

.blue-card {
  background: linear-gradient(135deg,#2563eb,#1d4ed8);
}

.green-card {
  background: linear-gradient(135deg,#16a34a,#15803d);
}

.orange-card {
  background: linear-gradient(135deg,#ea580c,#c2410c);
}

.purple-card {
  background: linear-gradient(135deg,#7c3aed,#6d28d9);
}

/* GLASS */
.glass-card {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 28px;

  padding: 24px;

  backdrop-filter: blur(16px);
}

.section-title {
  color: white;

  font-weight: 700;
}

.section-subtitle {
  color: #94a3b8;
}

.section-link {
  color: #60a5fa;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.section-link:hover {
  color: #93c5fd;
}

.dashboard-loading,
.dashboard-error {
  margin: 20px 0;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
}

.dashboard-error {
  border-color: rgba(248, 113, 113, 0.28);
  color: #fecaca;
}

.section-badge {
  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

.green-badge {
  background: rgba(34,197,94,0.15);

  color: #4ade80;
}

/* ACTIVITY */
.activity-list,
.attendance-list {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.activity-item,
.attendance-item {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 20px;

  padding: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: 0.2s ease;
}

.activity-item:hover,
.attendance-item:hover {
  transform: translateY(-2px);

  background: rgba(255,255,255,0.05);
}

.activity-left {
  display: flex;
  align-items: center;

  gap: 14px;
}

.activity-icon {
  width: 52px;
  height: 52px;

  border-radius: 16px;

  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
}

.activity-left h6,
.attendance-content h6 {
  margin: 0;

  color: white;
}

.activity-info {
  min-width: 0;
}

.activity-info h6 {
  overflow-wrap: anywhere;
}

.activity-left small,
.attendance-content small {
  color: #94a3b8;
}

.activity-status {
  background: rgba(34,197,94,0.15);

  color: #4ade80;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.pending-status {
  background: rgba(234, 179, 8, 0.14);
  color: #facc15;
}

/* ATTENDANCE */
.attendance-avatar {
  width: 48px;
  height: 48px;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    #2563eb,
    #7c3aed
  );

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;

  color: white;
}

.attendance-item {
  gap: 14px;
}

.attendance-content {
  flex: 1;
}

.attendance-status {
  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.success-status {
  background: rgba(34,197,94,0.15);

  color: #4ade80;
}

.warning-status {
  background: rgba(239,68,68,0.15);

  color: #f87171;
}

/* EMPTY */
.empty-state {
  text-align: center;

  padding: 40px 20px;

  color: #94a3b8;
}

/* ANIMATION */
@keyframes fadePage {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* MOBILE */
@media (max-width: 768px) {

  .hero-card {
    padding: 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-actions {
    width: 100%;
  }

  .hero-btn {
    flex: 1;
    justify-content: center;
  }

  .stat-card {
    min-height: 100px;
  }

  .stat-card h3 {
    font-size: 24px;
  }

  .activity-item,
  .attendance-item {
    flex-direction: column;
    align-items: flex-start;

    gap: 14px;
  }

  .activity-status,
  .attendance-status {
    align-self: flex-start;
  }
}
</style>