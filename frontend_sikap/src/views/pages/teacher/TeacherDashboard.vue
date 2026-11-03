<template>
  <section class="teacher-dashboard text-start">
    <div class="hero-card">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div>
          <span class="hero-badge">PANEL GURU</span>
          <h1>Halo, {{ userName }} <span aria-hidden="true">👋</span></h1>
          <p>
            Pantau jadwal mengajar, kegiatan, dan agenda pembelajaran Anda
            melalui ringkasan hari ini.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink to="/guru/jadwal" class="primary-button">
            <i class="bi bi-calendar-week"></i>
            Lihat Jadwal
          </RouterLink>
          <RouterLink to="/guru/kegiatan" class="secondary-button">
            <i class="bi bi-clipboard2-check"></i>
            Tugas &amp; Kegiatan
          </RouterLink>
        </div>
      </div>
    </div>

    <section class="today-banner">
      <div class="today-date">
        <span class="live-dot"></span>
        <div>
          <strong>{{ currentTime }} WIB</strong>
          <span>{{ todayLabel }}</span>
        </div>
      </div>
      <div class="today-focus">
        <template v-if="activeSchedule">
          <span class="focus-label">SEDANG BERLANGSUNG</span>
          <strong>{{ activeSchedule.Subject?.subject_name || "Mata pelajaran" }}</strong>
          <span>
            {{ activeSchedule.Class?.class_name || "Kelas" }}
            · {{ formatTime(activeSchedule.startTimeslot?.start) }}–{{ formatTime(activeSchedule.endTimeslot?.end) }}
          </span>
        </template>
        <template v-else-if="nextSchedule">
          <span class="focus-label">JADWAL BERIKUTNYA</span>
          <strong>{{ nextSchedule.Subject?.subject_name || "Mata pelajaran" }}</strong>
          <span>
            {{ nextSchedule.Class?.class_name || "Kelas" }}
            · mulai {{ formatTime(nextSchedule.startTimeslot?.start) }}
          </span>
        </template>
        <template v-else>
          <span class="focus-label">AGENDA HARI INI</span>
          <strong>{{ todaySchedules.length ? "Seluruh jadwal hari ini selesai" : "Tidak ada jadwal mengajar hari ini" }}</strong>
          <span>Silakan cek agenda kegiatan atau jadwal di hari lain.</span>
        </template>
      </div>
      <RouterLink to="/guru/jadwal" class="today-link" aria-label="Buka jadwal mengajar">
        <i class="bi bi-arrow-up-right"></i>
      </RouterLink>
    </section>

    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-icon blue"><i class="bi bi-calendar-day"></i></span>
        <div><strong>{{ todaySchedules.length }}</strong><span>Jadwal hari ini</span></div>
      </article>
      <article class="stat-card">
        <span class="stat-icon green"><i class="bi bi-people"></i></span>
        <div><strong>{{ classCount }}</strong><span>Kelas diampu</span></div>
      </article>
      <article class="stat-card">
        <span class="stat-icon orange"><i class="bi bi-clipboard2-check"></i></span>
        <div><strong>{{ pendingActivities }}</strong><span>Kegiatan belum presensi</span></div>
      </article>
      <article class="stat-card">
        <span class="stat-icon purple"><i class="bi bi-journal-bookmark"></i></span>
        <div><strong>{{ schedules.length }}</strong><span>Total jadwal mingguan</span></div>
      </article>
    </div>

    <div class="dashboard-columns">
      <section class="content-card">
        <header class="section-heading">
          <div>
            <span class="section-kicker">AKADEMIK</span>
            <h2>Jadwal Hari Ini</h2>
          </div>
          <RouterLink to="/guru/jadwal" class="section-link">Lihat semua <i class="bi bi-arrow-right"></i></RouterLink>
        </header>

        <p v-if="scheduleError" class="error-state" role="alert">
          <i class="bi bi-exclamation-circle"></i> {{ scheduleError }}
        </p>
        <div v-else-if="scheduleLoading" class="empty-state">
          <span class="spinner-border spinner-border-sm text-success" role="status"></span>
          Memuat jadwal...
        </div>
        <div v-else-if="todaySchedules.length" class="schedule-list">
          <article
            v-for="schedule in todaySchedules"
            :key="schedule.id"
            class="schedule-item"
            :class="{ 'is-active': scheduleStatus(schedule) === 'ongoing' }"
          >
            <div class="time-column">
              <strong>{{ formatTime(schedule.startTimeslot?.start) }}</strong>
              <span>{{ formatTime(schedule.endTimeslot?.end) }}</span>
            </div>
            <span class="timeline-dot" :class="scheduleStatus(schedule)"></span>
            <div class="schedule-detail">
              <div class="schedule-title-row">
                <h3>{{ schedule.Subject?.subject_name || "Mata pelajaran" }}</h3>
                <span class="schedule-badge" :class="scheduleStatus(schedule)">
                  {{ scheduleStatusLabel(schedule) }}
                </span>
              </div>
              <p>
                <i class="bi bi-people"></i> {{ schedule.Class?.class_name || "Kelas belum diatur" }}
                <span v-if="schedule.Classroom?.classroom_name"> · {{ schedule.Classroom.classroom_name }}</span>
              </p>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <i class="bi bi-calendar2-check"></i>
          <span>Tidak ada jadwal mengajar untuk hari ini.</span>
        </div>
      </section>

      <section class="content-card activity-card">
        <header class="section-heading">
          <div>
            <span class="section-kicker">AGENDA GURU</span>
            <h2>Kegiatan Mendatang</h2>
          </div>
          <RouterLink to="/guru/kegiatan" class="section-link">Buka kegiatan <i class="bi bi-arrow-right"></i></RouterLink>
        </header>

        <p v-if="activityError" class="error-state" role="alert">
          <i class="bi bi-exclamation-circle"></i> {{ activityError }}
        </p>
        <div v-else-if="activityLoading" class="empty-state">
          <span class="spinner-border spinner-border-sm text-success" role="status"></span>
          Memuat kegiatan...
        </div>
        <div v-else-if="upcomingActivities.length" class="activity-list">
          <article v-for="session in upcomingActivities" :key="session.id" class="activity-item">
            <div class="activity-date">
              <strong>{{ activityDay(session.date) }}</strong>
              <span>{{ activityMonth(session.date) }}</span>
            </div>
            <div class="activity-detail">
              <h3>{{ session.Activity?.name || "Kegiatan sekolah" }}</h3>
              <p><i class="bi bi-clock"></i> {{ activityTime(session) }}</p>
              <span class="activity-status" :class="{ attended: session.attendance }">
                <i class="bi" :class="session.attendance ? 'bi-check-circle' : 'bi-hourglass-split'"></i>
                {{ session.attendance ? "Sudah presensi" : "Belum presensi" }}
              </span>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <i class="bi bi-clipboard2-check"></i>
          <span>Tidak ada kegiatan mendatang.</span>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  getTeacherActivitySessions,
  getTeacherSchedules,
} from "@/services/api";

const userName = ref("Guru");
const schedules = ref([]);
const sessions = ref([]);
const scheduleLoading = ref(true);
const activityLoading = ref(true);
const scheduleError = ref("");
const activityError = ref("");
const now = ref(new Date());
let clockInterval;

const todayDate = computed(() => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(now.value));
const todayName = computed(() => new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  timeZone: "Asia/Jakarta",
}).format(now.value));
const todayLabel = computed(() => new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
}).format(now.value));
const currentTime = computed(() => new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
}).format(now.value));
const todaySchedules = computed(() => schedules.value
  .filter((schedule) => schedule.day === todayName.value)
  .sort((left, right) => parseTime(left.startTimeslot?.start) - parseTime(right.startTimeslot?.start)));
const activeSchedule = computed(() => todaySchedules.value.find((schedule) => scheduleStatus(schedule) === "ongoing"));
const nextSchedule = computed(() => todaySchedules.value.find((schedule) => scheduleStatus(schedule) === "upcoming"));
const classCount = computed(() => new Set(schedules.value.map((schedule) => schedule.class_id)).size);
const upcomingActivities = computed(() => sessions.value
  .filter((session) => normalizeDate(session.date) >= todayDate.value)
  .sort((left, right) => {
    const dateDifference = normalizeDate(left.date).localeCompare(normalizeDate(right.date));
    if (dateDifference !== 0) return dateDifference;
    return parseTime(left.start_time) - parseTime(right.start_time);
  })
  .slice(0, 4));
const pendingActivities = computed(() => sessions.value.filter(
  (session) => normalizeDate(session.date) >= todayDate.value && !session.attendance,
).length);

function normalizeDate(value) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

function parseTime(value) {
  if (!value) return Number.POSITIVE_INFINITY;
  const [hours, minutes] = value.split(":").map(Number);
  return Number.isFinite(hours) && Number.isFinite(minutes)
    ? hours * 60 + minutes
    : Number.POSITIVE_INFINITY;
}

function currentMinutesWib() {
  const value = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(now.value);
  return parseTime(value);
}

function scheduleStatus(schedule) {
  const nowMinutes = currentMinutesWib();
  const start = parseTime(schedule.startTimeslot?.start);
  const end = parseTime(schedule.endTimeslot?.end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "upcoming";
  if (start <= nowMinutes && nowMinutes < end) return "ongoing";
  if (nowMinutes < start) return "upcoming";
  return "finished";
}

function scheduleStatusLabel(schedule) {
  return {
    ongoing: "Berlangsung",
    upcoming: "Akan datang",
    finished: "Selesai",
  }[scheduleStatus(schedule)];
}

function formatTime(value) {
  return value ? value.slice(0, 5) : "--:--";
}

function activityDay(value) {
  const date = normalizeDate(value);
  return date ? new Date(`${date}T00:00:00Z`).getUTCDate() : "--";
}

function activityMonth(value) {
  const date = normalizeDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function activityTime(session) {
  if (session.start_time && session.end_time) {
    return `${formatTime(session.start_time)}–${formatTime(session.end_time)}`;
  }
  return session.session ? `Sesi ${session.session}` : "Waktu belum ditentukan";
}

async function loadSchedules() {
  scheduleLoading.value = true;
  scheduleError.value = "";
  try {
    const result = await getTeacherSchedules();
    if (!Array.isArray(result)) {
      throw new Error("Format data jadwal tidak sesuai.");
    }
    schedules.value = result;
  } catch (error) {
    console.error("Gagal memuat jadwal dashboard guru:", error);
    scheduleError.value = `Jadwal gagal dimuat: ${error.message}`;
  } finally {
    scheduleLoading.value = false;
  }
}

async function loadActivities() {
  activityLoading.value = true;
  activityError.value = "";
  try {
    const result = await getTeacherActivitySessions();
    if (!Array.isArray(result)) {
      throw new Error("Format data kegiatan tidak sesuai.");
    }
    sessions.value = result;
  } catch (error) {
    console.error("Gagal memuat kegiatan dashboard guru:", error);
    activityError.value = `Kegiatan gagal dimuat: ${error.message}`;
  } finally {
    activityLoading.value = false;
  }
}

function loadUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    userName.value = user.name || user.username || "Guru";
  } catch (error) {
    console.error("Gagal memuat data pengguna dashboard:", error);
  }
}

onMounted(() => {
  loadUser();
  loadSchedules();
  loadActivities();
  clockInterval = window.setInterval(() => {
    now.value = new Date();
  }, 30000);
});

onUnmounted(() => window.clearInterval(clockInterval));
</script>

<style scoped>
.teacher-dashboard {
  display: grid;
  gap: 20px;
  color: #f8fafc;
  animation: fade-in 0.25s ease;
}

.hero-card {
  position: relative;
  overflow: hidden;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.18), #111c31 75%);
}

.hero-glow {
  position: absolute;
  inset: 0 0 auto auto;
  width: 42%;
  height: 100%;
  background: radial-gradient(circle at 70% 20%, rgba(34, 197, 94, 0.24), transparent 68%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero-badge,
.section-kicker {
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.hero-badge {
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.14);
}

.hero-card h1 {
  margin: 18px 0 8px;
  color: #f8fafc;
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  font-weight: 700;
}

.hero-card p {
  max-width: 600px;
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.primary-button {
  background: #16a34a;
  color: #fff;
}

.primary-button:hover {
  background: #15803d;
  color: #fff;
}

.secondary-button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.07);
  color: #e2e8f0;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.today-banner {
  display: grid;
  grid-template-columns: minmax(180px, 0.8fr) minmax(0, 1.5fr) 40px;
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
  border: 1px solid rgba(74, 222, 128, 0.18);
  border-radius: 18px;
  background: linear-gradient(110deg, rgba(34, 197, 94, 0.1), rgba(255, 255, 255, 0.025));
}

.today-date {
  display: flex;
  align-items: center;
  gap: 12px;
}

.today-date strong,
.today-date span:not(.live-dot),
.today-focus strong,
.today-focus > span {
  display: block;
}

.today-date strong,
.today-focus strong {
  color: #f8fafc;
  font-size: 0.95rem;
}

.today-date div > span,
.today-focus > span:last-child {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.78rem;
}

.live-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 5px rgba(74, 222, 128, 0.12);
}

.focus-label {
  margin-bottom: 4px;
  color: #4ade80;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.09em;
}

.today-link {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  color: #e2e8f0;
  text-decoration: none;
}

.today-link:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-card,
.content-card {
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.035);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px;
}

.stat-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 13px;
  font-size: 1.1rem;
}

.stat-icon.blue { background: rgba(59, 130, 246, 0.14); color: #60a5fa; }
.stat-icon.green { background: rgba(34, 197, 94, 0.14); color: #4ade80; }
.stat-icon.orange { background: rgba(251, 146, 60, 0.14); color: #fdba74; }
.stat-icon.purple { background: rgba(168, 85, 247, 0.14); color: #c084fc; }

.stat-card strong,
.stat-card span:not(.stat-icon) {
  display: block;
}

.stat-card strong {
  color: #f8fafc;
  font-size: 1.4rem;
  line-height: 1.2;
}

.stat-card div > span {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.75rem;
}

.dashboard-columns {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  align-items: start;
  gap: 18px;
}

.content-card {
  min-width: 0;
  padding: 20px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 4px 0 0;
  color: #f8fafc;
  font-size: 1.05rem;
  font-weight: 700;
}

.section-link {
  flex: 0 0 auto;
  color: #4ade80;
  font-size: 0.75rem;
  text-decoration: none;
}

.section-link:hover { color: #86efac; }

.schedule-list,
.activity-list {
  display: grid;
}

.schedule-item {
  position: relative;
  display: grid;
  grid-template-columns: 58px 12px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.time-column strong,
.time-column span {
  display: block;
  font-size: 0.75rem;
}

.time-column strong { color: #e2e8f0; }
.time-column span { margin-top: 4px; color: #64748b; }

.timeline-dot {
  width: 9px;
  height: 9px;
  margin-top: 4px;
  border: 2px solid #64748b;
  border-radius: 50%;
}

.timeline-dot.ongoing { border-color: #4ade80; background: #4ade80; box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.12); }
.timeline-dot.upcoming { border-color: #60a5fa; }
.timeline-dot.finished { border-color: #64748b; }

.schedule-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
}

.schedule-detail h3,
.activity-detail h3 {
  margin: 0;
  color: #f1f5f9;
  font-size: 0.83rem;
  font-weight: 650;
}

.schedule-detail p,
.activity-detail p {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 0.73rem;
}

.schedule-badge,
.activity-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
}

.schedule-badge.ongoing { background: rgba(34, 197, 94, 0.14); color: #4ade80; }
.schedule-badge.upcoming { background: rgba(59, 130, 246, 0.14); color: #93c5fd; }
.schedule-badge.finished { background: rgba(148, 163, 184, 0.12); color: #94a3b8; }

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.activity-date {
  display: flex;
  width: 46px;
  height: 50px;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.12);
}

.activity-date strong { color: #bfdbfe; font-size: 1rem; line-height: 1.1; }
.activity-date span { color: #93c5fd; font-size: 0.65rem; }
.activity-detail { min-width: 0; }
.activity-detail h3 { overflow-wrap: anywhere; }
.activity-status { margin-top: 8px; background: rgba(251, 146, 60, 0.12); color: #fdba74; }
.activity-status.attended { background: rgba(34, 197, 94, 0.12); color: #4ade80; }

.empty-state {
  display: flex;
  min-height: 100px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #94a3b8;
  font-size: 0.82rem;
  text-align: center;
}

.empty-state > i { color: #64748b; font-size: 1.1rem; }

.error-state {
  padding: 12px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.08);
  color: #fca5a5;
  font-size: 0.8rem;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashboard-columns { grid-template-columns: 1fr; }
}

@media (max-width: 767px) {
  .hero-card { padding: 20px; }
  .hero-content { align-items: flex-start; flex-direction: column; }
  .today-banner { grid-template-columns: minmax(0, 1fr) 38px; gap: 14px; }
  .today-date { grid-column: 1 / -1; }
  .today-focus { grid-column: 1; }
  .today-link { grid-column: 2; grid-row: 2; }
  .stats-grid { gap: 10px; }
  .stat-card { gap: 9px; padding: 13px 10px; }
  .stat-icon { width: 36px; height: 36px; font-size: 0.95rem; }
  .stat-card strong { font-size: 1.2rem; }
  .stat-card div > span { font-size: 0.68rem; }
  .content-card { padding: 16px; }
  .section-heading { align-items: flex-start; }
}
</style>
