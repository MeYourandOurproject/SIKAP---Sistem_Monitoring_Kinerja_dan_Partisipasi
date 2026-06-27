<template>
  <div class="performance-page fade-in-page mt-3">
    <!-- HEADER -->
    <div
      class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3 text-start"
    >
      <div>
        <h3 class="page-title">
          Penilaian Kinerja Guru
        </h3>

        <p class="page-subtitle mb-0">
          Analisis performa guru berdasarkan KBM, partisipasi kegiatan,
          disiplin, dan administrasi
        </p>
      </div>

      <!-- SEARCH -->
      <div class="search-wrapper">
        <i class="bi bi-search"></i>

        <input
          type="text"
          v-model="search"
          placeholder="Cari nama guru..."
        />
      </div>
    </div>

    <!-- TOP OVERVIEW -->
    <div class="overview-grid">

      <div class="overview-card">
        <div class="overview-icon blue">
          <i class="bi bi-people-fill"></i>
        </div>

        <div>
          <small>Total Guru</small>
          <h2>{{ teachers.length }}</h2>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon green">
          <i class="bi bi-bar-chart-line-fill"></i>
        </div>

        <div>
          <small>Rata-rata Nilai</small>
          <h2>89</h2>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon orange">
          <i class="bi bi-award-fill"></i>
        </div>

        <div>
          <small>Guru Sangat Baik</small>
          <h2>38</h2>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon red">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>

        <div>
          <small>Perlu Evaluasi</small>
          <h2>7</h2>
        </div>
      </div>

    </div>

    <!-- MAIN -->
    <div class="row g-4">

      <!-- LEFT -->
      <div class="col-12 col-xl-4">

        <!-- PERFORMANCE SUMMARY -->
        <div class="performance-summary">

          <div class="summary-top">
            <div>
              <small class="summary-label">
                Performa Sekolah
              </small>

              <h2>89%</h2>
            </div>

            <div class="summary-badge">
              +4.5%
            </div>
          </div>

          <!-- PROGRESS -->
          <div class="progress-group">

            <div class="progress-item">
              <div class="progress-label">
                <span>Kehadiran KBM</span>
                <strong>94%</strong>
              </div>

              <div class="progress-bar-custom">
                <div
                  class="progress-fill green-fill"
                  style="width: 94%"
                ></div>
              </div>
            </div>

            <div class="progress-item">
              <div class="progress-label">
                <span>Partisipasi Kegiatan</span>
                <strong>88%</strong>
              </div>

              <div class="progress-bar-custom">
                <div
                  class="progress-fill blue-fill"
                  style="width: 88%"
                ></div>
              </div>
            </div>

            <div class="progress-item">
              <div class="progress-label">
                <span>Administrasi</span>
                <strong>84%</strong>
              </div>

              <div class="progress-bar-custom">
                <div
                  class="progress-fill orange-fill"
                  style="width: 84%"
                ></div>
              </div>
            </div>

            <div class="progress-item">
              <div class="progress-label">
                <span>Disiplin</span>
                <strong>91%</strong>
              </div>

              <div class="progress-bar-custom">
                <div
                  class="progress-fill purple-fill"
                  style="width: 91%"
                ></div>
              </div>
            </div>

          </div>

        </div>

        <!-- TOP RANK -->
        <div class="ranking-card">

          <div class="section-header">
            <div>
              <h5>Top Ranking Guru</h5>

              <small>Performa terbaik minggu ini</small>
            </div>

            <span class="top-badge">
              TOP 5
            </span>
          </div>

          <div class="ranking-list">

            <div
              class="ranking-item"
              v-for="(teacher, index) in topTeachers"
              :key="index"
            >

              <div class="ranking-left">

                <div
                  class="ranking-number"
                  :class="{
                    gold: index === 0,
                    silver: index === 1,
                    bronze: index === 2,
                  }"
                >
                  {{ index + 1 }}
                </div>

                <div>
                  <h6>{{ teacher.name }}</h6>
                  <small>{{ teacher.subject }}</small>
                </div>

              </div>

              <div class="ranking-score">
                {{ teacher.score }}
              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- RIGHT -->
      <div class="col-12 col-xl-8">

        <div class="teacher-table-card">

          <div
            class="section-header d-flex justify-content-between align-items-center flex-wrap gap-2"
          >

            <div>
              <h5>Data Penilaian Guru</h5>

              <small>
                Rekap penilaian seluruh guru
              </small>
            </div>

            <div class="table-info">
              {{ filteredTeachers.length }} Guru
            </div>

          </div>

          <!-- TABLE -->
          <div class="table-responsive">

            <table class="teacher-table">

              <thead>
                <tr>
                  <th>Guru</th>
                  <th>KBM</th>
                  <th>Kegiatan</th>
                  <th>Disiplin</th>
                  <th>Admin</th>
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

                  <td>
                    <span class="score-mini">
                      {{ teacher.kbm }}%
                    </span>
                  </td>

                  <td>
                    <span class="score-mini">
                      {{ teacher.activity }}%
                    </span>
                  </td>

                  <td>
                    <span class="score-mini">
                      {{ teacher.discipline }}%
                    </span>
                  </td>

                  <td>
                    <span class="score-mini">
                      {{ teacher.admin }}%
                    </span>
                  </td>

                  <td>
                    <strong class="final-score">
                      {{ teacher.score }}
                    </strong>
                  </td>

                  <td>
                    <span
                      class="status-chip"
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

    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherPerformancePage",

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

        {
          name: "Andri Setiawan, S.Kom.",
          subject: "Jaringan Industri",
          kbm: 82,
          activity: 80,
          discipline: 81,
          admin: 83,
          score: 82,
        },

        {
          name: "Agus Nugraha, S.T.",
          subject: "Sistem Kontrol",
          kbm: 97,
          activity: 95,
          discipline: 96,
          admin: 98,
          score: 97,
        },
      ],
    };
  },

  computed: {
    filteredTeachers() {
      return this.teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    topTeachers() {
      return [...this.teachers]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
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
.fade-in-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.performance-page {
  color: white;
}

/* HEADER */
.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;

  color: white;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 13px;
}

/* SEARCH */
.search-wrapper {
  width: 320px;
  height: 48px;

  background: #111827;

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 16px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  gap: 10px;
}

.search-wrapper i {
  color: #64748b;
}

.search-wrapper input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: white;
}

.search-wrapper input::placeholder {
  color: #64748b;
}

/* OVERVIEW */
.overview-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  gap: 16px;

  margin-bottom: 24px;
}

.overview-card {
  background: #111827;

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 24px;

  padding: 20px;

  display: flex;
  align-items: center;

  gap: 16px;
}

.overview-card small {
  color: #94a3b8;
}

.overview-card h2 {
  margin: 4px 0 0;

  color: white;

  font-size: 32px;
  font-weight: 700;
}

.overview-icon {
  width: 58px;
  height: 58px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;

  color: white;
}

.blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.green {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.orange {
  background: linear-gradient(135deg, #ea580c, #c2410c);
}

.red {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* SUMMARY */
.performance-summary,
.ranking-card,
.teacher-table-card {
  background: #111827;

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 28px;

  padding: 24px;
}

.performance-summary {
  margin-bottom: 20px;
}

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 28px;
}

.summary-label {
  color: #94a3b8;
}

.summary-top h2 {
  font-size: 52px;
  font-weight: 700;

  margin: 4px 0 0;
}

.summary-badge {
  background: rgba(34,197,94,0.15);

  color: #4ade80;

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;
}

/* PROGRESS */
.progress-group {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.progress-label {
  display: flex;
  justify-content: space-between;

  margin-bottom: 8px;

  color: white;

  font-size: 13px;
}

.progress-label strong {
  font-size: 13px;
}

.progress-bar-custom {
  height: 12px;

  background: rgba(255,255,255,0.06);

  border-radius: 999px;

  overflow: hidden;
}

.progress-fill {
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

/* SECTION */
.section-header h5 {
  color: white;

  font-size: 17px;
  font-weight: 700;

  margin-bottom: 4px;
}

.section-header small {
  color: #94a3b8;
}

/* RANKING */
.top-badge {
  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

.ranking-list {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px;

  border-radius: 18px;

  background: rgba(255,255,255,0.03);
}

.ranking-left {
  display: flex;
  align-items: center;

  gap: 12px;
}

.ranking-number {
  width: 42px;
  height: 42px;

  border-radius: 14px;

  background: rgba(255,255,255,0.08);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
}

.gold {
  background: rgba(250,204,21,0.18);
  color: #fde047;
}

.silver {
  background: rgba(148,163,184,0.18);
  color: #cbd5e1;
}

.bronze {
  background: rgba(251,146,60,0.18);
  color: #fdba74;
}

.ranking-left h6 {
  margin: 0;

  color: white;
}

.ranking-left small {
  color: #94a3b8;
}

.ranking-score {
  color: #4ade80;

  font-size: 20px;
  font-weight: 700;
}

/* TABLE */
.table-info {
  background: rgba(34,197,94,0.15);

  color: #4ade80;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

.teacher-table {
  width: 100%;

  border-collapse: collapse;
}

.teacher-table th {
  color: #94a3b8;

  font-size: 12px;
  font-weight: 600;

  padding-bottom: 18px;

  text-align: left;
}

.teacher-table td {
  padding: 18px 0;

  border-top: 1px solid rgba(255,255,255,0.05);

  color: white;

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
    #6366f1
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

.score-mini {
  color: #cbd5e1;
}

.final-score {
  color: #4ade80;

  font-size: 16px;
}

.status-chip {
  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.status-chip.excellent {
  background: rgba(34,197,94,0.15);
  color: #4ade80;
}

.status-chip.good {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}

.status-chip.warning {
  background: rgba(239,68,68,0.15);
  color: #f87171;
}

/* MOBILE */
@media (max-width: 768px) {

  .search-wrapper {
    width: 100%;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .summary-top h2 {
    font-size: 42px;
  }
}
</style>