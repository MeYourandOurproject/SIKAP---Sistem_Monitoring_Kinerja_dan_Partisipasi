<template>
  <div class="efek">
    <!-- HEADER -->
    <div
      class="d-flex justify-content-between align-items-center my-4 text-start"
    >
      <div>
        <h5 class="chart-title mb-1">Monitoring Keterisian Kelas</h5>

        <p class="chart-subtitle mb-0">
          Monitoring kelas aktif dan kelas bermasalah hari ini
        </p>
      </div>

      <select class="form-select form-select-sm chart-filter">
        <option>Hari Ini</option>
        <option>Kemarin</option>
      </select>
    </div>

    <!-- CONTENT -->
    <div class="row g-4">
      <!-- LEFT -->
      <div class="col-12 col-xl-3">
        <!-- OCCUPANCY -->
        <div class="occupancy-card mb-4">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="card-title">Kelas Terisi</h6>

              <small class="card-subtitle"> Total kelas aktif hari ini </small>
            </div>

            <div class="percent-badge">{{ occupancyPercent }}%</div>
          </div>

          <!-- CIRCLE -->
          <div class="circle-wrapper">
            <div
              class="circle-chart"
              :style="{
                background: `conic-gradient(
                  #22c55e 0% ${occupancyPercent}%,
                  rgba(255,255,255,0.08) ${occupancyPercent}% 100%
                )`,
              }"
            >
              <div class="circle-inner">
                <h2>{{ occupiedClasses }}</h2>
                <span>/ {{ totalClasses }}</span>
              </div>
            </div>
          </div>

          <!-- STATS -->
          <div class="mini-stats">
            <div class="mini-item">
              <span class="dot success"></span>

              <div>
                <strong>{{ occupiedClasses }}</strong>
                <small>Terisi</small>
              </div>
            </div>

            <div class="mini-item">
              <span class="dot danger"></span>

              <div>
                <strong>{{ problematicClasses.length }}</strong>
                <small>Bermasalah</small>
              </div>
            </div>
          </div>
        </div>

        <!-- STATUS -->
        <div class="status-card">
          <div class="status-item">
            <div class="status-left">
              <span class="dot warning"></span>
              <span>Terlambat</span>
            </div>

            <strong>{{ countStatus("Terlambat") }}</strong>
          </div>

          <div class="status-item">
            <div class="status-left">
              <span class="dot blue"></span>
              <span>Tugas</span>
            </div>

            <strong>{{ countStatus("Tugas") }}</strong>
          </div>

          <div class="status-item">
            <div class="status-left">
              <span class="dot orange"></span>
              <span>Izin</span>
            </div>

            <strong>{{ countStatus("Izin") }}</strong>
          </div>

          <div class="status-item">
            <div class="status-left">
              <span class="dot danger"></span>
              <span>Kosong</span>
            </div>

            <strong>{{ countStatus("Kosong") }}</strong>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-xl-9">
        <div class="problem-wrapper">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 class="problem-title mb-1">Kelas Bermasalah</h6>

              <small class="problem-subtitle">
                Kelas yang tidak berjalan normal
              </small>
            </div>

            <span class="problem-count">
              {{ problematicClasses.length }} Temuan
            </span>
          </div>

          <!-- GRID -->
          <div class="row g-3">
            <div
              class="col-12 col-sm-6 col-lg-4 col-xxl-3"
              v-for="(item, index) in problematicClasses"
              :key="index"
            >
              <div class="problem-card compact-card">
                <!-- TOP -->
                <div class="problem-header">
                  <div class="problem-icon" :class="item.statusClass">
                    <i :class="item.icon"></i>
                  </div>

                  <span class="status-badge" :class="item.badgeClass">
                    {{ item.status }}
                  </span>
                </div>

                <!-- CLASS -->
                <h6 class="class-name">
                  {{ item.class }}
                </h6>

                <!-- TEACHER -->
                <p class="teacher-name">
                  {{ item.teacher }}
                </p>

                <!-- SUBJECT -->
                <div class="compact-info">
                  <i class="bi bi-book"></i>
                  {{ item.subject }}
                </div>

                <!-- TIME -->
                <div class="compact-info">
                  <i class="bi bi-clock"></i>
                  {{ item.start }} - {{ item.end }}
                </div>

                <!-- ROOM -->
                <div class="compact-info">
                  <i class="bi bi-geo-alt"></i>
                  {{ item.room }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassOccupancyChart",

  data() {
    const statuses = [
      {
        status: "Terlambat",
        badgeClass: "badge-warning",
        statusClass: "icon-warning",
        icon: "bi bi-clock-fill",
      },
      {
        status: "Tugas",
        badgeClass: "badge-blue",
        statusClass: "icon-blue",
        icon: "bi bi-journal-text",
      },
      {
        status: "Izin",
        badgeClass: "badge-orange",
        statusClass: "icon-orange",
        icon: "bi bi-heart-pulse-fill",
      },
      {
        status: "Kosong",
        badgeClass: "badge-danger",
        statusClass: "icon-danger",
        icon: "bi bi-x-circle-fill",
      },
    ];

    const teachers = [
      "Ruly Abdul Rasyid, S.Pd.",
      "Ahmad Fauzi, S.T.",
      "Dian Permana, S.T.",
      "Yudi Karwati, M.T.",
      "Budi Santoso, S.Pd.",
      "Andri Setiawan, S.Kom.",
      "Rina Marlina, S.Pd.",
      "Agus Nugraha, S.T.",
    ];

    const subjects = [
      "Instalasi Motor",
      "PLC Industri",
      "Dasar Elektronika",
      "Mikrokontroler",
      "Instalasi Tenaga",
      "Panel Listrik",
      "IoT",
      "Sistem Kontrol",
    ];

    const rooms = [
      "Lab Motor 1",
      "Lab PLC",
      "Lab Elektronika",
      "Ruang 204",
      "Ruang 305",
      "Workshop TITL",
    ];

    const classes = [];

    const gradeLevels = ["X", "XI", "XII"];
    const majors = ["TITL", "TE", "TOI"];

    let counter = 1;

    for (let grade of gradeLevels) {
      for (let major of majors) {
        for (let i = 1; i <= 5; i++) {
          const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];

          classes.push({
            class: `${grade} ${major} ${i}`,
            subject: subjects[Math.floor(Math.random() * subjects.length)],

            teacher: teachers[Math.floor(Math.random() * teachers.length)],

            start: `${7 + (counter % 8)}:00`,
            end: `${8 + (counter % 8)}:30`,

            room: rooms[Math.floor(Math.random() * rooms.length)],

            status: randomStatus.status,

            badgeClass: randomStatus.badgeClass,
            statusClass: randomStatus.statusClass,

            icon: randomStatus.icon,
          });

          counter++;
        }
      }
    }

    return {
      totalClasses: 45,
      problematicClasses: classes,
    };
  },

  computed: {
    occupiedClasses() {
      return this.totalClasses - this.problematicClasses.length;
    },

    occupancyPercent() {
      return Math.round((this.occupiedClasses / this.totalClasses) * 100);
    },
  },

  methods: {
    countStatus(status) {
      return this.problematicClasses.filter((item) => item.status === status)
        .length;
    },
  },
};
</script>

<style scoped>
.chart-title {
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.chart-subtitle {
  color: #94a3b8;
  font-size: 13px;
}

/* FILTER */
.chart-filter {
  width: 120px;
  height: 38px;

  background-color: rgba(255, 255, 255, 0.04);

  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;

  border-radius: 12px;

  font-size: 13px;
  font-weight: 600;

  padding-right: 35px;

  appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

  background-repeat: no-repeat;
  background-position: right 12px center;
}

/* LEFT */
.occupancy-card,
.status-card,
.problem-wrapper {
  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.05);

  border-radius: 20px;

  padding: 20px;
}

.card-title {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.card-subtitle {
  color: #94a3b8;
}

.percent-badge {
  background: rgba(34, 197, 94, 0.15);

  color: #4ade80;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

/* CIRCLE */
.circle-wrapper {
  display: flex;
  justify-content: center;

  margin: 28px 0;
}

.circle-chart {
  width: 180px;
  height: 180px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-inner {
  width: 135px;
  height: 135px;

  border-radius: 50%;

  background: #071426;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle-inner h2 {
  color: white;

  font-size: 42px;
  font-weight: 700;

  margin: 0;
}

.circle-inner span {
  color: #94a3b8;
}

/* MINI */
.mini-stats {
  display: flex;
  gap: 14px;
}

.mini-item {
  flex: 1;

  display: flex;
  align-items: center;

  gap: 10px;

  background: rgba(255, 255, 255, 0.03);

  border-radius: 14px;

  padding: 12px;
}

.mini-item strong {
  display: block;

  color: white;
}

.mini-item small {
  color: #94a3b8;
}

/* STATUS */
.status-card {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: white;
}

.status-left {
  display: flex;
  align-items: center;

  gap: 10px;
}

/* RIGHT */
.problem-title {
  color: white;

  font-size: 16px;
  font-weight: 700;
}

.problem-subtitle {
  color: #94a3b8;
}

.problem-count {
  background: rgba(239, 68, 68, 0.15);

  color: #f87171;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

/* CARD */
.problem-card {
  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.05);

  border-radius: 18px;

  padding: 14px;

  transition: 0.2s ease;

  height: 100%;
}

.problem-card:hover {
  transform: translateY(-2px);

  background: rgba(255, 255, 255, 0.05);
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 12px;
}

.problem-icon {
  width: 42px;
  height: 42px;

  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
}

.class-name {
  color: white;

  font-size: 15px;
  font-weight: 700;

  margin-bottom: 4px;
}

.teacher-name {
  color: #94a3b8;

  font-size: 12px;

  margin-bottom: 12px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-info {
  color: #cbd5e1;

  font-size: 12px;

  display: flex;
  align-items: center;

  gap: 6px;

  margin-bottom: 6px;
}

/* BADGE */
.status-badge {
  padding: 5px 10px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.badge-warning {
  background: rgba(250, 204, 21, 0.15);
  color: #fde047;
}

.badge-blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.badge-orange {
  background: rgba(251, 146, 60, 0.15);
  color: #fdba74;
}

.badge-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* ICON */
.icon-warning {
  background: rgba(250, 204, 21, 0.15);
  color: #facc15;
}

.icon-blue {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.icon-orange {
  background: rgba(251, 146, 60, 0.15);
  color: #fb923c;
}

.icon-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* DOT */
.dot {
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

.blue {
  background: #3b82f6;
}

.orange {
  background: #fb923c;
}

.danger {
  background: #ef4444;
}

/* MOBILE */
@media (max-width: 768px) {
  .circle-chart {
    width: 150px;
    height: 150px;
  }

  .circle-inner {
    width: 110px;
    height: 110px;
  }

  .circle-inner h2 {
    font-size: 34px;
  }

  .mini-stats {
    flex-direction: column;
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
