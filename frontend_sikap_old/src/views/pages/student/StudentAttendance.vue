<template>
  <div class="attendance-page">
    <div class="page-header">
      <div>
        <h3 class="page-title">Validasi Kehadiran Guru</h3>
        <p class="page-subtitle">
          Laporkan kondisi kehadiran guru di kelas Anda dan catat status pembelajaran.
        </p>
      </div>
      <router-link class="scan-btn" to="/ketua-murid/laporan">
        <i class="bi bi-journal-text"></i>
        Lihat Laporan
      </router-link>
    </div>

    <div class="row g-4">
      <div class="col-12 col-xl-5">
        <div class="glass-card form-card">
          <div class="section-header">
            <div>
              <h5>Form Validasi</h5>
              <small>Isi data kehadiran guru secara lengkap.</small>
            </div>
            <div class="live-badge">LIVE</div>
          </div>

          <div v-if="message.text" :class="['custom-alert', message.type === 'success' ? 'success' : 'danger']">
            {{ message.text }}
          </div>

          <form @submit.prevent="submitAttendance">
            <div class="input-group-custom">
              <label>Jadwal</label>
              <div class="input-wrapper">
                <i class="bi bi-calendar-week"></i>
                <select v-model="form.scheduleId">
                  <option value="">Pilih jadwal</option>
                  <option v-for="item in schedules" :key="item.id" :value="item.id">
                    {{ item.subject?.name || 'Mapel' }} • {{ item.day }} {{ formatTime(item.startTime) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-6">
                <div class="input-group-custom">
                  <label>Guru</label>
                  <div class="input-wrapper">
                    <i class="bi bi-person-badge"></i>
                    <input v-model="form.teacherName" type="text" placeholder="Otomatis setelah pilih jadwal" readonly />
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="input-group-custom">
                  <label>Kelas</label>
                  <div class="input-wrapper">
                    <i class="bi bi-building"></i>
                    <input v-model="form.classroomName" type="text" placeholder="Otomatis setelah pilih jadwal" readonly />
                  </div>
                </div>
              </div>
            </div>

            <div class="input-group-custom">
              <label>Status Kehadiran</label>
              <div class="status-grid">
                <button type="button" class="status-option hadir" :class="{ active: form.attendanceStatus === 'hadir' }" @click="form.attendanceStatus = 'hadir'">
                  <i class="bi bi-check-circle-fill"></i>
                  Hadir
                </button>
                <button type="button" class="status-option izin" :class="{ active: form.attendanceStatus === 'izin' }" @click="form.attendanceStatus = 'izin'">
                  <i class="bi bi-envelope-fill"></i>
                  Izin
                </button>
                <button type="button" class="status-option sakit" :class="{ active: form.attendanceStatus === 'sakit' }" @click="form.attendanceStatus = 'sakit'">
                  <i class="bi bi-heart-pulse-fill"></i>
                  Sakit
                </button>
                <button type="button" class="status-option absen" :class="{ active: form.attendanceStatus === 'absen' }" @click="form.attendanceStatus = 'absen'">
                  <i class="bi bi-x-circle-fill"></i>
                  Absen
                </button>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-6">
                <div class="input-group-custom">
                  <label>Status Waktu</label>
                  <select v-model="form.timeStatus">
                    <option value="">Pilih status</option>
                    <option value="tepat_waktu">Tepat Waktu</option>
                    <option value="terlambat">Terlambat</option>
                  </select>
                </div>
              </div>
              <div class="col-6">
                <div class="input-group-custom">
                  <label>Pembelajaran</label>
                  <select v-model="form.learningStatus">
                    <option value="">Pilih status</option>
                    <option value="aktif">Aktif</option>
                    <option value="kurang_aktif">Kurang Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="input-group-custom">
              <label>Catatan</label>
              <textarea v-model="form.note" rows="4" placeholder="Tambahkan catatan jika diperlukan..."></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <i class="bi bi-save-fill"></i>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Validasi' }}
            </button>
          </form>
        </div>
      </div>

      <div class="col-12 col-xl-7">
        <div class="glass-card history-card">
          <div class="section-header mb-4">
            <div>
              <h5>Riwayat Validasi</h5>
              <small>Daftar validasi kehadiran guru yang sudah dikirim.</small>
            </div>
            <div class="history-total">{{ records.length }} Data</div>
          </div>

          <div v-if="records.length" class="attendance-list">
            <div v-for="record in records" :key="record.id" class="attendance-item">
              <div class="attendance-left">
                <div class="attendance-avatar" :class="record.attendanceStatus">
                  <i class="bi" :class="getAttendanceIcon(record.attendanceStatus)"></i>
                </div>
                <div>
                  <h6>{{ getTeacherName(record) }}</h6>
                  <small>{{ getScheduleSummary(record) }}</small>
                </div>
              </div>
              <div class="attendance-right">
                <span class="status-badge" :class="record.attendanceStatus">{{ record.attendanceStatus }}</span>
                <small>{{ record.timeStatus === 'terlambat' ? 'Terlambat' : 'Tepat Waktu' }}</small>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="bi bi-journal-x"></i>
            <h5>Belum Ada Validasi</h5>
            <p>Hasil validasi akan muncul setelah Anda mengirim laporan.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { attendanceAPI, scheduleAPI } from '@/utils/api';

export default {
  name: 'StudentAttendance',
  data() {
    return {
      schedules: [],
      records: [],
      isSubmitting: false,
      message: { text: '', type: 'success' },
      form: {
        scheduleId: '',
        teacherId: null,
        teacherName: '',
        classroomId: null,
        classroomName: '',
        attendanceStatus: '',
        timeStatus: '',
        learningStatus: '',
        note: '',
      },
    };
  },
  mounted() {
    this.fetchSchedules();
    this.fetchRecords();
  },
  watch: {
    'form.scheduleId'(value) {
      const selected = this.schedules.find((item) => item.id === Number(value));
      if (selected) {
        this.form.teacherId = selected.teacherId;
        this.form.teacherName = selected.Teacher?.name || `Guru ${selected.teacherId}`;
        this.form.classroomId = selected.classroomId;
        this.form.classroomName = selected.Classroom?.name || `Kelas ${selected.classroomId}`;
      } else {
        this.form.teacherId = null;
        this.form.teacherName = '';
        this.form.classroomId = null;
        this.form.classroomName = '';
      }
    },
  },
  methods: {
    async fetchSchedules() {
      const response = await scheduleAPI.getAll();
      if (response.success) {
        this.schedules = response.data;
      }
    },
    async fetchRecords() {
      const response = await attendanceAPI.getAll();
      if (response.success) {
        this.records = response.data;
      }
    },
    async submitAttendance() {
      if (!this.form.scheduleId || !this.form.teacherId || !this.form.classroomId || !this.form.attendanceStatus || !this.form.timeStatus || !this.form.learningStatus) {
        this.message = { text: 'Semua field wajib diisi.', type: 'danger' };
        return;
      }

      this.isSubmitting = true;
      const response = await attendanceAPI.create({
        scheduleId: Number(this.form.scheduleId),
        teacherId: Number(this.form.teacherId),
        classroomId: Number(this.form.classroomId),
        attendanceStatus: this.form.attendanceStatus,
        timeStatus: this.form.timeStatus,
        learningStatus: this.form.learningStatus,
        note: this.form.note,
      });

      if (response.success) {
        this.message = { text: 'Validasi berhasil dikirim.', type: 'success' };
        this.form.attendanceStatus = '';
        this.form.timeStatus = '';
        this.form.learningStatus = '';
        this.form.note = '';
        this.fetchRecords();
      } else {
        this.message = { text: response.error || 'Gagal mengirim validasi.', type: 'danger' };
      }

      this.isSubmitting = false;
    },
    getAttendanceIcon(status) {
      switch (status) {
        case 'hadir':
          return 'bi-check-circle-fill';
        case 'izin':
          return 'bi-envelope-fill';
        case 'sakit':
          return 'bi-heart-pulse-fill';
        default:
          return 'bi-x-circle-fill';
      }
    },
    getTeacherName(record) {
      return record.Teacher?.name || `Guru ID ${record.teacherId}`;
    },
    getScheduleSummary(record) {
      if (record.Schedule) {
        return `${record.Schedule.day} • ${record.Schedule.startTime.slice(0, 5)} - ${record.Schedule.endTime.slice(0, 5)}`;
      }
      return `Schedule ${record.scheduleId}`;
    },
    formatTime(value) {
      return value ? value.slice(0, 5) : '-';
    },
  },
};
</script>

<style scoped>
.attendance-page {
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
  max-width: 650px;
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

.section-header h5 {
  margin: 0;
}

.live-badge {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.18);
  color: #a7f3d0;
  font-size: 0.8rem;
  font-weight: 700;
}

.custom-alert {
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 1rem;
}

.custom-alert.success {
  background: rgba(16, 185, 129, 0.18);
  color: #bbf7d0;
}

.custom-alert.danger {
  background: rgba(248, 113, 113, 0.18);
  color: #fecaca;
}

.input-group-custom {
  margin-bottom: 1rem;
}

.input-group-custom label {
  display: block;
  margin-bottom: 0.55rem;
  color: #cbd5e1;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: rgba(148, 163, 184, 0.9);
}

input,
select,
textarea {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  outline: none;
}

select {
  appearance: none;
}

textarea {
  min-height: 120px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  cursor: pointer;
}

.status-option.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
}

.status-option i {
  font-size: 1.2rem;
}

.submit-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 14px 20px;
  border-radius: 18px;
  background: #10b981;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.attendance-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.attendance-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.attendance-avatar {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
}

.attendance-avatar.hadir {
  background: rgba(16, 185, 129, 0.25);
}

.attendance-avatar.izin,
.attendance-avatar.sakit,
.attendance-avatar.absen {
  background: rgba(249, 115, 22, 0.2);
}

.status-badge {
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  text-transform: capitalize;
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

.history-total {
  color: #cbd5e1;
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
