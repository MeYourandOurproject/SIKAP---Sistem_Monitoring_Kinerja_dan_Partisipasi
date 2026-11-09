<template>
  <section class="activity-attendance-page text-start">
    <header class="page-heading">
      <div>
        <span class="section-kicker">PARTISIPASI GURU</span>
        <h1>Kehadiran Kegiatan & Piket</h1>
        <p>Pantau rekap kehadiran guru pada kegiatan sekolah dan tugas rutin.</p>
      </div>
      <span class="view-only-badge">
        <i class="bi bi-eye" aria-hidden="true"></i>
        Tampilan rekap
      </span>
    </header>

    <nav class="view-tabs" aria-label="Tampilan kehadiran kegiatan">
      <button
        type="button"
        :class="{ active: activeTab === 'realtime' }"
        :aria-pressed="activeTab === 'realtime'"
        @click="activeTab = 'realtime'"
      >
        <i class="bi bi-activity" aria-hidden="true"></i>
        Realtime
      </button>
      <button
        type="button"
        :class="{ active: activeTab === 'report' }"
        :aria-pressed="activeTab === 'report'"
        @click="activeTab = 'report'"
      >
        <i class="bi bi-file-earmark-bar-graph" aria-hidden="true"></i>
        Rangkuman laporan
      </button>
    </nav>

    <section v-if="activeTab === 'realtime'" class="tab-content">
      <header class="panel-heading">
        <div>
          <h2>Sesi kehadiran hari ini</h2>
          <p>{{ todayLabel }} · Rekap diperbarui otomatis setiap 30 detik.</p>
        </div>
        <button
          class="refresh-button"
          type="button"
          :disabled="realtimeLoading"
          :aria-busy="realtimeLoading"
          @click="loadRealtime"
        >
          <i
            class="bi"
            :class="realtimeLoading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'"
            aria-hidden="true"
          ></i>
          {{ realtimeLoading ? "Memuat" : "Perbarui" }}
        </button>
      </header>

      <div v-if="realtimeError" class="data-alert" role="alert">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        <span>{{ realtimeError }}</span>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span class="summary-icon blue"><i class="bi bi-calendar-event"></i></span>
          <span class="summary-label">Sesi hari ini</span>
          <strong>{{ realtimeLoading && !hasRealtimeData ? "…" : activeSessions.length }}</strong>
          <small>Kegiatan dan tugas rutin</small>
        </article>
        <article class="summary-card">
          <span class="summary-icon green"><i class="bi bi-person-check"></i></span>
          <span class="summary-label">Presensi tercatat</span>
          <strong>{{ realtimeLoading && !hasRealtimeData ? "…" : recordedCount }}</strong>
          <small>Dari {{ expectedCount }} guru yang ditugaskan</small>
        </article>
        <article class="summary-card">
          <span class="summary-icon orange"><i class="bi bi-hourglass-split"></i></span>
          <span class="summary-label">Belum tercatat</span>
          <strong>{{ realtimeLoading && !hasRealtimeData ? "…" : pendingCount }}</strong>
          <small>Guru yang belum mengisi presensi</small>
        </article>
        <article class="summary-card">
          <span class="summary-icon violet"><i class="bi bi-speedometer2"></i></span>
          <span class="summary-label">Kelengkapan presensi</span>
          <strong>{{ realtimeLoading && !hasRealtimeData ? "…" : `${completionRate}%` }}</strong>
          <small>Presensi tercatat dibanding yang diharapkan</small>
        </article>
      </div>

      <section class="sessions-panel">
        <div class="panel-heading list-heading">
          <div>
            <h2>Rekap per sesi</h2>
            <p>Hanya menampilkan jumlah presensi, tanpa mengubah data guru.</p>
          </div>
          <span class="session-count">{{ activeSessions.length }} sesi</span>
        </div>

        <div v-if="realtimeLoading && !hasRealtimeData" class="empty-state">
          <span class="spinner-border spinner-border-sm" role="status"></span>
          Memuat rekap sesi...
        </div>
        <div v-else-if="!realtimeError && !activeSessions.length" class="empty-state">
          <span class="empty-icon"><i class="bi bi-calendar2-check"></i></span>
          <strong>Belum ada sesi kehadiran hari ini</strong>
          <span>Sesi yang dibuka untuk kegiatan atau tugas rutin akan muncul di sini.</span>
        </div>
        <div v-else-if="activeSessions.length" class="session-list">
          <article v-for="session in activeSessions" :key="session.id" class="session-row">
            <span class="session-icon" :class="session.activity_type === 'routine' ? 'routine' : 'event'">
              <i
                class="bi"
                :class="session.activity_type === 'routine' ? 'bi-arrow-repeat' : 'bi-calendar-event'"
                aria-hidden="true"
              ></i>
            </span>
            <div class="session-info">
              <strong>{{ session.activity_name || "Kegiatan sekolah" }}</strong>
              <span>
                {{ activityTypeLabel(session.activity_type) }}
                · {{ sessionLabel(session.session) }}
                · {{ targetLabel(session.target_type) }}
              </span>
            </div>
            <div class="session-progress">
              <div class="progress-label">
                <span>{{ session.attendance_count }} / {{ session.total_teachers }} presensi</span>
                <strong>{{ sessionProgress(session) }}%</strong>
              </div>
              <div
                class="progress-track"
                role="progressbar"
                :aria-valuenow="sessionProgress(session)"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`Kelengkapan presensi ${session.activity_name || 'kegiatan'}`"
              >
                <span :style="{ width: `${sessionProgress(session)}%` }"></span>
              </div>
            </div>
            <span class="status-chip" :class="session.attendance_complete ? 'complete' : 'pending'">
              {{ session.attendance_complete ? "Lengkap" : "Belum lengkap" }}
            </span>
          </article>
        </div>
      </section>
    </section>

    <section v-else class="tab-content">
      <header class="panel-heading report-heading">
        <div>
          <h2>Rangkuman kehadiran guru</h2>
          <p>Rekap berdasarkan status presensi, jenis tugas, dan kegiatan sekolah.</p>
        </div>
        <button
          class="refresh-button"
          type="button"
          :disabled="reportLoading || exporting"
          @click="loadReport"
        >
          <i
            class="bi"
            :class="reportLoading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'"
            aria-hidden="true"
          ></i>
          {{ reportLoading ? "Memuat" : "Perbarui" }}
        </button>
      </header>

      <form class="filter-panel" @submit.prevent="loadReport">
        <label>
          <span>Tanggal mulai</span>
          <input v-model="reportFilters.start_date" type="date" :max="todayDate" required />
        </label>
        <label>
          <span>Tanggal selesai</span>
          <input v-model="reportFilters.end_date" type="date" :max="todayDate" required />
        </label>
        <label>
          <span>Jenis tugas</span>
          <select v-model="reportFilters.activity_type">
            <option value="">Semua tugas dan kegiatan</option>
            <option value="routine">Tugas rutin / piket</option>
            <option value="tentative">Kegiatan sekolah</option>
          </select>
        </label>
        <div class="filter-actions">
          <button class="primary-button" type="submit" :disabled="reportLoading || !isDateRangeValid">
            <i class="bi bi-funnel" aria-hidden="true"></i>
            Tampilkan
          </button>
          <button
            class="export-button"
            type="button"
            :disabled="reportLoading || exporting || !hasCurrentReport"
            @click="exportSummary"
          >
            <i
              class="bi"
              :class="exporting ? 'bi-arrow-repeat spin' : 'bi-file-earmark-excel'"
              aria-hidden="true"
            ></i>
            {{ exporting ? "Menyiapkan" : "Unduh rekap" }}
          </button>
        </div>
        <p v-if="!isDateRangeValid" class="filter-hint">
          Pilih tanggal yang valid, tidak melebihi hari ini, dan maksimal 90 hari.
        </p>
      </form>

      <div v-if="reportError" class="data-alert" role="alert">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        <span>{{ reportError }}</span>
      </div>

      <div class="summary-grid report-summary">
        <article class="summary-card">
          <span class="summary-icon blue"><i class="bi bi-clipboard-data"></i></span>
          <span class="summary-label">Catatan presensi</span>
          <strong>{{ reportLoading && !hasReportData ? "…" : reportRows.length }}</strong>
          <small>Data dalam periode terpilih</small>
        </article>
        <article class="summary-card">
          <span class="summary-icon green"><i class="bi bi-check2-circle"></i></span>
          <span class="summary-label">Hadir</span>
          <strong>{{ reportLoading && !hasReportData ? "…" : reportCounts.present }}</strong>
          <small>{{ reportAttendanceRate }}% dari catatan presensi</small>
        </article>
        <article class="summary-card">
          <span class="summary-icon red"><i class="bi bi-x-circle"></i></span>
          <span class="summary-label">Tidak hadir</span>
          <strong>{{ reportLoading && !hasReportData ? "…" : reportCounts.absent }}</strong>
          <small>Presensi berstatus tidak hadir</small>
        </article>
        <article class="summary-card">
          <span class="summary-icon orange"><i class="bi bi-chat-square-text"></i></span>
          <span class="summary-label">Izin / sakit</span>
          <strong>{{ reportLoading && !hasReportData ? "…" : reportCounts.permission + reportCounts.sick }}</strong>
          <small>{{ reportCounts.permission }} izin · {{ reportCounts.sick }} sakit</small>
        </article>
      </div>

      <section class="sessions-panel report-panel">
        <div class="panel-heading list-heading">
          <div>
            <h2>Ringkasan per tugas dan kegiatan</h2>
            <p>{{ reportPeriodLabel }} · {{ reportRows.length }} catatan presensi</p>
          </div>
          <span class="session-count">{{ activitySummaries.length }} agenda</span>
        </div>

        <div v-if="reportLoading && !hasReportData" class="empty-state">
          <span class="spinner-border spinner-border-sm" role="status"></span>
          Memuat rangkuman kehadiran...
        </div>
        <div v-else-if="!reportError && !activitySummaries.length" class="empty-state">
          <span class="empty-icon"><i class="bi bi-clipboard2-check"></i></span>
          <strong>Belum ada catatan presensi pada periode ini</strong>
          <span>Ubah rentang tanggal atau jenis tugas untuk melihat rekap lainnya.</span>
        </div>
        <div v-else-if="activitySummaries.length" class="table-responsive">
          <table class="summary-table">
            <thead>
              <tr>
                <th>Tugas / kegiatan</th>
                <th>Jenis</th>
                <th>Total</th>
                <th>Hadir</th>
                <th>Alfa</th>
                <th>Izin</th>
                <th>Sakit</th>
                <th>Kehadiran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in activitySummaries" :key="item.key">
                <td><strong>{{ item.name }}</strong></td>
                <td>{{ activityTypeLabel(item.type) }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.present }}</td>
                <td>{{ item.absent }}</td>
                <td>{{ item.permission }}</td>
                <td>{{ item.sick }}</td>
                <td>
                  <span class="rate-chip">{{ percentage(item.present, item.total) }}%</span>
                </td>
                <td>
                  <button class="view-details-button" type="button" @click="showActivityDetails(item)">
                    <i class="bi bi-eye" aria-hidden="true"></i>
                    Lihat
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2">Total</th>
                <th>{{ reportRows.length }}</th>
                <th>{{ reportCounts.present }}</th>
                <th>{{ reportCounts.absent }}</th>
                <th>{{ reportCounts.permission }}</th>
                <th>{{ reportCounts.sick }}</th>
                <th>{{ reportAttendanceRate }}%</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div v-if="activitySummaries.length" class="summary-cards">
          <article
            v-for="item in activitySummaries"
            :key="`mobile-${item.key}`"
            class="summary-report-card"
          >
            <header>
              <div>
                <strong>{{ item.name }}</strong>
                <span>{{ activityTypeLabel(item.type) }}</span>
              </div>
              <span class="rate-chip">{{ percentage(item.present, item.total) }}% hadir</span>
            </header>
            <dl>
              <div>
                <dt>Total</dt>
                <dd>{{ item.total }}</dd>
              </div>
              <div>
                <dt>Hadir</dt>
                <dd class="present-value">{{ item.present }}</dd>
              </div>
              <div>
                <dt>Tidak hadir</dt>
                <dd class="absent-value">{{ item.absent }}</dd>
              </div>
              <div>
                <dt>Izin</dt>
                <dd>{{ item.permission }}</dd>
              </div>
              <div>
                <dt>Sakit</dt>
                <dd>{{ item.sick }}</dd>
              </div>
            </dl>
            <button
              class="view-details-button mobile-details-button"
              type="button"
              @click="showActivityDetails(item)"
            >
              <i class="bi bi-eye" aria-hidden="true"></i>
              Lihat detail guru
            </button>
          </article>
        </div>
      </section>
      <p class="report-note">
        <i class="bi bi-info-circle" aria-hidden="true"></i>
        Rangkuman dihitung dari presensi yang sudah tersimpan. Data yang belum diisi tidak masuk ke perhitungan laporan.
      </p>
    </section>

    <div
      v-if="selectedActivityKey"
      class="details-backdrop"
      @click.self="closeActivityDetails"
    >
      <section
        class="details-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        tabindex="-1"
      >
        <header class="details-heading">
          <div>
            <span class="section-kicker">DETAIL KEHADIRAN</span>
            <h2 id="details-title">{{ selectedActivity?.name || "Tugas / kegiatan" }}</h2>
            <p>
              {{ activityTypeLabel(selectedActivity?.type) }}
              <span v-if="appliedFilters">
                · {{ appliedFilters.start_date }} s.d. {{ appliedFilters.end_date }}
              </span>
            </p>
          </div>
          <button
            class="close-details-button"
            type="button"
            aria-label="Tutup detail kehadiran"
            @click="closeActivityDetails"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        <div class="detail-status-summary">
          <span><i class="bi bi-x-circle" aria-hidden="true"></i> Tidak hadir: {{ selectedActivity?.absent || 0 }}</span>
          <span><i class="bi bi-envelope" aria-hidden="true"></i> Izin: {{ selectedActivity?.permission || 0 }}</span>
          <span><i class="bi bi-heart-pulse" aria-hidden="true"></i> Sakit: {{ selectedActivity?.sick || 0 }}</span>
        </div>

        <div v-if="!selectedTeacherDetails.length" class="empty-state details-empty">
          <span class="empty-icon"><i class="bi bi-emoji-smile"></i></span>
          <strong>Tidak ada catatan tidak hadir, izin, atau sakit</strong>
          <span>Semua catatan kehadiran pada tugas atau kegiatan ini berstatus hadir.</span>
        </div>
        <div v-else class="teacher-details-list">
          <article
            v-for="teacher in selectedTeacherDetails"
            :key="teacher.key"
            class="teacher-detail-card"
          >
            <header class="teacher-detail-heading">
              <div>
                <strong>{{ teacher.name }}</strong>
                <span>{{ teacher.nip || "NIP tidak tersedia" }}</span>
              </div>
              <div class="teacher-status-counts">
                <span v-if="teacher.absent" class="detail-status absent">
                  {{ teacher.absent }} tidak hadir
                </span>
                <span v-if="teacher.permission" class="detail-status permission">
                  {{ teacher.permission }} izin
                </span>
                <span v-if="teacher.sick" class="detail-status sick">
                  {{ teacher.sick }} sakit
                </span>
              </div>
            </header>
            <ul class="teacher-attendance-records">
              <li v-for="record in teacher.records" :key="record.id">
                <span class="detail-status" :class="`status-${record.status}`">
                  {{ attendanceStatusLabel(record.status) }}
                </span>
                <span>{{ formatRecordDate(record.date) }} · {{ sessionLabel(record.session) }}</span>
                <span v-if="record.notes" class="record-notes">{{ record.notes }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
  applicationClock,
  getApplicationDateKey,
} from "@/services/applicationClock";
import {
  getActivityAttendanceHistory,
  getHeadmasterActivitySessions,
} from "@/services/api";

const activeTab = ref("realtime");
const todayDate = computed(() => getApplicationDateKey());
const todayLabel = computed(() =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(applicationClock.currentTime),
);
const realtimeLoading = ref(false);
const realtimeError = ref("");
const activeSessions = ref([]);
const hasRealtimeData = ref(false);
const reportFilters = reactive({
  start_date: getMonthStartDate(todayDate.value),
  end_date: todayDate.value,
  activity_type: "",
});
const reportRows = ref([]);
const appliedFilters = ref(null);
const reportLoading = ref(false);
const reportError = ref("");
const hasReportData = ref(false);
const exporting = ref(false);
const selectedActivityKey = ref("");
let realtimeInterval;

const expectedCount = computed(() =>
  activeSessions.value.reduce(
    (total, session) => total + Math.max(0, Number(session.total_teachers) || 0),
    0,
  ),
);
const recordedCount = computed(() =>
  activeSessions.value.reduce(
    (total, session) => total + Math.max(0, Number(session.attendance_count) || 0),
    0,
  ),
);
const pendingCount = computed(() => Math.max(0, expectedCount.value - recordedCount.value));
const completionRate = computed(() =>
  percentage(recordedCount.value, expectedCount.value),
);
const isDateRangeValid = computed(() => {
  const { start_date, end_date } = reportFilters;
  if (!start_date || !end_date || start_date > end_date || end_date > todayDate.value) {
    return false;
  }
  const range = (Date.parse(`${end_date}T00:00:00Z`) - Date.parse(`${start_date}T00:00:00Z`)) / 86_400_000;
  return range <= 90;
});
const hasCurrentReport = computed(
  () =>
    hasReportData.value &&
    appliedFilters.value &&
    JSON.stringify(appliedFilters.value) === JSON.stringify(reportFilters),
);
const reportCounts = computed(() =>
  reportRows.value.reduce(
    (counts, row) => {
      if (Object.hasOwn(counts, row.status)) counts[row.status] += 1;
      return counts;
    },
    { present: 0, absent: 0, permission: 0, sick: 0 },
  ),
);
const reportAttendanceRate = computed(() =>
  percentage(reportCounts.value.present, reportRows.value.length),
);
const activitySummaries = computed(() => {
  const summaries = new Map();
  reportRows.value.forEach((row) => {
    const key = `${row.activity_id}:${row.activity_type}`;
    if (!summaries.has(key)) {
      summaries.set(key, {
        key,
        name: row.activity_name || "Kegiatan sekolah",
        type: row.activity_type,
        total: 0,
        present: 0,
        absent: 0,
        permission: 0,
        sick: 0,
      });
    }
    const summary = summaries.get(key);
    summary.total += 1;
    if (Object.hasOwn(summary, row.status)) summary[row.status] += 1;
  });
  return [...summaries.values()].sort(
    (first, second) => second.total - first.total || first.name.localeCompare(second.name, "id"),
  );
});
const selectedActivity = computed(
  () => activitySummaries.value.find((item) => item.key === selectedActivityKey.value) || null,
);
const selectedTeacherDetails = computed(() => {
  if (!selectedActivityKey.value) return [];
  const groupedTeachers = new Map();
  reportRows.value
    .filter(
      (row) =>
        `${row.activity_id}:${row.activity_type}` === selectedActivityKey.value &&
        ["absent", "permission", "sick"].includes(row.status),
    )
    .forEach((row) => {
      const teacherKey = String(row.teacher?.id ?? row.teacher?.name ?? row.id);
      if (!groupedTeachers.has(teacherKey)) {
        groupedTeachers.set(teacherKey, {
          key: teacherKey,
          name: row.teacher?.name || "Guru",
          nip: row.teacher?.nip || "",
          absent: 0,
          permission: 0,
          sick: 0,
          records: [],
        });
      }
      const teacher = groupedTeachers.get(teacherKey);
      teacher[row.status] += 1;
      teacher.records.push(row);
    });
  return [...groupedTeachers.values()].sort(
    (first, second) =>
      second.absent + second.permission + second.sick -
        (first.absent + first.permission + first.sick) ||
      first.name.localeCompare(second.name, "id"),
  );
});
const reportPeriodLabel = computed(() => {
  const filters = appliedFilters.value || reportFilters;
  return `${filters.start_date} s.d. ${filters.end_date}`;
});

watch(todayDate, (date, previousDate) => {
  if (reportFilters.end_date === previousDate) reportFilters.end_date = date;
  if (reportFilters.start_date === getMonthStartDate(previousDate)) {
    reportFilters.start_date = getMonthStartDate(date);
  }
});

onMounted(() => {
  loadRealtime();
  loadReport();
  realtimeInterval = window.setInterval(loadRealtime, 30000);
});

onBeforeUnmount(() => {
  if (realtimeInterval) window.clearInterval(realtimeInterval);
  window.removeEventListener("keydown", handleDetailsKeydown);
});

async function loadRealtime() {
  if (realtimeLoading.value) return;
  realtimeLoading.value = true;
  realtimeError.value = "";
  try {
    const result = await getHeadmasterActivitySessions();
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || "Format rekap sesi tidak sesuai.");
    }
    activeSessions.value = result.data;
    hasRealtimeData.value = true;
  } catch (error) {
    console.error("Gagal memuat rekap realtime kehadiran kegiatan:", error);
    activeSessions.value = [];
    hasRealtimeData.value = false;
    realtimeError.value = `Rekap realtime gagal dimuat: ${error.message}`;
  } finally {
    realtimeLoading.value = false;
  }
}

async function loadReport() {
  if (!isDateRangeValid.value || reportLoading.value) return;
  reportLoading.value = true;
  reportError.value = "";
  try {
    const query = { ...reportFilters };
    const data = await getActivityAttendanceHistory(query);
    if (!Array.isArray(data)) {
      throw new Error("Format laporan kehadiran tidak sesuai.");
    }
    reportRows.value = data;
    appliedFilters.value = query;
    hasReportData.value = true;
  } catch (error) {
    console.error("Gagal memuat rangkuman kehadiran guru:", error);
    reportRows.value = [];
    appliedFilters.value = null;
    hasReportData.value = false;
    reportError.value = `Rangkuman laporan gagal dimuat: ${error.message}`;
  } finally {
    reportLoading.value = false;
  }
}

async function exportSummary() {
  if (!hasCurrentReport.value || exporting.value) return;
  exporting.value = true;
  reportError.value = "";
  try {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIKAP";
    workbook.subject = "Rangkuman kehadiran guru pada kegiatan dan tugas rutin";
    workbook.title = "Rangkuman Kehadiran Guru";
    workbook.created = applicationClock.currentTime;

    const sheet = workbook.addWorksheet("Rekap Kehadiran", {
      views: [{ state: "frozen", ySplit: 4 }],
    });
    sheet.columns = [
      { width: 36 },
      { width: 22 },
      { width: 16 },
      { width: 12 },
      { width: 16 },
      { width: 12 },
      { width: 12 },
      { width: 18 },
    ];
    sheet.addRow(["Periode laporan", reportPeriodLabel.value]);
    sheet.addRow(["Jenis tugas", activityTypeLabel(reportFilters.activity_type)]);
    sheet.addRow([]);
    sheet.addRow([
      "Tugas / kegiatan",
      "Jenis",
      "Total catatan",
      "Hadir",
      "Tidak hadir",
      "Izin",
      "Sakit",
      "Kehadiran (%)",
    ]);
    activitySummaries.value.forEach((item) => {
      sheet.addRow([
        item.name,
        activityTypeLabel(item.type),
        item.total,
        item.present,
        item.absent,
        item.permission,
        item.sick,
        percentage(item.present, item.total),
      ]);
    });
    sheet.addRow([
      "Total",
      "",
      reportRows.value.length,
      reportCounts.value.present,
      reportCounts.value.absent,
      reportCounts.value.permission,
      reportCounts.value.sick,
      reportAttendanceRate.value,
    ]);
    sheet.autoFilter = { from: "A4", to: "H4" };
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", wrapText: true };
        if (rowNumber === 4) {
          cell.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
        } else if (rowNumber > 4) {
          cell.font = { name: "Arial", size: 10, color: { argb: "FF1F2937" } };
          if (rowNumber % 2 === 1) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F6FA" } };
          }
        } else {
          cell.font = { name: "Arial", bold: true, color: { argb: "FF17365D" } };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const url = URL.createObjectURL(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `rangkuman-kehadiran-guru-${reportFilters.start_date}-${reportFilters.end_date}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal mengekspor rangkuman kehadiran:", error);
    reportError.value = `File rekap gagal dibuat: ${error.message}`;
  } finally {
    exporting.value = false;
  }
}

function showActivityDetails(activity) {
  selectedActivityKey.value = activity.key;
  window.addEventListener("keydown", handleDetailsKeydown);
}

function closeActivityDetails() {
  selectedActivityKey.value = "";
  window.removeEventListener("keydown", handleDetailsKeydown);
}

function handleDetailsKeydown(event) {
  if (event.key === "Escape") closeActivityDetails();
}

function activityTypeLabel(type) {
  if (type === "routine") return "Tugas rutin / piket";
  if (type === "tentative") return "Kegiatan sekolah";
  return "Semua jenis";
}

function sessionLabel(session) {
  return { morning: "Pagi", afternoon: "Siang", all_day: "Seharian" }[session] || "Sesi";
}

function attendanceStatusLabel(status) {
  return {
    absent: "Tidak hadir",
    permission: "Izin",
    sick: "Sakit",
  }[status] || "Belum ditentukan";
}

function formatRecordDate(value) {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function targetLabel(target) {
  return target === "all_teachers" ? "Semua guru aktif" : "Guru yang ditugaskan";
}

function sessionProgress(session) {
  return percentage(
    Number(session.attendance_count) || 0,
    Number(session.total_teachers) || 0,
  );
}

function percentage(value, total) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function getMonthStartDate(date) {
  return `${date.slice(0, 7)}-01`;
}
</script>

<style scoped>
.activity-attendance-page {
  --ink: #f1f5f9;
  --muted: #94a3b8;
  --line: rgba(255, 255, 255, 0.07);
  display: grid;
  gap: 1rem;
  padding: 0.25rem 0 1.5rem;
  color: var(--ink);
  min-width: 0;
  max-width: 100%;
}

.page-heading,
.panel-heading {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.page-heading > div,
.panel-heading > div {
  min-width: 0;
}

.page-heading {
  align-items: center;
  padding: 0.35rem 0 0.45rem;
}

.section-kicker {
  color: #86efac;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.page-heading h1 {
  margin: 0.35rem 0;
  color: #f8fafc;
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 750;
  letter-spacing: -0.03em;
}

.page-heading p,
.panel-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 0.84rem;
}

.view-only-badge,
.view-tabs,
.view-tabs button,
.refresh-button,
.primary-button,
.export-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.view-only-badge {
  padding: 0.55rem 0.75rem;
  border: 1px solid rgba(74, 222, 128, 0.18);
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.08);
  color: #86efac;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.view-tabs {
  justify-content: flex-start;
  gap: 0.45rem;
  padding: 0.35rem;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
}

.view-tabs button {
  min-height: 40px;
  padding: 0.55rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 700;
}

.view-tabs button.active {
  border-color: rgba(74, 222, 128, 0.18);
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
}

.tab-content {
  display: grid;
  min-width: 0;
  gap: 1rem;
}

.panel-heading {
  align-items: center;
}

.panel-heading h2 {
  margin: 0 0 0.3rem;
  color: #f8fafc;
  font-size: 1.05rem;
  font-weight: 750;
}

.panel-heading p {
  font-size: 0.78rem;
}

.refresh-button,
.primary-button,
.export-button {
  min-height: 38px;
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.refresh-button:hover:not(:disabled),
.export-button:hover:not(:disabled) {
  border-color: rgba(74, 222, 128, 0.25);
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
}

.refresh-button:disabled,
.primary-button:disabled,
.export-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.spin {
  animation: spin 0.9s linear infinite;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.summary-card,
.sessions-panel,
.filter-panel {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.summary-card {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  column-gap: 0.7rem;
  padding: 1rem;
}

.summary-icon {
  display: grid;
  width: 38px;
  height: 38px;
  grid-row: span 2;
  place-items: center;
  border-radius: 12px;
  font-size: 1rem;
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
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.summary-icon.violet {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.summary-icon.red {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.summary-label {
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-card > strong {
  grid-column: 2;
  color: #f8fafc;
  font-size: 1.65rem;
  line-height: 1.2;
}

.summary-card > small {
  grid-column: 1 / -1;
  margin-top: 0.55rem;
  color: #94a3b8;
  font-size: 0.7rem;
}

.sessions-panel {
  min-width: 0;
  max-width: 100%;
  padding: 1.2rem;
}

.list-heading {
  margin-bottom: 0.75rem;
}

.session-count {
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.session-list {
  display: grid;
}

.session-row {
  display: grid;
  grid-template-columns: 38px minmax(150px, 1fr) minmax(140px, 0.8fr) auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 0;
  border-top: 1px solid var(--line);
  min-width: 0;
}

.session-icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 11px;
}

.session-icon.routine {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.session-icon.event {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.session-info {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
}

.session-info strong {
  overflow: hidden;
  color: #f1f5f9;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-info span {
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-progress {
  display: grid;
  gap: 0.4rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.7rem;
}

.progress-label strong {
  color: #e2e8f0;
}

.progress-track {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  transition: width 0.25s ease;
}

.status-chip,
.rate-chip {
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-chip.complete {
  background: rgba(34, 197, 94, 0.13);
  color: #86efac;
}

.status-chip.pending {
  background: rgba(245, 158, 11, 0.13);
  color: #fcd34d;
}

.data-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.08);
  color: #fbbf24;
  font-size: 0.8rem;
}

.empty-state {
  display: flex;
  min-height: 160px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #94a3b8;
  text-align: center;
  font-size: 0.8rem;
}

.empty-state strong {
  color: #e2e8f0;
  font-size: 0.86rem;
}

.empty-icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  font-size: 1.1rem;
}

.filter-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(130px, 1fr)) auto;
  align-items: end;
  gap: 0.75rem;
  padding: 1rem;
  min-width: 0;
}

.filter-panel label {
  display: grid;
  min-width: 0;
  gap: 0.4rem;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 700;
}

.filter-panel input,
.filter-panel select {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 38px;
  padding: 0.5rem 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 9px;
  background: #0b1b2e;
  color: #e2e8f0;
  color-scheme: dark;
  font-size: 0.76rem;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.primary-button {
  border-color: rgba(34, 197, 94, 0.25);
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.primary-button:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.22);
}

.export-button {
  border-color: rgba(59, 130, 246, 0.22);
  color: #93c5fd;
}

.filter-hint {
  grid-column: 1 / -1;
  margin: 0;
  color: #fbbf24;
  font-size: 0.72rem;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  color: #cbd5e1;
  font-size: 0.76rem;
}

.summary-cards {
  display: none;
}

.summary-report-card {
  min-width: 0;
  padding: 0.9rem;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
}

.summary-report-card header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}

.summary-report-card header > div {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
}

.summary-report-card header strong {
  color: #f1f5f9;
  font-size: 0.82rem;
  overflow-wrap: anywhere;
}

.summary-report-card header > div span {
  color: #94a3b8;
  font-size: 0.7rem;
}

.summary-report-card dl {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.4rem;
  margin: 0.85rem 0 0;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

.summary-report-card dl > div {
  min-width: 0;
}

.summary-report-card dt {
  color: #94a3b8;
  font-size: 0.63rem;
}

.summary-report-card dd {
  margin: 0.25rem 0 0;
  color: #e2e8f0;
  font-size: 0.82rem;
  font-weight: 700;
}

.summary-report-card .present-value {
  color: #86efac;
}

.summary-report-card .absent-value {
  color: #fca5a5;
}

.summary-table th,
.summary-table td {
  padding: 0.75rem 0.65rem;
  border-top: 1px solid var(--line);
  text-align: left;
  white-space: nowrap;
}

.summary-table th {
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 700;
}

.summary-table td strong {
  color: #f1f5f9;
  font-weight: 650;
}

.summary-table tfoot th {
  color: #e2e8f0;
}

.rate-chip {
  background: rgba(34, 197, 94, 0.13);
  color: #86efac;
}

.view-details-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 32px;
  padding: 0.4rem 0.65rem;
  border: 1px solid rgba(74, 222, 128, 0.22);
  border-radius: 9px;
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.view-details-button:hover {
  border-color: rgba(74, 222, 128, 0.4);
  background: rgba(34, 197, 94, 0.18);
  color: #bbf7d0;
}

.mobile-details-button {
  display: none;
}

.details-backdrop {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(2, 6, 23, 0.76);
  backdrop-filter: blur(5px);
}

.details-dialog {
  width: min(100%, 760px);
  max-height: min(85vh, 780px);
  overflow-y: auto;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: #0f1b2e;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
}

.details-heading,
.teacher-detail-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.details-heading h2 {
  margin: 0.35rem 0;
  color: #f8fafc;
  font-size: 1.15rem;
  font-weight: 750;
  overflow-wrap: anywhere;
}

.details-heading p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.76rem;
}

.close-details-button {
  display: grid;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
}

.close-details-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.detail-status-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.detail-status-summary span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: #cbd5e1;
  font-size: 0.7rem;
}

.detail-status-summary span:nth-child(1) i {
  color: #f87171;
}

.detail-status-summary span:nth-child(2) i {
  color: #fbbf24;
}

.detail-status-summary span:nth-child(3) i {
  color: #60a5fa;
}

.teacher-details-list {
  display: grid;
  gap: 0.65rem;
}

.teacher-detail-card {
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.025);
}

.teacher-detail-heading > div:first-child {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.teacher-detail-heading > div:first-child strong {
  color: #f1f5f9;
  font-size: 0.82rem;
  overflow-wrap: anywhere;
}

.teacher-detail-heading > div:first-child span {
  color: #94a3b8;
  font-size: 0.68rem;
}

.teacher-status-counts {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
}

.detail-status {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.detail-status.absent,
.detail-status.status-absent {
  background: rgba(239, 68, 68, 0.14);
  color: #fca5a5;
}

.detail-status.permission,
.detail-status.status-permission {
  background: rgba(245, 158, 11, 0.14);
  color: #fcd34d;
}

.detail-status.sick,
.detail-status.status-sick {
  background: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
}

.teacher-attendance-records {
  display: grid;
  gap: 0.4rem;
  margin: 0.75rem 0 0;
  padding: 0.65rem 0 0;
  border-top: 1px solid var(--line);
  list-style: none;
}

.teacher-attendance-records li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  color: #cbd5e1;
  font-size: 0.7rem;
}

.teacher-attendance-records .record-notes {
  flex-basis: 100%;
  padding-left: 0.2rem;
  color: #94a3b8;
  overflow-wrap: anywhere;
}

.details-empty {
  min-height: 130px;
}

.report-note {
  display: flex;
  gap: 0.5rem;
  margin: -0.4rem 0 0;
  color: #94a3b8;
  font-size: 0.72rem;
  line-height: 1.5;
}

.report-note i {
  flex: 0 0 auto;
  color: #60a5fa;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-actions {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .activity-attendance-page,
  .tab-content,
  .sessions-panel,
  .filter-panel {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .page-heading {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .page-heading h1 {
    font-size: 1.35rem;
    overflow-wrap: anywhere;
  }

  .page-heading p {
    font-size: 0.78rem;
  }

  .view-only-badge {
    padding: 0.45rem 0.55rem;
    font-size: 0.68rem;
    white-space: normal;
  }

  .view-tabs {
    width: 100%;
    min-width: 0;
  }

  .view-tabs button {
    flex: 1;
    min-width: 0;
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .view-tabs button i {
    flex: 0 0 auto;
  }

  .summary-card {
    grid-template-columns: 32px minmax(0, 1fr);
    column-gap: 0.5rem;
    padding: 0.8rem;
    min-width: 0;
  }

  .summary-icon {
    width: 32px;
    height: 32px;
  }

  .summary-card > strong {
    font-size: 1.4rem;
  }

  .summary-card > small {
    font-size: 0.65rem;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .panel-heading {
    align-items: flex-start;
  }

  .panel-heading h2 {
    font-size: 0.95rem;
  }

  .panel-heading p {
    font-size: 0.72rem;
    overflow-wrap: anywhere;
  }

  .sessions-panel {
    padding: 0.9rem;
  }

  .report-heading {
    align-items: center;
  }

  .session-row {
    grid-template-columns: 34px minmax(0, 1fr) auto;
    gap: 0.55rem;
  }

  .session-progress {
    grid-column: 1 / -1;
  }

  .session-row .status-chip {
    justify-self: end;
    font-size: 0.62rem;
  }

  .session-info span {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .progress-label {
    font-size: 0.65rem;
  }

  .filter-panel {
    grid-template-columns: minmax(0, 1fr);
    padding: 0.85rem;
  }

  .filter-actions {
    grid-column: auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-actions button {
    min-width: 0;
    padding-right: 0.45rem;
    padding-left: 0.45rem;
    font-size: 0.72rem;
  }

  .report-panel .table-responsive {
    display: none;
  }

  .summary-cards {
    display: grid;
    gap: 0.65rem;
  }

  .mobile-details-button {
    display: inline-flex;
    width: 100%;
    margin-top: 0.75rem;
  }

  .summary-report-card {
    padding: 0.75rem;
  }

  .summary-report-card header {
    gap: 0.35rem;
  }

  .summary-report-card .rate-chip {
    flex: 0 0 auto;
    padding: 0.3rem 0.4rem;
    font-size: 0.62rem;
  }

  .summary-report-card dl {
    gap: 0.25rem;
  }

  .summary-report-card dt {
    font-size: 0.58rem;
    overflow-wrap: anywhere;
  }

  .summary-report-card dd {
    font-size: 0.75rem;
  }

  .report-note {
    overflow-wrap: anywhere;
  }

  .details-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .details-dialog {
    width: 100%;
    max-height: 88vh;
    padding: 1rem;
    border-radius: 20px 20px 0 0;
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .details-heading h2 {
    font-size: 1rem;
  }

  .teacher-detail-card {
    padding: 0.75rem;
  }

  .teacher-detail-heading {
    flex-direction: column;
  }

  .teacher-status-counts {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spin {
    animation-duration: 2s;
  }
}
</style>
