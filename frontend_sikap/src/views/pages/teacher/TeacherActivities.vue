<template>
  <section class="teacher-activities">
    <header class="page-heading">
      <div>
        <span>AGENDA GURU</span>
        <h1>Tugas &amp; Kegiatan</h1>
        <p>Lihat kegiatan yang perlu diikuti hari ini dan riwayat agenda sebelumnya.</p>
      </div>
      <div class="heading-icon"><i class="bi bi-clipboard2-check"></i></div>
    </header>

    <div class="summary-grid">
      <article class="summary-card">
        <div class="summary-icon blue"><i class="bi bi-calendar-event"></i></div>
        <div>
          <strong>{{ sessions.length }}</strong>
          <span>Total agenda</span>
        </div>
      </article>
      <article class="summary-card">
        <div class="summary-icon green"><i class="bi bi-check-circle"></i></div>
        <div>
          <strong>{{ attendanceCount }}</strong>
          <span>Sudah presensi</span>
        </div>
      </article>
      <article class="summary-card">
        <div class="summary-icon orange"><i class="bi bi-hourglass-split"></i></div>
        <div>
          <strong>{{ pendingCount }}</strong>
          <span>Belum presensi</span>
        </div>
      </article>
    </div>

    <div v-if="errorMessage" class="error-message" role="alert">
      <i class="bi bi-exclamation-circle"></i>
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="content-card state-message">
      <span class="spinner-border spinner-border-sm text-success" role="status"></span>
      Memuat agenda kegiatan...
    </div>
    <template v-else-if="!errorMessage">
      <section
        v-for="group in activityGroups"
        :key="group.key"
        class="content-card"
      >
        <header class="section-header">
          <div>
            <h2>{{ group.title }}</h2>
            <p>{{ group.description }}</p>
          </div>
          <label v-if="group.key === 'today'" class="filter-control">
            <span class="visually-hidden">Filter status presensi</span>
            <select v-model="attendanceFilter" aria-label="Filter status presensi">
              <option value="all">Semua agenda</option>
              <option value="attended">Sudah presensi</option>
              <option value="pending">Belum presensi</option>
            </select>
          </label>
        </header>

        <div v-if="group.sessions.length" class="activity-list">
          <article
            v-for="session in group.sessions"
            :key="session.id"
            class="activity-item"
          >
            <div class="date-block" :class="attendanceClass(session.attendance)">
              <strong>{{ formatDay(session.date) }}</strong>
              <span>{{ formatMonth(session.date) }}</span>
            </div>
            <div class="activity-details">
              <div class="activity-title-row">
                <h3>{{ session.Activity?.name || "Kegiatan sekolah" }}</h3>
                <span class="attendance-badge" :class="attendanceClass(session.attendance)">
                  <i class="bi" :class="attendanceIcon(session.attendance)"></i>
                  {{ attendanceLabel(session.attendance) }}
                </span>
              </div>
              <p v-if="session.Activity?.description" class="description">
                {{ session.Activity.description }}
              </p>
              <div class="activity-meta">
                <span><i class="bi bi-calendar3"></i>{{ formatFullDate(session.date) }}</span>
                <span><i class="bi bi-sun"></i>{{ sessionTimeLabel(session) }}</span>
                <span v-if="session.Activity?.type">
                  <i class="bi bi-arrow-repeat"></i>{{ activityTypeLabel(session.Activity.type) }}
                </span>
              </div>
              <p v-if="session.attendance?.notes" class="attendance-note">
                <i class="bi bi-chat-left-text"></i>
                {{ session.attendance.notes }}
              </p>
            </div>
          </article>
        </div>
        <div v-else class="state-message empty-state">
          <i class="bi" :class="group.emptyIcon"></i>
          {{ group.emptyMessage }}
        </div>
      </section>
    </template>

    <section class="content-card log-card">
      <header class="section-header">
        <div>
          <h2>Log Presensi</h2>
          <p>Riwayat presensi kegiatan yang sudah tercatat.</p>
        </div>
        <span class="log-count">{{ attendanceCount }} catatan</span>
      </header>

      <div v-if="attendanceLogs.length" class="log-list">
        <article v-for="session in attendanceLogs" :key="`log-${session.id}`" class="log-item">
          <span class="log-marker" :class="attendanceClass(session.attendance)">
            <i class="bi" :class="attendanceIcon(session.attendance)"></i>
          </span>
          <div class="log-details">
            <strong>{{ session.Activity?.name || "Kegiatan sekolah" }}</strong>
            <span>{{ formatFullDate(session.date) }} · {{ sessionTimeLabel(session) }}</span>
            <small>
              Presensi {{ attendanceStatusLabel(session.attendance.status) }}
              <template v-if="session.attendance.createdAt">
                · dicatat {{ formatDateTime(session.attendance.createdAt) }}
              </template>
            </small>
            <small v-if="session.attendance.notes" class="log-note">
              Catatan: {{ session.attendance.notes }}
            </small>
          </div>
          <span class="log-status" :class="attendanceClass(session.attendance)">
            {{ attendanceStatusLabel(session.attendance.status) }}
          </span>
        </article>
      </div>
      <div v-else-if="!loading" class="state-message log-empty">
        Belum ada log presensi kegiatan.
      </div>
      <div v-else class="state-message log-empty">
        Memuat log presensi...
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getTeacherActivitySessions } from "@/services/api";
import { applicationClock } from "@/services/applicationClock";

const sessions = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const attendanceFilter = ref("all");
const todayDate = getTodayDateKey();
const refreshIntervalMs = 15_000;
let refreshInterval;
let isRefreshing = false;

const attendanceCount = computed(
  () => sessions.value.filter((session) => session.attendance).length,
);
const pendingCount = computed(() => sessions.value.length - attendanceCount.value);
const attendanceLogs = computed(() =>
  sessions.value.filter((session) => session.attendance),
);
const filteredSessions = computed(() => {
  if (attendanceFilter.value === "attended") {
    return sessions.value.filter((session) => session.attendance);
  }
  if (attendanceFilter.value === "pending") {
    return sessions.value.filter((session) => !session.attendance);
  }
  return sessions.value;
});
const activityGroups = computed(() => {
  const todaySessions = [];
  const upcomingSessions = [];
  const historySessions = [];

  filteredSessions.value.forEach((session) => {
    const date = normalizeDate(session.date);
    if (date === todayDate) {
      todaySessions.push(session);
    } else if (date > todayDate) {
      upcomingSessions.push(session);
    } else if (date) {
      historySessions.push(session);
    }
  });

  upcomingSessions.sort((left, right) =>
    normalizeDate(left.date).localeCompare(normalizeDate(right.date)),
  );
  historySessions.sort((left, right) =>
    normalizeDate(right.date).localeCompare(normalizeDate(left.date)),
  );

  const hasStatusFilter = attendanceFilter.value !== "all";
  return [
    {
      key: "today",
      title: "Kegiatan Hari Ini",
      description: "Agenda yang perlu Anda ikuti hari ini.",
      emptyIcon: "bi-calendar2-check",
      emptyMessage: hasStatusFilter
        ? "Tidak ada agenda hari ini yang sesuai dengan filter presensi."
        : "Tidak ada kegiatan yang dijadwalkan untuk hari ini.",
      sessions: todaySessions,
    },
    {
      key: "upcoming",
      title: "Kegiatan Mendatang",
      description: "Agenda yang dijadwalkan setelah hari ini.",
      emptyIcon: "bi-calendar-event",
      emptyMessage: hasStatusFilter
        ? "Tidak ada agenda mendatang yang sesuai dengan filter presensi."
        : "Tidak ada kegiatan mendatang.",
      sessions: upcomingSessions,
    },
    {
      key: "history",
      title: "Riwayat Kegiatan",
      description: "Agenda kegiatan yang sudah berlalu.",
      emptyIcon: "bi-calendar2-x",
      emptyMessage: hasStatusFilter
        ? "Tidak ada riwayat yang sesuai dengan filter presensi."
        : "Belum ada riwayat kegiatan.",
      sessions: historySessions,
    },
  ];
});

function getTodayDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(applicationClock.currentTime);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatDay(value) {
  const date = normalizeDate(value);
  return date ? new Date(`${date}T00:00:00`).getDate() : "--";
}

function formatMonth(value) {
  const date = normalizeDate(value);
  return date
    ? new Intl.DateTimeFormat("id-ID", { month: "short" })
        .format(new Date(`${date}T00:00:00`))
        .toUpperCase()
    : "";
}

function formatFullDate(value) {
  const date = normalizeDate(value);
  if (!date) return "Tanggal belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function normalizeDate(value) {
  if (!value) return "";
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value).slice(0, 10);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function sessionLabel(value) {
  const labels = {
    morning: "Pagi",
    afternoon: "Siang",
    all_day: "Seharian",
  };
  return labels[value] || "Waktu belum ditentukan";
}

function sessionTimeLabel(session) {
  if (session.start_time && session.end_time) {
    return `${session.start_time.slice(0, 5)}–${session.end_time.slice(0, 5)}`;
  }
  return sessionLabel(session.session);
}

function activityTypeLabel(value) {
  return value === "routine" ? "Rutin" : "Tentatif";
}

function attendanceStatusLabel(value) {
  const labels = {
    present: "Hadir",
    absent: "Alfa",
    sick: "Sakit",
    permission: "Izin",
  };
  return labels[String(value || "").toLowerCase()] || "Status tidak diketahui";
}

function attendanceLabel(attendance) {
  return attendance ? attendanceStatusLabel(attendance.status) : "Belum presensi";
}

function attendanceClass(attendance) {
  if (!attendance) return "pending";
  const status = String(attendance.status || "").toLowerCase();
  return ["present", "absent", "sick", "permission"].includes(status)
    ? status
    : "unknown";
}

function attendanceIcon(attendance) {
  const icons = {
    pending: "bi-clock-fill",
    present: "bi-check-circle-fill",
    absent: "bi-x-circle-fill",
    sick: "bi-heart-pulse-fill",
    permission: "bi-envelope-check-fill",
    unknown: "bi-question-circle-fill",
  };
  return icons[attendanceClass(attendance)];
}

async function loadActivities() {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const data = await getTeacherActivitySessions();
    sessions.value = data.sort((left, right) => {
      return normalizeDate(right.date).localeCompare(normalizeDate(left.date));
    });
    errorMessage.value = "";
  } catch (error) {
    console.error("Gagal memuat agenda dan log presensi guru:", error);
    if (loading.value) {
      errorMessage.value = error.message || "Agenda kegiatan gagal dimuat.";
    }
  } finally {
    loading.value = false;
    isRefreshing = false;
  }
}

onMounted(() => {
  loadActivities();
  refreshInterval = window.setInterval(loadActivities, refreshIntervalMs);
  window.addEventListener("focus", loadActivities);
});

onUnmounted(() => {
  window.clearInterval(refreshInterval);
  window.removeEventListener("focus", loadActivities);
});
</script>

<style scoped>
.teacher-activities {
  color: #f8fafc;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  text-align: left;
}

.page-heading > div:first-child > span {
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.page-heading h1 {
  margin: 7px 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 700;
}

.page-heading p {
  margin: 0;
  color: #94a3b8;
}

.heading-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid rgba(74, 222, 128, 0.16);
  border-radius: 16px;
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  font-size: 1.35rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.summary-card {
  display: flex;
  min-height: 92px;
  align-items: center;
  gap: 13px;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 16px;
  background: #111c31;
  text-align: left;
}

.summary-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 13px;
  font-size: 1.05rem;
}

.summary-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.summary-icon.green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.summary-icon.orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.summary-card strong,
.summary-card span {
  display: block;
}

.summary-card strong {
  font-size: 1.35rem;
}

.summary-card span {
  color: #94a3b8;
  font-size: 0.82rem;
}

.content-card {
  margin-bottom: 18px;
  padding: 22px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  background: #111c31;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  text-align: left;
}

.section-header h2 {
  margin: 0 0 4px;
  color: #f8fafc;
  font-size: 1.05rem;
  font-weight: 700;
}

.section-header p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.82rem;
}

.filter-control select {
  min-width: 150px;
  padding: 8px 30px 8px 11px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  background-color: #0f172a;
  color: #cbd5e1;
  font-size: 0.8rem;
}

.activity-list {
  display: grid;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.58);
  text-align: left;
}

.date-block {
  display: flex;
  width: 48px;
  min-height: 53px;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.date-block strong {
  font-size: 1.15rem;
  line-height: 1;
}

.date-block span {
  margin-top: 4px;
  font-size: 0.65rem;
  font-weight: 700;
}

.activity-details {
  min-width: 0;
  flex: 1;
}

.activity-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.activity-title-row h3 {
  margin: 2px 0 0;
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 650;
}

.attendance-badge,
.log-status {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
}

.attendance-badge.present,
.log-status.present,
.date-block.present,
.log-marker.present {
  background: rgba(34, 197, 94, 0.14);
  color: #4ade80;
}

.attendance-badge.permission,
.log-status.permission,
.date-block.permission,
.log-marker.permission {
  background: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
}

.attendance-badge.sick,
.log-status.sick,
.date-block.sick,
.log-marker.sick {
  background: rgba(168, 85, 247, 0.16);
  color: #d8b4fe;
}

.attendance-badge.absent,
.log-status.absent,
.date-block.absent,
.log-marker.absent {
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
}

.attendance-badge.pending,
.log-status.pending,
.date-block.pending,
.log-marker.pending {
  background: rgba(249, 115, 22, 0.14);
  color: #fdba74;
}

.attendance-badge.unknown,
.log-status.unknown,
.date-block.unknown,
.log-marker.unknown {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
}

.description {
  margin: 8px 0 0;
  color: #94a3b8;
  font-size: 0.82rem;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 16px;
  margin-top: 10px;
  color: #94a3b8;
  font-size: 0.76rem;
}

.activity-meta i {
  margin-right: 5px;
  color: #64748b;
}

.attendance-note {
  margin: 9px 0 0;
  color: #cbd5e1;
  font-size: 0.78rem;
}

.attendance-note i {
  margin-right: 5px;
  color: #94a3b8;
}

.log-count {
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  font-size: 0.75rem;
}

.log-list {
  display: grid;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  text-align: left;
}

.log-marker {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.log-details {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.log-details strong {
  color: #e2e8f0;
  font-size: 0.85rem;
}

.log-details span,
.log-details small {
  color: #94a3b8;
  font-size: 0.76rem;
}

.log-details .log-note {
  color: #cbd5e1;
}

.state-message {
  display: flex;
  min-height: 105px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  text-align: center;
}

.state-message > i {
  color: #4ade80;
  font-size: 1.3rem;
}

.state-message strong {
  color: #e2e8f0;
}

.state-message p {
  margin: 5px 0 0;
  font-size: 0.82rem;
}

.empty-state {
  flex-wrap: wrap;
}

.log-empty {
  min-height: 70px;
}

.error-message {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.15);
  color: #fca5a5;
  text-align: left;
}

@media (max-width: 767px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  .summary-card:last-child {
    grid-column: 1 / -1;
  }

  .content-card {
    padding: 16px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .filter-control,
  .filter-control select {
    width: 100%;
  }

  .activity-item {
    gap: 10px;
    padding: 12px;
  }

  .activity-title-row {
    flex-direction: column;
    gap: 7px;
  }

  .attendance-badge {
    align-self: flex-start;
  }

  .log-status {
    display: none;
  }
}
</style>
