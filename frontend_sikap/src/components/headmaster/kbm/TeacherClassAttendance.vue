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
          <div
            class="d-flex justify-content-between align-items-start text-start"
          >
            <div>
              <h6 class="card-title">Kelas Aktif</h6>

              <small class="card-subtitle"> Total kelas aktif hari ini </small>
            </div>

            <div class="percent-badge">{{ occupancyPercent }} %</div>
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

          <small class="card-subtitle"
            >Kelas Aktif adalah kelas yang memiliki aktivitas pembelajaran.
          </small>

          <!-- STATS -->
          <!-- <div class="mini-stats">
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
                <strong>{{ problematicCount }}</strong>
                <small>Bermasalah</small>
              </div>
            </div>
          </div> -->
        </div>

        <!-- STATUS -->
        <div class="status-card">
          <div class="status-item">
            <div class="status-left">
              <span class="dot success"></span>
              <span>Aktif</span>
            </div>

            <strong>{{ occupiedClasses }}</strong>
          </div>

          <div class="status-item">
            <div class="status-left">
              <span class="dot warning"></span>
              <span>Terlambat</span>
            </div>

            <strong>{{ lateCount }}</strong>
          </div>

          <div class="status-item">
            <div class="status-left">
              <span class="dot danger"></span>
              <span>Kosong</span>
            </div>

            <strong>{{ emptyClasses }}</strong>
          </div>

          <div class="status-item">
            <div class="status-left">
              <span class="dot blue"></span>
              <span>Belum Validasi</span>
            </div>

            <strong>{{ unvalidatedCount }}</strong>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-xl-9">
        <div class="problem-wrapper">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 class="problem-title mb-1">Monitoring Semua Kelas</h6>

              <small class="problem-subtitle">
                Status pembelajaran saat ini
              </small>
            </div>

            <span class="problem-count"> {{ allClasses.length }} Kelas </span>
          </div>

          <!-- GRID -->
          <div class="row g-3">
            <div
              class="col-12 col-sm-6 col-lg-4 col-xxl-3"
              v-for="(item, index) in allClasses"
              :key="index"
            >
              <div
                class="problem-card compact-card text-start"
                :class="item.color"
              >
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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { getClasses } from "@/services/api";

const monitoringData = ref([]);
const totalClasses = ref(0);
const loading = ref(false);

let interval = null;

const problematicCount = computed(() => {
  return monitoringData.value.filter((item) => item.color !== "green").length;
});

const loadMonitoring = async () => {
  loading.value = true;

  try {
    const data = await getClasses();

    monitoringData.value = data?.data || [];
    totalClasses.value = data?.total || 0;
  } catch (error) {
    console.error("Gagal memuat monitoring kelas:", error);
  } finally {
    loading.value = false;
  }
};

const allClasses = computed(() => {
  return monitoringData.value.map((item) => {
    let badgeClass = "badge-blue";
    let statusClass = "icon-blue";
    let icon = "bi bi-question-circle-fill";

    if (item.color === "green") {
      badgeClass = "badge-success";
      statusClass = "icon-success";
      icon = "bi bi-check-circle-fill";
    }

    if (item.color === "yellow") {
      badgeClass = "badge-warning";
      statusClass = "icon-warning";
      icon = "bi bi-clock-fill";
    }

    if (item.color === "red") {
      badgeClass = "badge-danger";
      statusClass = "icon-danger";
      icon = "bi bi-x-circle-fill";
    }

    return {
      ...item,

      class: item.class_name,
      teacher: item.teacher_name,
      subject: item.subject_name,

      room: item.classroom_name || item.ruang,

      start: item.start || `JP ${item.jp_mulai}`,
      end: item.end || `JP ${item.jp_selesai}`,

      badgeClass,
      statusClass,
      icon,
    };
  });
});

const activeStatuses = ["mengajar", "praktik", "diskusi", "tugas"];

const occupiedClasses = computed(() => {
  return monitoringData.value.filter((item) =>
    activeStatuses.includes(item.status?.toLowerCase()),
  ).length;
});

const emptyClasses = computed(() => {
  return monitoringData.value.filter(
    (item) => item.status?.toLowerCase() === "kelas_kosong",
  ).length;
});

// const unvalidatedCount = computed(() => {
//   return monitoringData.value.filter(
//     (item) => item.validated === false
//   ).length;
// });

const lateCount = computed(() => {
  return monitoringData.value.filter((item) => item.terlambat === "ya").length;
});

const occupancyPercent = computed(() => {
  if (!totalClasses.value) return 0;

  return Math.round((occupiedClasses.value / totalClasses.value) * 100);
});

const countStatus = (status) => {
  if (status === "Mengajar") {
    return monitoringData.value.filter(
      (item) => item.status?.toLowerCase() === "mengajar",
    ).length;
  }

  if (status === "Kosong") {
    return monitoringData.value.filter(
      (item) => item.status?.toLowerCase() === "kelas_kosong",
    ).length;
  }

  if (status === "Izin") {
    return monitoringData.value.filter(
      (item) => item.status?.toLowerCase() === "izin",
    ).length;
  }

  if (status === "Tugas") {
    return monitoringData.value.filter(
      (item) => item.status?.toLowerCase() === "tugas",
    ).length;
  }

  if (status === "Belum Validasi") {
    return monitoringData.value.filter((item) => item.validated === false)
      .length;
  }

  return 0;
};

const unvalidatedCount = computed(() => {
  return monitoringData.value.filter((item) => item.validated === false).length;
});

onMounted(() => {
  loadMonitoring();

  interval = setInterval(() => {
    loadMonitoring();
  }, 30000);
});

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
});
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
  background: rgba(34, 197, 94, 0.15);

  color: #4ade80;

  padding: 6px 20px;

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

.problem-card.green {
  border-left: 4px solid #22c55e;
}

.problem-card.yellow {
  border-left: 4px solid #facc15;
}

.problem-card.red {
  border-left: 4px solid #ef4444;
}

.problem-card.biru {
  border-left: 4px solid #3b82f6;
}

.badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.icon-success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
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
  align-items: start;

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

.badge-neutral {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
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

.icon-neutral {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
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
