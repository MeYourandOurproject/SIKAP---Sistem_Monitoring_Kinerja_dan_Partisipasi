<template>
  <div class="attendance-page">
    <!-- Header -->
    <div class="page-top">
      <div>
        <h2 class="page-title">Validasi Kehadiran Guru</h2>

        <p class="page-subtitle">Kelas {{ dashboard.class }}</p>
      </div>

      <div class="schedule-box">
        <h3>{{ dashboard.data.length }}</h3>
        <span>Jadwal Hari Ini</span>
      </div>
    </div>

    <!-- CURRENT LESSON -->

    <div v-if="dashboard.current" class="current-card">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="current-tag">● Sedang Berlangsung</div>

          <h2 class="mt-3">
            {{ dashboard.current.subject_name }}
          </h2>

          <div class="teacher mt-3">
            <i class="bi bi-person-circle"></i>

            {{ dashboard.current.teacher_name }}
          </div>

          <div class="row mt-4">
            <div class="col-6">
              <small>Jam Pelajaran</small>

              <h5>
                {{ dashboard.current.start }}
                -
                {{ dashboard.current.end }}
              </h5>
            </div>

            <div class="col-6">
              <small>Ruangan</small>

              <h5>
                {{ dashboard.current.classroom_name }}
              </h5>
            </div>
          </div>
        </div>

        <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">
          <button class="btn btn-light btn-lg px-5">
            <i class="bi bi-check-circle-fill me-2"></i>

            Validasi
          </button>
        </div>
      </div>
    </div>

    <!-- LIST -->

    <h5 class="section-title">Jadwal Selanjutnya</h5>

    <div v-for="item in scheduleList" :key="item.id" class="schedule-item">
      <div class="schedule-left">
        <div class="schedule-time">
          {{ item.start }}

          <small>{{ item.end }}</small>
        </div>
      </div>

      <div class="schedule-body">
        <h5>
          {{ item.subject_name }}
        </h5>

        <div class="teacher-name">
          <i class="bi bi-person"></i>

          {{ item.teacher_name }}
        </div>

        <div class="room">
          <i class="bi bi-geo-alt"></i>

          {{ item.classroom_name }}
        </div>
      </div>

      <div class="schedule-right">
        <span class="status" :class="item.status">
          {{ item.status == "finished" ? "Selesai" : "Berikutnya" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getClassSchedules } from "@/services/api";

const dashboard = ref({
  class: "",
  current: null,
  data: [],
});

const scheduleList = computed(() =>
  dashboard.value.data.filter((i) => i.status !== "current"),
);

async function fetchSchedules() {
  dashboard.value = await getClassSchedules();
}

onMounted(fetchSchedules);
</script>

<style scoped>
.attendance-page {
  color: white;
}

/* HEADER */

.page-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.page-title {
  font-size: 34px;
  font-weight: 700;
}

.page-subtitle {
  color: #94a3b8;
  margin-top: 5px;
}

.schedule-box {
  width: 150px;
  height: 120px;

  border-radius: 22px;

  background: linear-gradient(135deg, #2563eb, #7c3aed);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.schedule-box h3 {
  font-size: 40px;
  margin: 0;
  font-weight: bold;
}

.schedule-box span {
  color: #dbeafe;
  font-size: 13px;
}

/* CURRENT */

.current-card {
  background: #1b2338;

  border-radius: 24px;

  padding: 35px;

  margin-bottom: 45px;

  border: 1px solid rgba(255, 255, 255, 0.05);

  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
}

.current-tag {
  display: inline-block;

  padding: 8px 18px;

  border-radius: 30px;

  background: #22c55e;

  font-size: 13px;

  font-weight: 600;
}

.current-card h2 {
  font-weight: 700;
}

.teacher {
  font-size: 20px;

  color: #dbeafe;
}

.current-card small {
  color: #94a3b8;
}

.current-card h5 {
  margin-top: 6px;

  font-weight: 600;
}

/* SECTION */

.section-title {
  margin-bottom: 20px;

  font-weight: 700;
}

/* SCHEDULE */

.schedule-item {
  display: flex;

  align-items: center;

  background: #1b2338;

  border-radius: 18px;

  margin-bottom: 18px;

  padding: 22px;

  transition: 0.25s;

  border: 1px solid rgba(255, 255, 255, 0.04);
}

.schedule-item:hover {
  transform: translateY(-4px);

  border-color: #3b82f6;
}

.schedule-left {
  width: 120px;
}

.schedule-time {
  font-size: 22px;

  font-weight: bold;
}

.schedule-time small {
  display: block;

  color: #94a3b8;

  font-size: 14px;
}

.schedule-body {
  flex: 1;
}

.schedule-body h5 {
  margin-bottom: 12px;

  font-weight: 700;
}

.teacher-name {
  color: #dbeafe;

  margin-bottom: 8px;
}

.room {
  color: #94a3b8;
}

.schedule-right {
  width: 140px;

  text-align: right;
}

.status {
  display: inline-block;

  padding: 10px 18px;

  border-radius: 30px;

  font-size: 13px;

  font-weight: 600;
}

.finished {
  background: #374151;
}

.upcoming {
  background: #2563eb;
}
</style>
