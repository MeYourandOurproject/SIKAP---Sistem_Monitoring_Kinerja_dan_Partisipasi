<template>
  <div class="attendance-page">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h3 class="page-title">
          Absensi KBM & Kegiatan
        </h3>

        <p class="page-subtitle">
          Monitoring kehadiran guru dan aktivitas pembelajaran secara real-time
        </p>
      </div>

      <button class="scan-btn">
        <i class="bi bi-qr-code-scan"></i>
        Scan QR
      </button>
    </div>

    <!-- STATS -->
    <div class="row g-3 mb-4">

      <div class="col-6 col-xl-3">
        <div class="stats-card blue">
          <div>
            <small>Total Absensi</small>
            <h3>128</h3>
          </div>

          <i class="bi bi-journal-check"></i>
        </div>
      </div>

      <div class="col-6 col-xl-3">
        <div class="stats-card green">
          <div>
            <small>Hadir</small>
            <h3>112</h3>
          </div>

          <i class="bi bi-check-circle-fill"></i>
        </div>
      </div>

      <div class="col-6 col-xl-3">
        <div class="stats-card orange">
          <div>
            <small>Terlambat</small>
            <h3>9</h3>
          </div>

          <i class="bi bi-clock-history"></i>
        </div>
      </div>

      <div class="col-6 col-xl-3">
        <div class="stats-card red">
          <div>
            <small>Tidak Hadir</small>
            <h3>7</h3>
          </div>

          <i class="bi bi-x-circle-fill"></i>
        </div>
      </div>

    </div>

    <div class="row g-4">

      <!-- FORM -->
      <div class="col-12 col-xl-5">

        <div class="glass-card form-card">

          <div class="section-header">
            <div>
              <h5>Input Absensi</h5>
              <small>Isi data kehadiran guru</small>
            </div>

            <div class="live-badge">
              LIVE
            </div>
          </div>

          <div
            v-if="message.text"
            :class="[
              'custom-alert',
              message.type === 'success'
                ? 'success'
                : 'danger',
            ]"
          >
            {{ message.text }}
          </div>

          <form @submit.prevent="submitAttendance">

            <div class="input-group-custom">
              <label>Schedule ID</label>

              <div class="input-wrapper">
                <i class="bi bi-calendar-week"></i>

                <input
                  v-model="form.scheduleId"
                  type="number"
                  placeholder="Masukkan schedule id"
                />
              </div>
            </div>

            <div class="row g-3">

              <div class="col-6">

                <div class="input-group-custom">
                  <label>Guru ID</label>

                  <div class="input-wrapper">
                    <i class="bi bi-person-badge"></i>

                    <input
                      v-model="form.teacherId"
                      type="number"
                      placeholder="Guru"
                    />
                  </div>
                </div>

              </div>

              <div class="col-6">

                <div class="input-group-custom">
                  <label>Kelas ID</label>

                  <div class="input-wrapper">
                    <i class="bi bi-building"></i>

                    <input
                      v-model="form.classroomId"
                      type="number"
                      placeholder="Kelas"
                    />
                  </div>
                </div>

              </div>

            </div>

            <div class="input-group-custom">
              <label>Status Kehadiran</label>

              <div class="status-grid">

                <button
                  type="button"
                  class="status-option hadir"
                  :class="{ active: form.attendanceStatus === 'hadir' }"
                  @click="form.attendanceStatus = 'hadir'"
                >
                  <i class="bi bi-check-circle-fill"></i>
                  Hadir
                </button>

                <button
                  type="button"
                  class="status-option izin"
                  :class="{ active: form.attendanceStatus === 'izin' }"
                  @click="form.attendanceStatus = 'izin'"
                >
                  <i class="bi bi-envelope-fill"></i>
                  Izin
                </button>

                <button
                  type="button"
                  class="status-option sakit"
                  :class="{ active: form.attendanceStatus === 'sakit' }"
                  @click="form.attendanceStatus = 'sakit'"
                >
                  <i class="bi bi-heart-pulse-fill"></i>
                  Sakit
                </button>

                <button
                  type="button"
                  class="status-option alpha"
                  :class="{ active: form.attendanceStatus === 'absen' }"
                  @click="form.attendanceStatus = 'absen'"
                >
                  <i class="bi bi-x-circle-fill"></i>
                  Alpha
                </button>

              </div>
            </div>

            <div class="row g-3">

              <div class="col-6">

                <div class="input-group-custom">
                  <label>Status Waktu</label>

                  <select v-model="form.timeStatus">
                    <option value="">
                      Pilih Status
                    </option>

                    <option value="tepat_waktu">
                      Tepat Waktu
                    </option>

                    <option value="terlambat">
                      Terlambat
                    </option>
                  </select>
                </div>

              </div>

              <div class="col-6">

                <div class="input-group-custom">
                  <label>Pembelajaran</label>

                  <select v-model="form.learningStatus">
                    <option value="">
                      Pilih Status
                    </option>

                    <option value="aktif">
                      Aktif
                    </option>

                    <option value="kurang_aktif">
                      Kurang Aktif
                    </option>

                    <option value="tidak_aktif">
                      Tidak Aktif
                    </option>
                  </select>
                </div>

              </div>

            </div>

            <div class="input-group-custom">
              <label>Catatan</label>

              <textarea
                v-model="form.note"
                rows="4"
                placeholder="Tambahkan catatan absensi..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isSubmitting"
            >
              <i class="bi bi-save-fill"></i>

              {{
                isSubmitting
                  ? "Menyimpan..."
                  : "Simpan Absensi"
              }}
            </button>

          </form>

        </div>

      </div>

      <!-- TABLE -->
      <div class="col-12 col-xl-7">

        <div class="glass-card history-card">

          <div class="section-header mb-4">

            <div>
              <h5>Riwayat Absensi</h5>
              <small>Data absensi terbaru guru</small>
            </div>

            <div class="history-total">
              {{ records.length }} Data
            </div>

          </div>

          <div
            v-if="records.length"
            class="attendance-list"
          >

            <div
              class="attendance-item"
              v-for="record in records"
              :key="record.id"
            >

              <div class="attendance-left">

                <div
                  class="attendance-avatar"
                  :class="record.attendanceStatus"
                >
                  <i
                    class="bi"
                    :class="getAttendanceIcon(record.attendanceStatus)"
                  ></i>
                </div>

                <div>
                  <h6>
                    Guru ID {{ record.teacherId }}
                  </h6>

                  <small>
                    Schedule {{ record.scheduleId }}
                    •
                    Kelas {{ record.classroomId }}
                  </small>
                </div>

              </div>

              <div class="attendance-right">

                <span
                  class="status-badge"
                  :class="record.attendanceStatus"
                >
                  {{ record.attendanceStatus }}
                </span>

                <small>
                  {{
                    record.timeStatus === "terlambat"
                      ? "Terlambat"
                      : "Tepat Waktu"
                  }}
                </small>

              </div>

            </div>

          </div>

          <div
            v-else
            class="empty-state"
          >
            <i class="bi bi-journal-x"></i>

            <h5>
              Belum Ada Absensi
            </h5>

            <p>
              Data absensi guru akan muncul di sini
            </p>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
// import { attendanceAPI } from "@/utils/api";

export default {
  name: "PersonResponsibleAttendance",

  data() {
    return {
      form: {
        scheduleId: "",
        teacherId: "",
        classroomId: "",
        attendanceStatus: "",
        timeStatus: "",
        learningStatus: "",
        note: "",
      },

      records: [],

      message: {
        text: "",
        type: "success",
      },

      isSubmitting: false,
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

    async submitAttendance() {
      if (
        !this.form.scheduleId ||
        !this.form.teacherId ||
        !this.form.classroomId ||
        !this.form.attendanceStatus ||
        !this.form.timeStatus ||
        !this.form.learningStatus
      ) {
        this.message = {
          text: "Semua field wajib diisi.",
          type: "danger",
        };

        return;
      }

      this.isSubmitting = true;

      const response =
        await attendanceAPI.create({
          scheduleId: Number(
            this.form.scheduleId
          ),

          teacherId: Number(
            this.form.teacherId
          ),

          classroomId: Number(
            this.form.classroomId
          ),

          attendanceStatus:
            this.form.attendanceStatus,

          timeStatus:
            this.form.timeStatus,

          learningStatus:
            this.form.learningStatus,

          note: this.form.note,
        });

      if (response.success) {
        this.message = {
          text: "Absensi berhasil dicatat.",
          type: "success",
        };

        this.form = {
          scheduleId: "",
          teacherId: "",
          classroomId: "",
          attendanceStatus: "",
          timeStatus: "",
          learningStatus: "",
          note: "",
        };

        this.fetchRecords();
      } else {
        this.message = {
          text:
            response.error ||
            "Gagal mencatat absensi.",

          type: "danger",
        };
      }

      this.isSubmitting = false;
    },

    getAttendanceIcon(status) {
      switch (status) {
        case "hadir":
          return "bi-check-circle-fill";

        case "izin":
          return "bi-envelope-fill";

        case "sakit":
          return "bi-heart-pulse-fill";

        default:
          return "bi-x-circle-fill";
      }
    },
  },
};
</script>

<style scoped>
.attendance-page {
  color: white;
  padding-bottom: 100px;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.page-subtitle {
  color: #94a3b8;
  margin: 0;
  font-size: 14px;
}

.scan-btn {
  border: none;
  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );
  color: white;
  padding: 12px 18px;
  border-radius: 16px;
  font-weight: 600;
}

/* STATS */
.stats-card {
  border-radius: 24px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.stats-card h3 {
  font-size: 32px;
  margin: 6px 0 0;
}

.stats-card i {
  font-size: 34px;
}

.blue {
  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );
}

.green {
  background: linear-gradient(
    135deg,
    #16a34a,
    #15803d
  );
}

.orange {
  background: linear-gradient(
    135deg,
    #ea580c,
    #c2410c
  );
}

.red {
  background: linear-gradient(
    135deg,
    #dc2626,
    #b91c1c
  );
}

/* CARD */
.glass-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 28px;
  padding: 24px;
  backdrop-filter: blur(16px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h5 {
  margin: 0;
  font-weight: 700;
}

.section-header small {
  color: #94a3b8;
}

.live-badge {
  background: rgba(34,197,94,0.16);
  color: #4ade80;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

/* ALERT */
.custom-alert {
  padding: 14px;
  border-radius: 16px;
  margin: 20px 0;
  font-size: 14px;
}

.custom-alert.success {
  background: rgba(34,197,94,0.12);
  color: #4ade80;
}

.custom-alert.danger {
  background: rgba(239,68,68,0.12);
  color: #f87171;
}

/* INPUT */
.input-group-custom {
  margin-bottom: 18px;
}

.input-group-custom label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #cbd5e1;
}

.input-wrapper {
  height: 52px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
}

.input-wrapper i {
  color: #60a5fa;
}

.input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
}

select,
textarea {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 14px;
  color: white;
  outline: none;
}

select option {
  background: #0f172a;
}

textarea::placeholder,
input::placeholder {
  color: #64748b;
}

/* STATUS */
.status-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 12px;
}

.status-option {
  border: none;
  border-radius: 16px;
  padding: 14px;
  color: white;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  transition: 0.3s;
}

.status-option.active {
  transform: scale(0.98);
}

.status-option.hadir.active {
  background: rgba(34,197,94,0.2);
  border: 1px solid #22c55e;
}

.status-option.izin.active {
  background: rgba(59,130,246,0.2);
  border: 1px solid #3b82f6;
}

.status-option.sakit.active {
  background: rgba(168,85,247,0.2);
  border: 1px solid #a855f7;
}

.status-option.alpha.active {
  background: rgba(239,68,68,0.2);
  border: 1px solid #ef4444;
}

/* BUTTON */
.submit-btn {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 15px;
  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );
  color: white;
  font-weight: 700;
  margin-top: 10px;
}

/* HISTORY */
.history-total {
  background: rgba(59,130,246,0.16);
  color: #60a5fa;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.attendance-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attendance-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.attendance-avatar {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.attendance-avatar.hadir {
  background: rgba(34,197,94,0.16);
  color: #4ade80;
}

.attendance-avatar.izin {
  background: rgba(59,130,246,0.16);
  color: #60a5fa;
}

.attendance-avatar.sakit {
  background: rgba(168,85,247,0.16);
  color: #c084fc;
}

.attendance-avatar.absen {
  background: rgba(239,68,68,0.16);
  color: #f87171;
}

.attendance-left h6 {
  margin: 0;
  font-weight: 600;
}

.attendance-left small {
  color: #94a3b8;
}

.attendance-right {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
  margin-bottom: 6px;
}

.status-badge.hadir {
  background: rgba(34,197,94,0.16);
  color: #4ade80;
}

.status-badge.izin {
  background: rgba(59,130,246,0.16);
  color: #60a5fa;
}

.status-badge.sakit {
  background: rgba(168,85,247,0.16);
  color: #c084fc;
}

.status-badge.absen {
  background: rgba(239,68,68,0.16);
  color: #f87171;
}

.empty-state {
  text-align: center;
  padding: 70px 20px;
}

.empty-state i {
  font-size: 60px;
  color: #475569;
  margin-bottom: 18px;
}

.empty-state p {
  color: #94a3b8;
}

/* MOBILE */
@media (max-width: 768px) {

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .scan-btn {
    width: 100%;
  }

  .attendance-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .attendance-right {
    text-align: left;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>