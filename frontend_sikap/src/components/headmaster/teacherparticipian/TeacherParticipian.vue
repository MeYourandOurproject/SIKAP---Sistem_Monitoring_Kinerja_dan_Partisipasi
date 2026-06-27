<template>
  <div class="teacher-participation-page fade-in-page mt-3 efek">
    <!-- HEADER -->
    <div
      class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 text-start"
    >
      <div>
        <h4 class="page-title mb-1">Partisipasi Guru</h4>

        <p class="page-subtitle mb-0">
          Monitoring kehadiran guru pada kegiatan sekolah minggu ini
        </p>
      </div>

      <button class="btn-export">
        <i class="bi bi-download me-2"></i>
        Export
      </button>
    </div>

    <!-- TOP STATS -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="top-card blue-card">
          <div>
            <small>Total Guru</small>
            <h2>70</h2>
          </div>

          <div class="top-icon">
            <i class="bi bi-people-fill"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="top-card green-card">
          <div>
            <small>Partisipasi</small>
            <h2>91%</h2>
          </div>

          <div class="top-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="top-card orange-card">
          <div>
            <small>Kegiatan</small>
            <h2>5</h2>
          </div>

          <div class="top-icon">
            <i class="bi bi-calendar-event-fill"></i>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="top-card red-card">
          <div>
            <small>Tidak Hadir</small>
            <h2>6</h2>
          </div>

          <div class="top-icon">
            <i class="bi bi-x-circle-fill"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="row g-4">
      <!-- LEFT -->
      <div class="col-12 col-xl-4">
        <!-- RADIAL -->
        <div class="glass-card mb-4">
          <div class="section-head mb-4">
            <div>
              <h6 class="section-title">Tingkat Kehadiran</h6>

              <small> Akumulasi seluruh kegiatan </small>
            </div>
          </div>

          <div class="radial-wrap">
            <div class="radial-chart">
              <div class="radial-inner">
                <h2>91%</h2>
                <span>Aktif</span>
              </div>
            </div>
          </div>

          <div class="legend-list">
            <div class="legend-item">
              <span class="legend-dot success"></span>
              Hadir
              <strong>64</strong>
            </div>

            <div class="legend-item">
              <span class="legend-dot warning"></span>
              Izin
              <strong>4</strong>
            </div>

            <div class="legend-item">
              <span class="legend-dot danger"></span>
              Alfa
              <strong>2</strong>
            </div>
          </div>
        </div>

        <!-- MINI ACTIVITY -->
        <div class="glass-card">
          <div class="section-head mb-4">
            <div>
              <h6 class="section-title">Aktivitas Minggu Ini</h6>

              <small> Ringkasan kegiatan </small>
            </div>
          </div>

          <div class="activity-list">
            <div
              class="activity-item"
              v-for="(item, index) in activities"
              :key="index"
            >
              <div class="activity-left">
                <div class="activity-icon">
                  <i :class="item.icon"></i>
                </div>

                <div>
                  <h6>{{ item.name }}</h6>
                  <small>{{ item.schedule }}</small>
                </div>
              </div>

              <span class="activity-badge"> {{ item.present }}/70 </span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-xl-8">
        <div class="glass-card">
          <div
            class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2"
          >
            <div>
              <h6 class="section-title mb-1">Statistik Kegiatan Guru</h6>

              <small class="section-subtitle">
                Persentase partisipasi setiap kegiatan
              </small>
            </div>

            <span class="week-badge"> Minggu Ke-2 </span>
          </div>

          <!-- CHART -->
          <div class="bar-chart">
            <div
              class="bar-item"
              v-for="(item, index) in activities"
              :key="index"
            >
              <div class="bar-top text-start">
                <div>
                  <h6>{{ item.name }}</h6>
                  <small>{{ item.present }} guru hadir</small>
                </div>

                <strong>{{ item.percent }}%</strong>
              </div>

              <div class="progress-area">
                <div
                  class="progress-fill"
                  :style="{ width: item.percent + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- DETAIL TABLE -->
        <div class="glass-card mt-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 class="section-title mb-1">Detail Kehadiran Kegiatan</h6>

              <small class="section-subtitle">
                Rekap partisipasi guru per kegiatan
              </small>
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Jadwal</th>
                  <th>Hadir</th>
                  <th>Izin</th>
                  <th>Alfa</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in activities" :key="index">
                  <td>
                    <div class="table-name">
                      <div class="table-icon">
                        <i :class="item.icon"></i>
                      </div>

                      {{ item.name }}
                    </div>
                  </td>

                  <td>{{ item.schedule }}</td>

                  <td>{{ item.present }}</td>

                  <td>{{ item.permission }}</td>

                  <td>{{ item.absent }}</td>

                  <td>
                    <span
                      class="status-pill"
                      :class="{
                        excellent: item.percent >= 90,
                        good: item.percent >= 80 && item.percent < 90,
                        warning: item.percent < 80,
                      }"
                    >
                      {{
                        item.percent >= 90
                          ? "Sangat Baik"
                          : item.percent >= 80
                            ? "Baik"
                            : "Perlu Evaluasi"
                      }}
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
  name: "TeacherParticipationChart",

  data() {
    return {
      activities: [
        {
          name: "Panca Waluya",
          schedule: "Senin - Jumat",
          present: 67,
          permission: 2,
          absent: 1,
          percent: 96,
          icon: "bi bi-stars",
        },

        {
          name: "Rapat Dinas",
          schedule: "Selasa, 13.00",
          present: 61,
          permission: 5,
          absent: 4,
          percent: 87,
          icon: "bi bi-briefcase-fill",
        },

        {
          name: "Briefing Pagi",
          schedule: "Setiap Hari",
          present: 64,
          permission: 4,
          absent: 2,
          percent: 91,
          icon: "bi bi-megaphone-fill",
        },

        {
          name: "Workshop Kurikulum",
          schedule: "Kamis, 09.00",
          present: 58,
          permission: 8,
          absent: 4,
          percent: 83,
          icon: "bi bi-easel-fill",
        },

        {
          name: "Supervisi Akademik",
          schedule: "Jumat, 10.00",
          present: 63,
          permission: 4,
          absent: 3,
          percent: 90,
          icon: "bi bi-clipboard2-check-fill",
        },
      ],
    };
  },
};
</script>

<style scoped>
.fade-in-page {
  animation: fadeIn 0.35s ease;
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

.page-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 13px;
}

.btn-export {
  border: none;

  background: linear-gradient(135deg, #3b82f6, #6366f1);

  color: white;

  padding: 10px 18px;

  border-radius: 14px;

  font-size: 13px;
  font-weight: 600;
}

/* TOP CARD */
.top-card {
  position: relative;

  overflow: hidden;

  padding: 22px;

  border-radius: 24px;

  color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-card small {
  opacity: 0.8;
  font-size: 13px;
}

.top-card h2 {
  margin: 6px 0 0;

  font-size: 34px;
  font-weight: 700;
}

.top-icon {
  width: 58px;
  height: 58px;

  border-radius: 18px;

  background: rgba(255, 255, 255, 0.14);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.blue-card {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.green-card {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.orange-card {
  background: linear-gradient(135deg, #ea580c, #c2410c);
}

.red-card {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* GLASS */
.glass-card {
  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.05);

  border-radius: 24px;

  padding: 24px;

  backdrop-filter: blur(14px);
}

.section-title {
  color: white;

  font-size: 16px;
  font-weight: 700;
}

.section-head small,
.section-subtitle {
  color: #94a3b8;
}

/* RADIAL */
.radial-wrap {
  display: flex;
  justify-content: center;

  margin-bottom: 28px;
}

.radial-chart {
  width: 220px;
  height: 220px;

  border-radius: 50%;

  background: conic-gradient(
    #22c55e 0% 91%,
    rgba(255, 255, 255, 0.08) 91% 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;
}

.radial-inner {
  width: 165px;
  height: 165px;

  border-radius: 50%;

  background: #071426;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.radial-inner h2 {
  color: white;

  font-size: 46px;
  font-weight: 700;

  margin: 0;
}

.radial-inner span {
  color: #94a3b8;
}

/* LEGEND */
.legend-list {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.legend-item {
  display: flex;
  align-items: center;

  gap: 10px;

  color: white;
}

.legend-item strong {
  margin-left: auto;
}

.legend-dot {
  width: 12px;
  height: 12px;

  border-radius: 50%;
}

.success {
  background: #22c55e;
}

.warning {
  background: #facc15;
}

.danger {
  background: #ef4444;
}

/* ACTIVITY */
.activity-list {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: rgba(255, 255, 255, 0.03);

  border-radius: 18px;

  padding: 14px;
}

.activity-left {
  display: flex;
  align-items: center;

  gap: 12px;
}

.activity-icon {
  width: 46px;
  height: 46px;

  border-radius: 14px;

  background: rgba(59, 130, 246, 0.15);

  color: #60a5fa;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
}

.activity-left h6 {
  margin: 0;

  color: white;
  font-size: 14px;
}

.activity-left small {
  color: #94a3b8;
}

.activity-badge {
  background: rgba(34, 197, 94, 0.14);

  color: #4ade80;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

/* BAR */
.week-badge {
  background: rgba(99, 102, 241, 0.15);

  color: #818cf8;

  padding: 7px 14px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

.bar-chart {
  display: flex;
  flex-direction: column;

  gap: 24px;
}

.bar-item {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.bar-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bar-top h6 {
  color: white;

  margin: 0;

  font-size: 14px;
}

.bar-top small {
  color: #94a3b8;
}

.bar-top strong {
  color: white;
}

.progress-area {
  height: 16px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

/* TABLE */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding-bottom: 16px;
  text-align: left;
}

.custom-table td {
  color: white;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
}

.table-name {
  display: flex;
  align-items: center;

  gap: 10px;
}

.table-icon {
  width: 38px;
  height: 38px;

  border-radius: 12px;

  background: rgba(255, 255, 255, 0.06);

  display: flex;
  align-items: center;
  justify-content: center;
}

.status-pill {
  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.status-pill.excellent {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.status-pill.good {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.status-pill.warning {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* MOBILE */
@media (max-width: 768px) {
  .radial-chart {
    width: 180px;
    height: 180px;
  }

  .radial-inner {
    width: 130px;
    height: 130px;
  }

  .radial-inner h2 {
    font-size: 36px;
  }

  .top-card h2 {
    font-size: 28px;
  }
}

.efek {
  animation: fadeIn 0.25s ease-in;
}

/* TAMBAHKAN INI */
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
</style>
