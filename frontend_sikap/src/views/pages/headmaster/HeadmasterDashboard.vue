<template>
  <div class="row d-md-none"><HeadmasterNavbar/></div>
  <div class="headmaster-dashboard mt-3">
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6 col-xl-4">
        <div class="card stat-card shadow-sm">
          <div class="card-body bg-img">
            <div class="row text-start px-2">
              <div class="col-8">
                <p class="text-1 mb-2 text-success fw-bold">
                  Selamat datang kembali, <br />
                  <span class="text-dark text-2">{{ headmasterName }} 👋</span>
                  <br /><span class="text-muted text-3"
                    >Kepala Sekolah SMK Negeri 4 Bandung <br />
                    {{realtimeDateTime}}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-blue text-white">
                  <i class="bi bi-briefcase-fill fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Total Guru
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">{{totalGuruAktif}} Guru</div>
              <div class="status-sub text-success">
                Aktif: {{ totalGuruAktif }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-2">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-green text-white">
                  <i class="bi bi-journal-check fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Kehadiran Guru Dikelas
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">75 %</div>
              <!-- PROGRESS BAR -->
              <div
                class="progress my-2"
                role="progressbar"
                aria-label="Example 1px high"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
                style="height: 10px"
              >
                <div class="progress-bar bg-success" style="width: 75%"></div>
              </div>

              <div class="status-sub">24 dari 32 Kelas</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-yellow text-white">
                  <i class="bi bi-check2-circle fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Partisipasi Guru
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">93%</div>
              <div
                class="progress my-2"
                role="progressbar"
                aria-label="Example 1px high"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
                style="height: 10px"
              >
                <div class="progress-bar bg-yellow" style="width: 93%"></div>
              </div>
              <div class="status-sub">28 dari 30 hari</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-md-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-purple text-white">
                  <i class="bi bi-star-fill fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Penilaian Sementara
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">
                80 <span class="text-secondary">/ 100</span>
              </div>

              <!-- RATING BINTANG -->
              <div class="rating-stars my-1">
                <!-- FULL STAR -->
                <i
                  v-for="n in fullStars"
                  :key="'full' + n"
                  class="bi bi-star-fill text-warning"
                ></i>

                <!-- HALF STAR -->
                <i v-if="hasHalfStar" class="bi bi-star-half text-warning"></i>

                <!-- EMPTY STAR -->
                <i
                  v-for="n in emptyStars"
                  :key="'empty' + n"
                  class="bi bi-star text-warning"
                ></i>
              </div>

              <!-- <div class="status-sub">oleh Pembimbing Industri</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BARIS 2 -->
    <div class="row g-3 mb-4">
      <!-- GRAFIK -->
      <div class="col-12 col-xl-6">
        <div class="card chart-card shadow-sm h-100">
          <div class="card-body">
            <!-- CHART -->
            <TeacherAttendanceChart />
          </div>
        </div>
      </div>

      <!-- JURNAL -->
      <div class="col-12 col-xl-6">
        <div class="card info-card shadow-sm h-100">
          <div class="card-body">
            <!-- HEADER -->
            <TeacherParticipan />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";

import TeacherAttendanceChart from "@/components/headmaster/dashboard/TeacherAttendanceChart.vue";
import TeacherParticipan from "@/components/headmaster/dashboard/TeacherParticipan.vue";
import HeadmasterNavbar from "@/components/headmaster/HeadmasterNavbar.vue";

import { getTeachers } from "@/services/api.js";

const teachers = ref([]);

async function loadTeachers() {
  try {
    const data = await getTeachers();
    teachers.value = data;
  } catch (error) {
    console.error("Gagal memuat data guru:", error);
  }
}

const rating = ref((80 / 100) * 5); // Contoh nilai rating (80 dari 100)
const headmasterName = ref("Yudi Kartiwa, S.Pd., M.T.");
const realtimeDateTime = ref("")
let clockInterval = null;

function loadHeadmasterData(){
  try {
    const user = JSON.parse(localStorage.getItem("user")||"{}");
    headmasterName.value = user.name || "Yudi Kartiwa, S.Pd., M.T.";
  } catch (error) {
    console.error("Gagal memuat data kepala sekolah:", error);
  }
}

function updateRealtimeClock() {

  const now = new Date();

  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jam = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  realtimeDateTime.value = `${tanggal} | ${jam}`;
}

function formatDate(date) {
  if (!date) return "-";

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("id-ID", options);
}

function getStatusClass(status) {
  return {
    hadir: "bg-success",
    absen: "bg-danger",
    libur: "bg-secondary",
  }[status];
}


// ======================
// COMPUTED
// ======================

const fullStars = computed(() => {
  return Math.floor(rating.value);
});

const hasHalfStar = computed(() => {
  return rating.value % 1 >= 0.5;
});

const emptyStars = computed(() => {
  return 5 - fullStars.value - (hasHalfStar.value ? 1 : 0);
});

const totalGuru = computed(() => {
  return teachers.value.length;
});

const totalGuruAktif = computed(() => {
  return teachers.value.filter((guru) => guru.status === "active").length;
});

onMounted(() => {
  loadHeadmasterData();
  loadTeachers();

  // update pertama
  updateRealtimeClock();

  // update waktu setiap detik, tanpa memanggil fetch ulang data guru
  clockInterval = setInterval(() => {
    updateRealtimeClock();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(clockInterval);
});

</script>

<style scoped>
.headmaster-dashboard {
  animation: fadeIn 0.25s ease-in;
}
.page-header {
  padding: 1.6rem 1.5rem;
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.15),
    rgba(59, 130, 246, 0.05)
  );
  border: 1px solid rgba(148, 163, 184, 0.18);
}
.greeting {
  color: #2563eb;
  font-weight: 600;
}
.page-title {
  font-size: 2.1rem;
  font-weight: 700;
}
.page-subtitle {
  color: #475569;
}
.btn-icon {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.25);
  position: relative;
}
.btn-icon .badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.65rem;
  padding: 0.35rem 0.45rem;
}
.profile-chip {
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 0.55rem 0.9rem;
}
.profile-chip .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 700;
}
.stat-card,
.info-card,
.chart-card,
.journal-card {
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  /* background: #0e276f; */
  background: linear-gradient(180deg, #071426 0%, #0b1d35 100%) !important;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.stat-card {
  height: 160px;
}

.stat-label {
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}
.stat-value {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}
.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.bg-blue {
  background-color: #2563eb !important;
}
.bg-green {
  background-color: #16a34a !important;
}
.bg-yellow {
  background-color: #f59e0b !important;
}
.bg-purple {
  background-color: #8b5cf6 !important;
}
.info-badge {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 18px;
}
.info-row {
  /* display: flex; */
  /* justify-content: space-between; */
  gap: 1rem;
  /* flex-wrap: wrap; */
}
.info-row span {
  color: #64748b;
}
.info-row strong {
  font-weight: 600;
}
.attendance-chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.8rem;
  align-items: end;
  min-height: 210px;
}
.chart-bar {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 18px 18px 0 0;
  padding-bottom: 1.1rem;
  min-height: 24px;
  transition: transform 0.2s ease;
}
.chart-bar:hover {
  transform: translateY(-4px);
}
.chart-bar span {
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #334155;
  font-size: 0.8rem;
  font-weight: 700;
}
.chart-legend {
  color: #475569;
  font-size: 0.9rem;
}
.legend-dot {
  width: 0.85rem;
  height: 0.85rem;
  display: inline-block;
  border-radius: 999px;
  margin-right: 0.45rem;
}
.journal-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1.35rem;
}
.journal-item h6 {
  font-size: 1rem;
  font-weight: 700;
}
.journal-item p {
  margin-bottom: 0;
}
@media (max-width: 767px) {
  .page-header {
    padding: 1.25rem;
  }
  .stat-card {
    min-height: auto;
  }
  .stat-label {
    font-size: 0.8rem;
    margin-bottom: 0.35rem;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-1 {
  font-size: 0.8rem;
  /* color: #2563eb; */
  font-weight: 600;
}
.text-2 {
  font-size: 1.25rem;
  font-weight: 700;
}
.text-3 {
  font-size: 0.6rem;
  /* color: #64748b; */
}

.bg-img {
  background: url("@/assets/student-bg.png") no-repeat center center;
  background-size: cover;
}

.stat-label {
  margin-bottom: 4px !important;
}

.stat-value {
  line-height: 1.2;
}

.status-main {
  font-size: 23px;
  font-weight: 600;
  margin-bottom: 2px;
}

.status-sub {
  font-size: 12px;
  color: #6c757d;
  margin: 0;
}

.rating-stars i {
  font-size: 20px;
  margin-right: 2px;
}

.info-with-image {
  position: relative;
  overflow: hidden;
}

.info-content {
  z-index: 2;
  max-width: 65%;
  text-align: left;
}

.info-image {
  position: relative;
  right: 10px;
  bottom: 0;
}

.info-image img {
  width: 180px;
  opacity: 0.95;
  align-items: center;
}

.status-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: auto;
}

.bg-success-subtle {
  background-color: #e6f4ea;
}

.text-success {
  color: #2e7d32 !important;
}
</style>
