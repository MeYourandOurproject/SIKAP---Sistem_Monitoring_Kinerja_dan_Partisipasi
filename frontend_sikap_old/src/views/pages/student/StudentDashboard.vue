<template>
  <div class="student-dashboard mt-3">
    <div class="hero-card">
      <div class="hero-overlay"></div>

      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4 position-relative">
        <div>
          <span class="hero-badge">PANEL KETUA MURID</span>
          <h2 class="hero-title mt-3">Halo, {{ userName }} 👋</h2>
          <p class="hero-subtitle mb-0">
            Pantau validasi guru, kirim laporan kehadiran, dan cek ringkasan aktivitas kelas di sini.
          </p>
        </div>

        <div class="hero-actions">
          <router-link class="hero-btn primary-btn" to="/ketua-murid/validasi">
            <i class="bi bi-check2-square"></i>
            Validasi Kehadiran
          </router-link>
          <router-link class="hero-btn secondary-btn" to="/ketua-murid/laporan">
            <i class="bi bi-journal-text"></i>
            Lihat Laporan
          </router-link>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div class="col-6 col-md-3">
        <div class="stat-card blue-card">
          <div class="stat-icon"><i class="bi bi-journal-check"></i></div>
          <div>
            <h3>{{ totalRecords }}</h3>
            <p>Validasi Terkirim</p>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="stat-card green-card">
          <div class="stat-icon"><i class="bi bi-check-circle-fill"></i></div>
          <div>
            <h3>{{ presentCount }}</h3>
            <p>Guru Hadir</p>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="stat-card orange-card">
          <div class="stat-icon"><i class="bi bi-clock-history"></i></div>
          <div>
            <h3>{{ lateCount }}</h3>
            <p>Guru Terlambat</p>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="stat-card purple-card">
          <div class="stat-icon"><i class="bi bi-person-lines-fill"></i></div>
          <div>
            <h3>{{ schedules.length }}</h3>
            <p>Jadwal Tersedia</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div class="col-12 col-xl-7">
        <div class="glass-card">
          <div class="section-header mb-4">
            <div>
              <h5 class="section-title mb-1">Validasi Terbaru</h5>
              <small class="section-subtitle">Aktivitas validasi yang baru dikirim.</small>
            </div>
            <span class="section-badge">{{ attendanceRecords.length }} Data</span>
          </div>

          <div v-if="attendanceRecords.length" class="activity-list">
            <div v-for="record in attendanceRecords.slice(0, 5)" :key="record.id" class="activity-item">
              <div class="activity-left">
                <div class="activity-icon"><i class="bi bi-person-check"></i></div>
                <div>
                  <h6>{{ getTeacherName(record) }}</h6>
                  <small>{{ getScheduleText(record) }}</small>
                </div>
              </div>
              <span class="status-badge" :class="record.attendanceStatus">{{ record.attendanceStatus }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            Belum ada validasi kehadiran.
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-5">
        <div class="glass-card h-100">
          <div class="section-header mb-4">
            <div>
              <h5 class="section-title mb-1">Jadwal Kelas</h5>
              <small class="section-subtitle">Pilih jadwal untuk validasi guru.</small>
            </div>
            <span class="section-badge success-badge">{{ schedules.length }} Jadwal</span>
          </div>

          <div v-if="schedules.length" class="schedule-list">
            <div v-for="schedule in schedules.slice(0, 5)" :key="schedule.id" class="schedule-item">
              <div>
                <h6>{{ schedule.subject?.name || 'Mata Pelajaran' }}</h6>
                <small>{{ schedule.day }} • {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}</small>
              </div>
              <span>{{ schedule.teacher?.name || 'Guru' }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            Jadwal belum tersedia.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { attendanceAPI, scheduleAPI } from '@/utils/api';

export default {
  name: 'StudentDashboard',
  data() {
    return {
      userName: 'Ketua Murid',
      attendanceRecords: [],
      schedules: [],
    };
  },
  computed: {
    totalRecords() {
      return this.attendanceRecords.length;
    },
    presentCount() {
      return this.attendanceRecords.filter((item) => item.attendanceStatus === 'hadir').length;
    },
    lateCount() {
      return this.attendanceRecords.filter((item) => item.timeStatus === 'terlambat').length;
    },
  },
  mounted() {
    this.loadUserName();
    this.fetchRecords();
    this.fetchSchedules();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.userName = user.fullname || user.name || 'Ketua Murid';
      } catch (error) {
        console.error(error);
      }
    },
    async fetchRecords() {
      const response = await attendanceAPI.getAll();
      if (response.success) {
        this.attendanceRecords = response.data;
      }
    },
    async fetchSchedules() {
      const response = await scheduleAPI.getAll();
      if (response.success) {
        this.schedules = response.data;
      }
    },
    getTeacherName(record) {
      return record.Teacher?.name || `Guru ID ${record.teacherId}`;
    },
    getScheduleText(record) {
      const scheduleText = record.Schedule
        ? `${record.Schedule.day} • ${this.formatTime(record.Schedule.startTime)}
          - ${this.formatTime(record.Schedule.endTime)}`
        : `Schedule ${record.scheduleId}`;
      return scheduleText;
    },
    formatTime(value) {
      if (!value) return '-';
      return value.slice(0, 5);
    },
  },
};
</script>

<style scoped>
.student-dashboard {
  color: white;
  animation: fadePage 0.3s ease;
}

.hero-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 32px;
  margin-bottom: 20px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.35), transparent 40%);
}

.hero-badge {
  background: rgba(34, 197, 94, 0.15);
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
  color: rgba(248, 250, 252, 0.8);
  max-width: 620px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 12px 18px;
  border-radius: 16px;
  font-weight: 600;
  text-decoration: none;
}

.primary-btn {
  background: #10b981;
  color: white;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.stat-card {
  border-radius: 24px;
  padding: 22px;
  min-height: 150px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.blue-card {
  background: rgba(59, 130, 246, 0.12);
}

.green-card {
  background: rgba(16, 185, 129, 0.12);
}

.orange-card {
  background: rgba(249, 115, 22, 0.12);
}

.purple-card {
  background: rgba(168, 85, 247, 0.12);
}

.stat-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.section-subtitle {
  color: rgba(248, 250, 252, 0.7);
}

.section-badge {
  background: rgba(255, 255, 255, 0.08);
  color: #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.success-badge {
  background: rgba(16, 185, 129, 0.18);
  color: #bbf7d0;
}

.glass-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px;
}

.activity-item,
.schedule-item {
  padding: 18px;
  margin-bottom: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.activity-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.2);
  display: grid;
  place-items: center;
  color: #a7f3d0;
}

.status-badge {
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 0.78rem;
  text-transform: capitalize;
  letter-spacing: 0.01em;
}

.status-badge.hadir {
  background: rgba(16, 185, 129, 0.18);
  color: #a7f3d0;
}

.status-badge.izin,
.status-badge.sakit,
.status-badge.absen {
  background: rgba(249, 115, 22, 0.18);
  color: #fdba74;
}

.empty-state {
  border-radius: 24px;
  padding: 28px;
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(248, 250, 252, 0.75);
}
</style>
