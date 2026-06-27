<template>
  <div class="report-page">
    <div class="page-header">
      <div>
        <h3 class="page-title">Laporan Validasi</h3>
        <p class="page-subtitle">
          Daftar seluruh laporan validasi kehadiran guru yang sudah direkam.
        </p>
      </div>
      <router-link class="scan-btn" to="/ketua-murid/validasi">
        <i class="bi bi-check2-square"></i>
        Buat Validasi Baru
      </router-link>
    </div>

    <div class="glass-card report-card">
      <div class="section-header mb-4">
        <div>
          <h5 class="section-title mb-1">Riwayat Validasi</h5>
          <small class="section-subtitle">Urutan berdasarkan waktu terakhir.</small>
        </div>
        <span class="section-badge">{{ records.length }} Laporan</span>
      </div>

      <div v-if="records.length" class="report-list">
        <div v-for="record in records" :key="record.id" class="report-item">
          <div>
            <h6>{{ getTeacherName(record) }}</h6>
            <p class="report-meta">{{ getScheduleText(record) }} • Kelas {{ record.classroomId }}</p>
            <p class="report-note">{{ record.note || 'Tidak ada catatan tambahan.' }}</p>
          </div>
          <div class="report-status">
            <span class="status-badge" :class="record.attendanceStatus">{{ record.attendanceStatus }}</span>
            <small>{{ record.timeStatus === 'terlambat' ? 'Terlambat' : 'Tepat Waktu' }}</small>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <i class="bi bi-journal-x"></i>
        <h5>Belum Ada Laporan</h5>
        <p>Segera buat validasi kehadiran guru agar laporan tercatat.</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { attendanceAPI } from '@/utils/api';

export default {
  name: 'StudentReport',
  data() {
    return {
      records: [],
    };
  },
  mounted() {
    this.fetchRecords();
  },
  methods: {
    async fetchRecords() {
      const response = await attendanceAPI.getAll();
      if (response.success) {
        this.records = response.data;
      }
    },
    getTeacherName(record) {
      return record.Teacher?.name || `Guru ID ${record.teacherId}`;
    },
    getScheduleText(record) {
      if (record.Schedule) {
        return `${record.Schedule.subject?.name || 'Mapel'} • ${record.Schedule.day} ${record.Schedule.startTime.slice(0, 5)} - ${record.Schedule.endTime.slice(0, 5)}`;
      }
      return `Schedule ${record.scheduleId}`;
    },
  },
};
</script>

<style scoped>
.report-page {
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 0.35rem;
}

.page-subtitle {
  color: rgba(248, 250, 252, 0.7);
}

.scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  background: #10b981;
  color: white;
  border-radius: 16px;
  padding: 12px 18px;
  text-decoration: none;
}

.glass-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-item {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.report-meta {
  color: rgba(248, 250, 252, 0.65);
  margin: 0.35rem 0 0;
}

.report-note {
  color: rgba(248, 250, 252, 0.8);
  margin-top: 0.9rem;
}

.report-status {
  text-align: right;
  min-width: 140px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  text-transform: capitalize;
  margin-bottom: 0.75rem;
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

.empty-state i {
  font-size: 2.2rem;
  margin-bottom: 14px;
}
</style>
