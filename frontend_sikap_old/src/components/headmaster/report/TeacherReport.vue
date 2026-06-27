<template>
  <div class="report-page fade-report">
    <!-- HEADER -->
    <div
      class="report-header d-flex justify-content-between align-items-start flex-wrap gap-3"
    >
      <div>
        <span class="page-label">
          LAPORAN & ANALISIS
        </span>

        <h3 class="report-title">
          Laporan Kinerja Guru
        </h3>

        <p class="report-subtitle mb-0">
          Rekap kehadiran KBM, partisipasi kegiatan sekolah, disiplin, dan
          performa guru secara menyeluruh
        </p>
      </div>

      <!-- ACTION -->
      <div class="action-group">
        <button class="btn-filter">
          <i class="bi bi-calendar-range"></i>
          Minggu Ini
        </button>

        <button class="btn-export excel">
          <i class="bi bi-file-earmark-excel-fill"></i>
          Excel
        </button>

        <button class="btn-export pdf">
          <i class="bi bi-file-earmark-pdf-fill"></i>
          PDF
        </button>
      </div>
    </div>

    <!-- FILTER -->
    <div class="filter-wrapper">
      <div class="filter-box">
        <i class="bi bi-search"></i>

        <input
          type="text"
          v-model="search"
          placeholder="Cari nama guru atau mata pelajaran..."
        />
      </div>

      <select class="custom-select">
        <option>Semua Jurusan</option>
        <option>TITL</option>
        <option>TE</option>
        <option>TOI</option>
      </select>

      <select class="custom-select">
        <option>Semua Status</option>
        <option>Sangat Baik</option>
        <option>Baik</option>
        <option>Evaluasi</option>
      </select>
    </div>

    <!-- SUMMARY -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-md-6 col-xl-3">
        <div class="summary-card">
          <div class="summary-top">
            <span>Total Guru</span>

            <div class="summary-icon blue">
              <i class="bi bi-people-fill"></i>
            </div>
          </div>

          <h2>70</h2>

          <div class="summary-progress">
            <div class="progress-line blue-line"></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <div class="summary-card">
          <div class="summary-top">
            <span>Rata-rata Nilai</span>

            <div class="summary-icon green">
              <i class="bi bi-bar-chart-fill"></i>
            </div>
          </div>

          <h2>89%</h2>

          <div class="summary-progress">
            <div class="progress-line green-line"></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <div class="summary-card">
          <div class="summary-top">
            <span>Kehadiran KBM</span>

            <div class="summary-icon orange">
              <i class="bi bi-calendar-check-fill"></i>
            </div>
          </div>

          <h2>96%</h2>

          <div class="summary-progress">
            <div class="progress-line orange-line"></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <div class="summary-card">
          <div class="summary-top">
            <span>Partisipasi Kegiatan</span>

            <div class="summary-icon purple">
              <i class="bi bi-award-fill"></i>
            </div>
          </div>

          <h2>84%</h2>

          <div class="summary-progress">
            <div class="progress-line purple-line"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- CHART + INSIGHT -->
    <div class="row g-4 mb-4">
      <!-- CHART -->
      <div class="col-12 col-xl-8">
        <div class="analytics-card">
          <div
            class="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h5 class="analytics-title mb-1">
                Statistik Performa Guru
              </h5>

              <small>
                Distribusi performa berdasarkan kategori penilaian
              </small>
            </div>

            <div class="analytics-badge">
              Update Hari Ini
            </div>
          </div>

          <!-- BARS -->
          <div class="chart-bars">
            <div class="bar-item">
              <div class="bar-label">
                Sangat Baik
              </div>

              <div class="bar-track">
                <div
                  class="bar-fill green-fill"
                  style="width: 82%;"
                ></div>
              </div>

              <span>82%</span>
            </div>

            <div class="bar-item">
              <div class="bar-label">
                Baik
              </div>

              <div class="bar-track">
                <div
                  class="bar-fill blue-fill"
                  style="width: 64%;"
                ></div>
              </div>

              <span>64%</span>
            </div>

            <div class="bar-item">
              <div class="bar-label">
                Disiplin
              </div>

              <div class="bar-track">
                <div
                  class="bar-fill orange-fill"
                  style="width: 91%;"
                ></div>
              </div>

              <span>91%</span>
            </div>

            <div class="bar-item">
              <div class="bar-label">
                Administrasi
              </div>

              <div class="bar-track">
                <div
                  class="bar-fill purple-fill"
                  style="width: 76%;"
                ></div>
              </div>

              <span>76%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- INSIGHT -->
      <div class="col-12 col-xl-4">
        <div class="insight-card">
          <div class="insight-header">
            <h5>
              Insight Mingguan
            </h5>

            <i class="bi bi-lightbulb-fill"></i>
          </div>

          <div class="insight-list">
            <div class="insight-item">
              <div class="insight-dot green-dot"></div>

              <p>
                Kehadiran KBM meningkat 8% dibanding minggu lalu
              </p>
            </div>

            <div class="insight-item">
              <div class="insight-dot orange-dot"></div>

              <p>
                Partisipasi rapat dinas masih perlu ditingkatkan
              </p>
            </div>

            <div class="insight-item">
              <div class="insight-dot blue-dot"></div>

              <p>
                15 guru aktif pada kegiatan Panca Waluya minggu ini
              </p>
            </div>

            <div class="insight-item">
              <div class="insight-dot red-dot"></div>

              <p>
                7 guru memerlukan evaluasi kedisiplinan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="report-table-card">
      <div
        class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"
      >
        <div>
          <h5 class="analytics-title mb-1">
            Rekap Detail Guru
          </h5>

          <small>
            Detail performa dan aktivitas guru
          </small>
        </div>

        <div class="table-info">
          {{ filteredTeachers.length }} Data Ditampilkan
        </div>
      </div>

      <div class="table-responsive">
        <table class="report-table">
          <thead>
            <tr>
              <th>Guru</th>
              <th>KBM</th>
              <th>Kegiatan</th>
              <th>Disiplin</th>
              <th>Administrasi</th>
              <th>Nilai</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(teacher, index) in filteredTeachers"
              :key="index"
            >
              <td>
                <div class="teacher-info">
                  <div class="teacher-avatar">
                    {{ teacher.name.charAt(0) }}
                  </div>

                  <div>
                    <h6>{{ teacher.name }}</h6>
                    <small>{{ teacher.subject }}</small>
                  </div>
                </div>
              </td>

              <td>{{ teacher.kbm }}%</td>

              <td>{{ teacher.activity }}%</td>

              <td>{{ teacher.discipline }}%</td>

              <td>{{ teacher.admin }}%</td>

              <td>
                <strong class="score-value">
                  {{ teacher.score }}
                </strong>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="getStatusClass(teacher.score)"
                >
                  {{ getStatusLabel(teacher.score) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "TeacherReportPage",

  data() {
    return {
      search: "",

      teachers: [
        {
          name: "Ruly Abdul Rasyid, S.Pd.",
          subject: "Instalasi Tenaga",
          kbm: 98,
          activity: 95,
          discipline: 96,
          admin: 94,
          score: 96,
        },

        {
          name: "Ahmad Fauzi, S.T.",
          subject: "PLC Industri",
          kbm: 92,
          activity: 88,
          discipline: 90,
          admin: 91,
          score: 90,
        },

        {
          name: "Dian Permana, S.T.",
          subject: "Elektronika Dasar",
          kbm: 95,
          activity: 90,
          discipline: 92,
          admin: 89,
          score: 92,
        },

        {
          name: "Yudi Karwati, M.T.",
          subject: "IoT",
          kbm: 88,
          activity: 84,
          discipline: 85,
          admin: 87,
          score: 86,
        },

        {
          name: "Budi Santoso, S.Pd.",
          subject: "Mikrokontroler",
          kbm: 72,
          activity: 70,
          discipline: 74,
          admin: 73,
          score: 72,
        },

        {
          name: "Rina Marlina, S.Pd.",
          subject: "Panel Listrik",
          kbm: 94,
          activity: 91,
          discipline: 93,
          admin: 95,
          score: 93,
        },
      ],
    };
  },

  computed: {
    filteredTeachers() {
      return this.teachers.filter(
        (teacher) =>
          teacher.name
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          teacher.subject
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
    },
  },

  methods: {
    getStatusLabel(score) {
      if (score >= 90) return "Sangat Baik";
      if (score >= 80) return "Baik";

      return "Evaluasi";
    },

    getStatusClass(score) {
      if (score >= 90) return "excellent";
      if (score >= 80) return "good";

      return "warning";
    },
  },
};
</script>

<style scoped>
.fade-report {
  animation: fadeReport 0.3s ease;
}

@keyframes fadeReport {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.report-page {
  color: white;
}

.page-label {
  display: inline-block;

  padding: 6px 12px;

  background: rgba(59,130,246,0.14);

  color: #60a5fa;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;

  margin-bottom: 14px;
}

.report-title {
  font-size: 30px;
  font-weight: 700;

  margin-bottom: 8px;
}

.report-subtitle {
  color: #94a3b8;

  font-size: 14px;
}

/* ACTION */
.action-group {
  display: flex;
  align-items: center;

  gap: 12px;

  flex-wrap: wrap;
}

.btn-filter,
.btn-export {
  height: 44px;

  border: none;

  border-radius: 14px;

  padding: 0 18px;

  color: white;

  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 13px;
  font-weight: 600;
}

.btn-filter {
  background: rgba(255,255,255,0.06);
}

.btn-export.excel {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.btn-export.pdf {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* FILTER */
.filter-wrapper {
  display: flex;
  gap: 14px;

  flex-wrap: wrap;

  margin: 30px 0;
}

.filter-box {
  flex: 1;
  min-width: 260px;

  height: 50px;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 16px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  gap: 10px;
}

.filter-box input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: white;
}

.custom-select {
  min-width: 180px;

  height: 50px;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  color: white;

  border-radius: 16px;

  padding: 0 14px;
}

/* SUMMARY */
.summary-card {
  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.06),
    rgba(255,255,255,0.02)
  );

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 24px;

  padding: 22px;
}

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-top span {
  color: #94a3b8;

  font-size: 13px;
}

.summary-card h2 {
  margin: 18px 0;

  font-size: 38px;
  font-weight: 700;
}

.summary-progress {
  height: 8px;

  background: rgba(255,255,255,0.05);

  border-radius: 999px;

  overflow: hidden;
}

.progress-line {
  height: 100%;

  border-radius: 999px;
}

.blue-line {
  width: 80%;
  background: #3b82f6;
}

.green-line {
  width: 89%;
  background: #22c55e;
}

.orange-line {
  width: 96%;
  background: #f97316;
}

.purple-line {
  width: 84%;
  background: #8b5cf6;
}

.summary-icon {
  width: 52px;
  height: 52px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.summary-icon.blue {
  background: rgba(59,130,246,0.16);
  color: #60a5fa;
}

.summary-icon.green {
  background: rgba(34,197,94,0.16);
  color: #4ade80;
}

.summary-icon.orange {
  background: rgba(249,115,22,0.16);
  color: #fb923c;
}

.summary-icon.purple {
  background: rgba(139,92,246,0.16);
  color: #a78bfa;
}

/* ANALYTICS */
.analytics-card,
.insight-card,
.report-table-card {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 28px;

  padding: 26px;
}

.analytics-title {
  font-size: 18px;
  font-weight: 700;
}

.analytics-card small,
.insight-card p,
.report-table-card small {
  color: #94a3b8;
}

.analytics-badge {
  padding: 6px 12px;

  border-radius: 999px;

  background: rgba(34,197,94,0.15);

  color: #4ade80;

  font-size: 11px;
  font-weight: 700;
}

/* BAR */
.chart-bars {
  display: flex;
  flex-direction: column;

  gap: 24px;
}

.bar-item {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  align-items: center;

  gap: 16px;
}

.bar-label {
  font-size: 13px;
  color: white;
}

.bar-track {
  height: 14px;

  background: rgba(255,255,255,0.06);

  border-radius: 999px;

  overflow: hidden;
}

.bar-fill {
  height: 100%;

  border-radius: 999px;
}

.green-fill {
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.blue-fill {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.orange-fill {
  background: linear-gradient(90deg, #f97316, #fb923c);
}

.purple-fill {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
}

/* INSIGHT */
.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
}

.insight-header i {
  font-size: 24px;

  color: #facc15;
}

.insight-list {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.insight-item {
  display: flex;
  align-items: flex-start;

  gap: 12px;
}

.insight-dot {
  width: 10px;
  height: 10px;

  border-radius: 50%;

  margin-top: 7px;
}

.green-dot {
  background: #22c55e;
}

.orange-dot {
  background: #f97316;
}

.blue-dot {
  background: #3b82f6;
}

.red-dot {
  background: #ef4444;
}

/* TABLE */
.table-info {
  padding: 6px 12px;

  border-radius: 999px;

  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  font-size: 12px;
  font-weight: 700;
}

.report-table {
  width: 100%;

  border-collapse: collapse;
}

.report-table th {
  color: #94a3b8;

  font-size: 12px;

  padding-bottom: 18px;

  text-align: left;
}

.report-table td {
  padding: 18px 0;

  border-top: 1px solid rgba(255,255,255,0.06);

  font-size: 13px;
}

.teacher-info {
  display: flex;
  align-items: center;

  gap: 12px;
}

.teacher-avatar {
  width: 44px;
  height: 44px;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    #3b82f6,
    #8b5cf6
  );

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
}

.teacher-info h6 {
  margin: 0;

  font-size: 14px;
}

.teacher-info small {
  color: #94a3b8;
}

.score-value {
  color: #4ade80;
}

.status-badge {
  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.status-badge.excellent {
  background: rgba(34,197,94,0.15);
  color: #4ade80;
}

.status-badge.good {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}

.status-badge.warning {
  background: rgba(239,68,68,0.15);
  color: #f87171;
}

/* MOBILE */
@media (max-width: 768px) {

  .report-title {
    font-size: 24px;
  }

  .filter-wrapper {
    flex-direction: column;
  }

  .custom-select {
    width: 100%;
  }

  .bar-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .report-table {
    min-width: 900px;
  }
}
</style>