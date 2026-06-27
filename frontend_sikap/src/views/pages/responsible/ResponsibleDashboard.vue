<template>
  <div class="pj-dashboard">
    <!-- HERO -->
    <div class="hero-card">
      <div class="hero-overlay"></div>

      <div
        class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4 position-relative"
      >
        <div>
          <span class="hero-badge">
            PANEL PENANGGUNG JAWAB
          </span>

          <h2 class="hero-title mt-3">
            Halo, {{ userName }} 👋
          </h2>

          <p class="hero-subtitle mb-0">
            Kelola kegiatan sekolah, monitoring absensi guru, dan validasi
            aktivitas sekolah dalam satu dashboard modern.
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
            Catat Absensi
          </router-link>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="row g-4 mt-1">

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
            <i class="bi bi-person-check"></i>
          </div>

          <div>
            <h3>{{ attendanceRecords.length }}</h3>
            <p>Absensi Masuk</p>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="stat-card orange-card">
          <div class="stat-icon">
            <i class="bi bi-clock-history"></i>
          </div>

          <div>
            <h3>12</h3>
            <p>Kegiatan Minggu Ini</p>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="stat-card purple-card">
          <div class="stat-icon">
            <i class="bi bi-bar-chart-line"></i>
          </div>

          <div>
            <h3>94%</h3>
            <p>Tingkat Partisipasi</p>
          </div>
        </div>
      </div>

    </div>

    <!-- CONTENT -->
    <div class="row g-4 mt-2">

      <!-- KEGIATAN -->
      <div class="col-12 col-xl-7">

        <div class="glass-card">

          <div
            class="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h5 class="section-title mb-1">
                Kegiatan Terbaru
              </h5>

              <small class="section-subtitle">
                Monitoring kegiatan aktif sekolah
              </small>
            </div>

            <span class="section-badge">
              {{ activities.length }} Data
            </span>
          </div>

          <div
            v-if="activities.length"
            class="activity-list"
          >

            <div
              v-for="activity in activities.slice(0, 5)"
              :key="activity.id"
              class="activity-item"
            >

              <div class="activity-left">

                <div class="activity-icon">
                  <i class="bi bi-calendar-event-fill"></i>
                </div>

                <div>
                  <h6>{{ activity.name }}</h6>

                  <small>
                    {{ activity.type }} •
                    {{ formatDate(activity.date) }}
                  </small>
                </div>

              </div>

              <span class="activity-status">
                {{ activity.status }}
              </span>

            </div>

          </div>

          <div
            v-else
            class="empty-state"
          >
            Belum ada kegiatan terbaru.
          </div>

        </div>

      </div>

      <!-- ABSENSI -->
      <div class="col-12 col-xl-5">

        <div class="glass-card h-100">

          <div
            class="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h5 class="section-title mb-1">
                Absensi Terakhir
              </h5>

              <small class="section-subtitle">
                Data validasi terbaru
              </small>
            </div>

            <span class="section-badge green-badge">
              {{ attendanceRecords.length }}
            </span>
          </div>

          <div
            v-if="attendanceRecords.length"
            class="attendance-list"
          >

            <div
              v-for="record in attendanceRecords.slice(0, 5)"
              :key="record.id"
              class="attendance-item"
            >

              <div class="attendance-avatar">
                {{ record.teacherId }}
              </div>

              <div class="attendance-content">

                <h6>
                  Guru ID {{ record.teacherId }}
                </h6>

                <small>
                  Kelas {{ record.classroomId }}
                </small>

              </div>

              <span
                class="attendance-status"
                :class="record.attendanceStatus === 'Hadir'
                  ? 'success-status'
                  : 'warning-status'"
              >
                {{ record.attendanceStatus }}
              </span>

            </div>

          </div>

          <div
            v-else
            class="empty-state"
          >
            Belum ada data absensi.
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
// import { activityAPI, attendanceAPI } from "@/utils/api";

export default {
  name: "PersonResponsibleDashboard",

  data() {
    return {
      userName: "Penanggung Jawab",

      activities: [],

      attendanceRecords: [],
    };
  },

  mounted() {
    this.loadUserName();

    this.fetchActivities();

    this.fetchAttendanceRecords();
  },

  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        this.userName =
          user.fullname || user.name || "Penanggung Jawab";
      } catch (error) {
        console.error(error);
      }
    },

    async fetchActivities() {
      const response = await activityAPI.getAll();

      if (response.success) {
        this.activities = response.data;
      }
    },

    async fetchAttendanceRecords() {
      const response = await attendanceAPI.getAll();

      if (response.success) {
        this.attendanceRecords = response.data;
      }
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
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