<template>
  <div class="row d-md-none">
    <HeadmasterNavbar />
  </div>

  <main class="headmaster-dashboard text-start">
    <section class="welcome-panel">
      <div class="welcome-copy">
        <span class="eyebrow"><span class="live-dot"></span> Ringkasan sekolah</span>
        <h1>{{ greeting }}, {{ headmasterName }}</h1>
        <p>
          Pantau kegiatan belajar mengajar yang sedang berlangsung dan lihat
          ringkasan data guru dari satu tempat.
        </p>
        <div class="welcome-meta">
          <span><i class="bi bi-calendar3"></i>{{ dateLabel }}</span>
          <span><i class="bi bi-clock"></i>{{ timeLabel }} WIB</span>
        </div>
      </div>
      <RouterLink class="welcome-action" to="/kepala-sekolah/kbm/realtime">
        Pantau KBM
        <i class="bi bi-arrow-up-right"></i>
      </RouterLink>
      <div class="welcome-decoration" aria-hidden="true">
        <i class="bi bi-easel2"></i>
      </div>
    </section>

    <section class="metrics-grid" aria-label="Ringkasan data">
      <article class="metric-card">
        <div class="metric-top">
          <span class="metric-icon blue"><i class="bi bi-people-fill"></i></span>
          <span class="metric-caption ms-3">Data guru</span>
        </div>
        <strong class="metric-value">
          <span v-if="teachersLoading" class="metric-loading" aria-label="Memuat">…</span>
          <span v-else-if="hasTeacherData">{{ teachers.length }}</span>
          <span v-else>—</span>
        </strong>
        <span class="metric-label">Guru terdaftar</span>
        <span v-if="hasTeacherData" class="metric-footnote">
          {{ activeTeacherCount }} berstatus aktif
        </span>
        <span v-else-if="teachersError" class="metric-footnote error-text">Data tidak tersedia</span>
        <span v-else class="metric-footnote">Mengambil data guru…</span>
      </article>

      <article class="metric-card">
        <div class="metric-top">
          <span class="metric-icon violet"><i class="bi bi-easel"></i></span>
          <span class="metric-caption ms-3">Saat ini</span>
        </div>
        <strong class="metric-value">
          <span v-if="monitoringLoading && !hasMonitoringData" class="metric-loading" aria-label="Memuat">…</span>
          <span v-else-if="hasMonitoringData">{{ monitoringTotal }}</span>
          <span v-else>—</span>
        </strong>
        <span class="metric-label">Jadwal KBM berlangsung</span>
        <span class="metric-footnote">Berdasarkan waktu aplikasi</span>
      </article>

      <article class="metric-card">
        <div class="metric-top">
          <span class="metric-icon green"><i class="bi bi-check2-circle"></i></span>
          <span class="metric-caption ms-3">Kehadiran</span>
        </div>
        <strong class="metric-value">
          <span v-if="monitoringLoading && !hasMonitoringData" class="metric-loading" aria-label="Memuat">…</span>
          <span v-else-if="hasMonitoringData">{{ validatedCount }}</span>
          <span v-else>—</span>
        </strong>
        <span class="metric-label">Jadwal tervalidasi</span>
        <span class="metric-footnote">Presensi kelas telah tercatat</span>
      </article>

      <article class="metric-card">
        <div class="metric-top">
          <span class="metric-icon orange"><i class="bi bi-exclamation-circle"></i></span>
          <span class="metric-caption ms-3">Perlu ditinjau</span>
        </div>
        <strong class="metric-value">
          <span v-if="monitoringLoading && !hasMonitoringData" class="metric-loading" aria-label="Memuat">…</span>
          <span v-else-if="hasMonitoringData">{{ attentionCount }}</span>
          <span v-else>—</span>
        </strong>
        <span class="metric-label">Jadwal belum tuntas</span>
        <span class="metric-footnote">Belum divalidasi atau kelas kosong</span>
      </article>
    </section>

    <section class="content-grid">
      <article class="monitoring-panel">
        <header class="panel-header">
          <div>
            <span class="section-kicker">PEMANTAUAN HARI INI</span>
            <h2>KBM yang sedang berlangsung</h2>
            <p>Status kelas yang berjalan berdasarkan jadwal dan pencatatan kehadiran.</p>
          </div>
          <div class="panel-actions">
            <span v-if="lastUpdated" class="updated-label">
              <i class="bi bi-arrow-repeat"></i> Diperbarui {{ lastUpdated }}
            </span>
            <button
              class="refresh-button"
              type="button"
              :disabled="isRefreshing"
              :aria-busy="isRefreshing"
              @click="loadDashboard"
            >
              <i class="bi" :class="isRefreshing ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'"></i>
              <span>{{ isRefreshing ? "Memuat" : "Perbarui" }}</span>
            </button>
          </div>
        </header>

        <div v-if="teachersError || monitoringError" class="data-alert" role="alert">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            <strong>Beberapa data belum dapat dimuat.</strong>
            <span v-if="teachersError">{{ teachersError }}</span>
            <span v-if="monitoringError">{{ monitoringError }}</span>
          </div>
        </div>

        <div v-if="monitoringLoading && !hasMonitoringData" class="empty-state">
          <span class="spinner-border spinner-border-sm" role="status"></span>
          Memuat status KBM…
        </div>
        <div v-else-if="monitoringError && !hasMonitoringData" class="empty-state">
          <i class="bi bi-cloud-slash"></i>
          <span>Status KBM belum tersedia. Coba perbarui data.</span>
        </div>
        <div v-else-if="monitoringTotal === 0" class="empty-state">
          <span class="empty-icon"><i class="bi bi-calendar2-check"></i></span>
          <strong>Tidak ada jadwal yang sedang berlangsung</strong>
          <span>Jadwal akan muncul di sini saat waktu KBM dimulai.</span>
        </div>
        <div v-else-if="attentionClasses.length === 0" class="all-clear-state">
          <span class="empty-icon"><i class="bi bi-check2-circle"></i></span>
          <div>
            <strong>Semua jadwal yang berjalan sudah tervalidasi</strong>
            <span>{{ validatedCount }} dari {{ monitoringTotal }} jadwal telah tercatat.</span>
          </div>
        </div>
        <div v-else class="class-list">
          <article
            v-for="item in attentionClasses"
            :key="item.schedule_id"
            class="class-row"
          >
            <span class="class-status-icon" :class="item.status === 'Kelas Kosong' ? 'is-empty' : 'is-pending'">
              <i class="bi" :class="item.status === 'Kelas Kosong' ? 'bi-door-closed' : 'bi-hourglass-split'"></i>
            </span>
            <div class="class-details">
              <strong>{{ item.class_name || "Kelas" }}</strong>
              <span>{{ item.subject_name || "Mata pelajaran" }} · {{ item.teacher_name || "Guru" }}</span>
            </div>
            <span class="class-time">{{ formatTime(item.start) }}–{{ formatTime(item.end) }}</span>
            <span class="status-pill" :class="item.status === 'Kelas Kosong' ? 'pill-empty' : 'pill-pending'">
              {{ item.status || "Belum divalidasi" }}
            </span>
          </article>
          <p v-if="attentionCount > attentionClasses.length" class="more-items">
            {{ attentionCount - attentionClasses.length }} jadwal lainnya perlu ditinjau.
          </p>
        </div>

        <RouterLink class="panel-link" to="/kepala-sekolah/kbm/realtime">
          Buka pemantauan KBM
          <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </article>

      <aside class="quick-panel">
        <span class="section-kicker">AKSES CEPAT</span>
        <h2>Menu kepala sekolah</h2>
        <p class="quick-intro">Pilih tampilan sesuai informasi yang ingin ditinjau.</p>

        <RouterLink class="quick-link" to="/kepala-sekolah/kbm/realtime">
          <span class="quick-icon blue"><i class="bi bi-activity"></i></span>
          <span><strong>KBM realtime</strong><small>Pantau kelas yang sedang berjalan</small></span>
          <i class="bi bi-chevron-right"></i>
        </RouterLink>
        <RouterLink class="quick-link" to="/kepala-sekolah/kbm/riwayat">
          <span class="quick-icon violet"><i class="bi bi-clock-history"></i></span>
          <span><strong>Riwayat keterisian kelas</strong><small>Tinjau data KBM pada periode tertentu</small></span>
          <i class="bi bi-chevron-right"></i>
        </RouterLink>
        <RouterLink class="quick-link" to="/kepala-sekolah/aktivitas-piket">
          <span class="quick-icon green"><i class="bi bi-calendar2-check"></i></span>
          <span><strong>Kehadiran kegiatan & piket</strong><small>Lihat rekap presensi guru dan laporan</small></span>
          <i class="bi bi-chevron-right"></i>
        </RouterLink>

        <div class="info-note">
          <i class="bi bi-info-circle"></i>
          <span>Rekap kehadiran kegiatan dan piket guru tersedia pada menu khusus.</span>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import HeadmasterNavbar from "@/components/headmaster/HeadmasterNavbar.vue";
import { getClasses, getTeachers } from "@/services/api.js";
import { applicationClock } from "@/services/applicationClock";

const headmasterName = ref("Kepala Sekolah");
const currentTime = ref(applicationClock.currentTime);
const teachers = ref([]);
const hasTeacherData = ref(false);
const teachersLoading = ref(true);
const teachersError = ref("");
const monitoringItems = ref([]);
const monitoringTotal = ref(0);
const hasMonitoringData = ref(false);
const monitoringLoading = ref(true);
const monitoringError = ref("");
const isRefreshing = ref(false);
const lastUpdated = ref("");

let clockInterval = null;
let monitoringInterval = null;

const greeting = computed(() => {
  const hour = currentTime.value.getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
});

const dateLabel = computed(() =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(currentTime.value),
);

const timeLabel = computed(() =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(currentTime.value),
);

const activeTeacherCount = computed(
  () => teachers.value.filter((teacher) => teacher.status === "active").length,
);

const validatedCount = computed(
  () => monitoringItems.value.filter((item) => item.validated === true).length,
);

const attentionClasses = computed(() =>
  monitoringItems.value
    .filter((item) => !item.validated || item.status === "Kelas Kosong")
    .slice(0, 4),
);

const attentionCount = computed(
  () =>
    monitoringItems.value.filter(
      (item) => !item.validated || item.status === "Kelas Kosong",
    ).length,
);

function loadHeadmasterName() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    headmasterName.value = user.name || "Kepala Sekolah";
  } catch (error) {
    console.error("Gagal memuat data kepala sekolah:", error);
    headmasterName.value = "Kepala Sekolah";
  }
}

async function loadTeachers() {
  teachersLoading.value = true;
  teachersError.value = "";

  try {
    const result = await getTeachers();
    if (!result?.success) {
      throw new Error(result?.message || "Data guru gagal dimuat.");
    }
    if (!Array.isArray(result.data)) {
      throw new Error("Format data guru tidak sesuai.");
    }
    teachers.value = result.data;
    hasTeacherData.value = true;
  } catch (error) {
    console.error("Gagal memuat data guru:", error);
    teachersError.value = `Data guru: ${error.message}`;
    hasTeacherData.value = false;
  } finally {
    teachersLoading.value = false;
  }
}

function formatUpdatedAt(date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

async function loadMonitoring() {
  if (monitoringLoading.value && hasMonitoringData.value) return;
  monitoringLoading.value = true;
  monitoringError.value = "";

  try {
    const result = await getClasses();
    if (!Array.isArray(result?.data) || !Number.isFinite(Number(result?.total))) {
      throw new Error("Format data monitoring KBM tidak sesuai.");
    }
    monitoringItems.value = result.data;
    monitoringTotal.value = Number(result.total);
    hasMonitoringData.value = true;
    lastUpdated.value = formatUpdatedAt(applicationClock.currentTime);
  } catch (error) {
    console.error("Gagal memuat status KBM:", error);
    monitoringError.value = `Status KBM: ${error.message}`;
    hasMonitoringData.value = false;
  } finally {
    monitoringLoading.value = false;
  }
}

async function loadDashboard() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await Promise.all([loadTeachers(), loadMonitoring()]);
  isRefreshing.value = false;
}

function formatTime(value) {
  return value ? String(value).slice(0, 5) : "--:--";
}

onMounted(() => {
  loadHeadmasterName();
  currentTime.value = applicationClock.currentTime;
  loadDashboard();
  clockInterval = window.setInterval(() => {
    currentTime.value = applicationClock.currentTime;
  }, 1000);
  monitoringInterval = window.setInterval(loadMonitoring, 30000);
});

onBeforeUnmount(() => {
  if (clockInterval) window.clearInterval(clockInterval);
  if (monitoringInterval) window.clearInterval(monitoringInterval);
});
</script>

<style scoped>
.headmaster-dashboard {
  --ink: #f1f5f9;
  --muted: #94a3b8;
  --line: rgba(255, 255, 255, 0.06);
  display: grid;
  gap: 1.25rem;
  padding: 0.25rem 0 1.5rem;
  color: var(--ink);
  animation: rise-in 0.3s ease both;
}

.welcome-panel {
  position: relative;
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  overflow: hidden;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background:
    radial-gradient(circle at 82% 10%, rgba(59, 130, 246, 0.28), transparent 28%),
    linear-gradient(120deg, #0d1b32, #17365b 68%, #1c4770);
  color: #fff;
}

.welcome-copy {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

.eyebrow,
.welcome-meta,
.welcome-meta span {
  display: flex;
  align-items: center;
}

.eyebrow {
  gap: 0.55rem;
  color: #a9c5e8;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #54d6a0;
  box-shadow: 0 0 0 4px rgba(84, 214, 160, 0.14);
}

.welcome-panel h1 {
  margin: 0.85rem 0 0.55rem;
  font-size: clamp(1.65rem, 3.2vw, 2.4rem);
  font-weight: 750;
  letter-spacing: -0.035em;
}

.welcome-panel p {
  max-width: 580px;
  margin: 0;
  color: #c4d2e3;
  line-height: 1.65;
}

.welcome-meta {
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin-top: 1.2rem;
  color: #d7e3f0;
  font-size: 0.85rem;
}

.welcome-meta span {
  gap: 0.45rem;
}

.welcome-meta i {
  color: #71d5ae;
}

.welcome-action {
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.85rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
}

.welcome-action:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.welcome-decoration {
  position: absolute;
  right: 12%;
  bottom: -3.5rem;
  color: rgba(255, 255, 255, 0.055);
  font-size: 15rem;
  line-height: 1;
  transform: rotate(-12deg);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.metric-card,
.monitoring-panel,
.quick-panel {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.metric-card {
  min-height: 178px;
  padding: 1.2rem;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.05);
}

.metric-top {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
}

.metric-icon,
.quick-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 13px;
}

.metric-icon {
  width: 42px;
  height: 42px;
  font-size: 1.1rem;
}

.metric-icon.blue,
.quick-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.metric-icon.violet,
.quick-icon.violet {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.metric-icon.green,
.quick-icon.green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.metric-icon.orange {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.metric-caption {
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.metric-value {
  display: block;
  margin-top: 1rem;
  color: #f8fafc;
  font-size: 2rem;
  line-height: 1;
}

.metric-loading {
  color: #94a3b8;
}

.metric-label {
  display: block;
  margin-top: 0.45rem;
  color: #e2e8f0;
  font-size: 0.92rem;
  font-weight: 700;
}

.metric-footnote {
  display: block;
  margin-top: 0.35rem;
  color: var(--muted);
  font-size: 0.78rem;
}

.error-text {
  color: #fca5a5;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(290px, 0.9fr);
  align-items: stretch;
  gap: 1rem;
}

.monitoring-panel,
.quick-panel {
  padding: clamp(1.15rem, 2.3vw, 1.65rem);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-kicker {
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.panel-header h2,
.quick-panel h2 {
  margin: 0.35rem 0;
  color: #f8fafc;
  font-size: 1.2rem;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.panel-header p,
.quick-intro {
  margin: 0;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.5;
}

.panel-actions {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
}

.updated-label {
  color: #8390a3;
  font-size: 0.72rem;
  white-space: nowrap;
}

.updated-label i {
  margin-right: 0.25rem;
}

.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 700;
}

.refresh-button:hover:not(:disabled) {
  border-color: rgba(74, 222, 128, 0.25);
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.spin {
  animation: spin 0.9s linear infinite;
}

.data-alert {
  display: flex;
  gap: 0.7rem;
  margin: 0.75rem 0 1rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.08);
  color: #fbbf24;
  font-size: 0.8rem;
}

.data-alert > i {
  margin-top: 0.1rem;
}

.data-alert div,
.data-alert span {
  display: block;
}

.data-alert span {
  margin-top: 0.2rem;
}

.empty-state,
.all-clear-state {
  display: flex;
  min-height: 190px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  color: var(--muted);
  text-align: center;
}

.empty-state > i {
  font-size: 1.5rem;
}

.empty-state strong,
.all-clear-state strong {
  color: #e2e8f0;
  font-size: 0.9rem;
}

.empty-state span,
.all-clear-state span {
  font-size: 0.8rem;
}

.empty-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  font-size: 1.2rem;
}

.all-clear-state {
  flex-direction: row;
  text-align: left;
}

.all-clear-state > div {
  display: grid;
  gap: 0.25rem;
}

.class-list {
  display: grid;
}

.class-row {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.class-row:last-child {
  border-bottom: 0;
}

.class-status-icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 11px;
}

.class-status-icon.is-empty {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.class-status-icon.is-pending {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.class-details {
  display: grid;
  min-width: 0;
  gap: 0.22rem;
}

.class-details strong {
  overflow: hidden;
  color: #f1f5f9;
  font-size: 0.87rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.class-details span {
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.77rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.class-time {
  color: #cbd5e1;
  font-size: 0.75rem;
  white-space: nowrap;
}

.status-pill {
  justify-self: end;
  padding: 0.34rem 0.55rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

.pill-empty {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.pill-pending {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
}

.more-items {
  margin: 0.35rem 0 0;
  color: #94a3b8;
  font-size: 0.76rem;
}

.panel-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #86efac;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
}

.panel-link:hover {
  color: #4ade80;
}

.quick-panel h2 {
  margin-top: 0.4rem;
}

.quick-intro {
  margin-bottom: 1rem;
}

.quick-link {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: inherit;
  text-decoration: none;
}

.quick-link:hover strong,
.quick-link:hover > i {
  color: #86efac;
}

.quick-icon {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

.quick-link > span:nth-child(2) {
  display: grid;
  gap: 0.2rem;
}

.quick-link strong {
  color: #e2e8f0;
  font-size: 0.83rem;
}

.quick-link small {
  color: #94a3b8;
  font-size: 0.72rem;
  line-height: 1.4;
}

.quick-link > i {
  color: #64748b;
  font-size: 0.75rem;
}

.info-note {
  display: flex;
  gap: 0.55rem;
  margin-top: 0.8rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  font-size: 0.73rem;
  line-height: 1.5;
}

.info-note i {
  flex: 0 0 auto;
  color: #60a5fa;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 700px) {
  .headmaster-dashboard {
    gap: 0.9rem;
  }

  .welcome-panel {
    min-height: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    border-radius: 20px;
  }

  .welcome-panel h1 {
    font-size: 1.6rem;
  }

  .welcome-action {
    width: 100%;
    justify-content: space-between;
  }

  .welcome-decoration {
    right: -0.6rem;
    bottom: 3rem;
    font-size: 8rem;
  }

  .metrics-grid {
    gap: 0.7rem;
  }

  .metric-card {
    min-height: 160px;
    padding: 0.95rem;
    border-radius: 16px;
  }

  .metric-caption {
    font-size: 0.62rem;
  }

  .metric-value {
    font-size: 1.75rem;
  }

  .metric-label {
    font-size: 0.82rem;
  }

  .metric-footnote {
    font-size: 0.7rem;
  }

  .panel-header {
    flex-direction: column;
  }

  .panel-actions {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .class-row {
    grid-template-columns: 34px minmax(0, 1fr) auto;
    gap: 0.55rem;
  }

  .class-time {
    grid-column: 2;
    grid-row: 2;
  }

  .status-pill {
    grid-column: 3;
    grid-row: 1 / span 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .headmaster-dashboard {
    animation: none;
  }

  .spin {
    animation-duration: 2s;
  }
}
</style>
