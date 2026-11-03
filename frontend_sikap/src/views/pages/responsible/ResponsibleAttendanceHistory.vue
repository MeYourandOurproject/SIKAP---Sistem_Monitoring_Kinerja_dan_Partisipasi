<template>
  <section class="attendance-history-page text-start">
    <header class="history-heading">
      <div>
        <h1>Riwayat Kehadiran Guru</h1>
        <p>Telusuri presensi guru pada tugas dan kegiatan yang tersimpan.</p>
      </div>
      <span class="period-note">Periode maksimal 90 hari</span>
    </header>

    <form class="filter-card" @submit.prevent="loadHistory">
      <label>
        <span>Tanggal mulai</span>
        <input v-model="filters.start_date" type="date" required :max="todayDate" :disabled="loading || exporting" />
      </label>
      <label>
        <span>Tanggal selesai</span>
        <input v-model="filters.end_date" type="date" required :max="todayDate" :disabled="loading || exporting" />
      </label>
      <label>
        <span>Guru</span>
        <select v-model="filters.teacher_id" :disabled="loading || exporting">
          <option value="">Semua guru</option>
          <option v-for="teacher in teachers" :key="teacher.id" :value="String(teacher.id)">
            {{ teacher.name }}
          </option>
        </select>
      </label>
      <label>
        <span>Jenis</span>
        <select v-model="filters.activity_type" :disabled="loading || exporting">
          <option value="">Semua tugas dan kegiatan</option>
          <option value="routine">Tugas rutin</option>
          <option value="tentative">Kegiatan</option>
        </select>
      </label>
      <label class="activity-filter">
        <span>Tugas/kegiatan</span>
        <select v-model="filters.activity_id" :disabled="loading || exporting">
          <option value="">Semua tugas dan kegiatan</option>
          <option v-for="activity in availableActivities" :key="activity.id" :value="String(activity.id)">
            {{ activity.name }}
          </option>
        </select>
      </label>
      <div class="filter-actions">
        <button class="apply-button" type="submit" :disabled="loading || !isDateRangeValid">
          <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <i v-else class="bi bi-search" aria-hidden="true"></i>
          Tampilkan
        </button>
        <button
          class="export-button"
          type="button"
          :disabled="loading || exporting || !hasCurrentResults"
          @click="exportHistory"
        >
          <span v-if="exporting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <i v-else class="bi bi-file-earmark-excel" aria-hidden="true"></i>
          Unduh Excel
        </button>
      </div>
      <p v-if="!isDateRangeValid" class="filter-hint">
        Pilih rentang tanggal yang valid, tidak melebihi hari ini dan maksimal 90 hari.
      </p>
    </form>

    <div v-if="optionsError" class="history-alert" role="alert">{{ optionsError }}</div>
    <div v-if="historyError" class="history-alert" role="alert">{{ historyError }}</div>

    <section class="results-card">
      <div class="results-heading">
        <div>
          <h2>Daftar Kehadiran</h2>
          <p v-if="appliedFilters">
            {{ appliedFilters.start_date }} s.d. {{ appliedFilters.end_date }}
          </p>
        </div>
        <span class="result-count">{{ historyRows.length }} catatan</span>
      </div>

      <div v-if="loading" class="loading-state">
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        Memuat riwayat kehadiran...
      </div>
      <div v-else-if="!historyRows.length && !historyError" class="empty-state">
        Tidak ada riwayat kehadiran yang cocok dengan filter.
      </div>
      <div v-else-if="historyRows.length" class="table-responsive">
        <table class="history-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Guru</th>
              <th>Tugas/kegiatan</th>
              <th>Jenis</th>
              <th>Sesi</th>
              <th>Status</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in historyRows" :key="row.id">
              <td>{{ formatDate(row.date) }}</td>
              <td>
                <strong>{{ row.teacher?.name || "-" }}</strong>
                <small>{{ row.teacher?.nip || "NIP tidak tersedia" }}</small>
              </td>
              <td>{{ row.activity_name }}</td>
              <td>{{ activityTypeLabel(row.activity_type) }}</td>
              <td>{{ sessionLabel(row.session) }}</td>
              <td>
                <span class="status-chip" :class="`status-${row.status}`">
                  {{ attendanceStatusLabel(row.status) }}
                </span>
              </td>
              <td>{{ row.notes || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!loading && historyRows.length" class="history-cards">
        <article v-for="row in historyRows" :key="`mobile-${row.id}`" class="history-card">
          <header class="history-card-heading">
            <div>
              <strong>{{ row.teacher?.name || "-" }}</strong>
              <small>{{ row.teacher?.nip || "NIP tidak tersedia" }}</small>
            </div>
            <span class="status-chip" :class="`status-${row.status}`">
              {{ attendanceStatusLabel(row.status) }}
            </span>
          </header>
          <dl>
            <div>
              <dt>Tanggal</dt>
              <dd>{{ formatDate(row.date) }}</dd>
            </div>
            <div>
              <dt>Tugas/kegiatan</dt>
              <dd>{{ row.activity_name || "-" }}</dd>
            </div>
            <div class="history-card-meta">
              <div>
                <dt>Jenis</dt>
                <dd>{{ activityTypeLabel(row.activity_type) }}</dd>
              </div>
              <div>
                <dt>Sesi</dt>
                <dd>{{ sessionLabel(row.session) }}</dd>
              </div>
            </div>
            <div>
              <dt>Catatan</dt>
              <dd>{{ row.notes || "-" }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import {
  getActivities,
  getActivityAttendanceHistory,
  getTeachers,
} from "@/services/api";

const todayDate = getTodayDateKey();
const filters = ref({
  start_date: getMonthStartDate(todayDate),
  end_date: todayDate,
  teacher_id: "",
  activity_type: "",
  activity_id: "",
});
const teachers = ref([]);
const activities = ref([]);
const historyRows = ref([]);
const appliedFilters = ref(null);
const loading = ref(false);
const exporting = ref(false);
const historyError = ref("");
const optionsError = ref("");

const availableActivities = computed(() =>
  activities.value.filter(
    (activity) =>
      !filters.value.activity_type ||
      activity.type === filters.value.activity_type,
  ),
);

const isDateRangeValid = computed(() => {
  const { start_date, end_date } = filters.value;
  if (!start_date || !end_date || start_date > end_date || end_date > todayDate) {
    return false;
  }
  const range = (Date.parse(`${end_date}T00:00:00Z`) - Date.parse(`${start_date}T00:00:00Z`)) / 86_400_000;
  return range <= 90;
});

const hasCurrentResults = computed(
  () =>
    historyRows.value.length > 0 &&
    appliedFilters.value &&
    JSON.stringify(appliedFilters.value) === JSON.stringify(filters.value),
);

watch(
  () => filters.value.activity_type,
  () => {
    if (
      filters.value.activity_id &&
      !availableActivities.value.some(
        (activity) => String(activity.id) === filters.value.activity_id,
      )
    ) {
      filters.value.activity_id = "";
    }
  },
);

onMounted(async () => {
  await loadFilterOptions();
  await loadHistory();
});

async function loadFilterOptions() {
  optionsError.value = "";
  try {
    const [teacherResult, activityResult] = await Promise.all([
      getTeachers(),
      getActivities(),
    ]);
    if (!teacherResult.success) {
      throw new Error(teacherResult.message || "Daftar guru gagal dimuat.");
    }
    if (!activityResult.success) {
      throw new Error(activityResult.message || "Daftar tugas/kegiatan gagal dimuat.");
    }
    teachers.value = teacherResult.data || [];
    activities.value = activityResult.data || [];
  } catch (error) {
    console.error("Gagal memuat filter riwayat kehadiran guru:", error);
    optionsError.value = `Pilihan filter gagal dimuat: ${error.message}`;
  }
}

async function loadHistory() {
  if (!isDateRangeValid.value || loading.value) return;
  loading.value = true;
  historyError.value = "";
  try {
    const query = { ...filters.value };
    historyRows.value = await getActivityAttendanceHistory(query);
    appliedFilters.value = query;
  } catch (error) {
    console.error("Gagal memuat riwayat kehadiran guru:", error);
    historyRows.value = [];
    appliedFilters.value = null;
    historyError.value = `Riwayat kehadiran gagal dimuat: ${error.message}`;
  } finally {
    loading.value = false;
  }
}

async function exportHistory() {
  if (!hasCurrentResults.value || exporting.value) return;
  exporting.value = true;
  historyError.value = "";
  try {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIKAP";
    workbook.subject = "Laporan riwayat kehadiran guru";
    workbook.title = "Riwayat Kehadiran Guru";
    workbook.created = new Date();

    const summary = workbook.addWorksheet("Ringkasan", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    summary.columns = [
      { header: "Informasi", key: "label", width: 28 },
      { header: "Nilai", key: "value", width: 42 },
    ];
    summary.mergeCells("A1:B1");
    summary.getCell("A1").value = "LAPORAN RIWAYAT KEHADIRAN GURU";
    summary.getCell("A1").font = { name: "Arial", size: 15, bold: true, color: { argb: "FFFFFFFF" } };
    summary.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF17365D" } };
    summary.getRow(1).height = 28;
    summary.addRows([
      ["Periode", `${filters.value.start_date} s.d. ${filters.value.end_date}`],
      ["Guru", selectedTeacherName()],
      ["Jenis", selectedActivityTypeLabel()],
      ["Tugas/kegiatan", selectedActivityName()],
      ["Jumlah catatan", historyRows.value.length],
      ["Dibuat pada", `${formatCreatedAtWib()} WIB`],
    ]);
    summary.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: rowNumber === 1 ? 15 : 10,
          bold: rowNumber === 1 || cell.column === 1,
          color: { argb: rowNumber === 1 ? "FFFFFFFF" : "FF1F2937" },
        };
        if (rowNumber > 1 && rowNumber % 2 === 0) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F6FA" } };
        }
      });
    });

    const detail = workbook.addWorksheet("Riwayat Kehadiran", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    detail.columns = [
      { header: "No.", key: "number", width: 8 },
      { header: "Tanggal", key: "date", width: 16 },
      { header: "Nama Guru", key: "teacher", width: 30 },
      { header: "NIP", key: "nip", width: 22 },
      { header: "Tugas/kegiatan", key: "activity", width: 34 },
      { header: "Jenis", key: "type", width: 18 },
      { header: "Sesi", key: "session", width: 16 },
      { header: "Status Kehadiran", key: "status", width: 20 },
      { header: "Catatan", key: "notes", width: 40 },
    ];
    historyRows.value.forEach((row, index) => {
      detail.addRow({
        number: index + 1,
        date: formatDate(row.date),
        teacher: row.teacher?.name || "-",
        nip: row.teacher?.nip || "-",
        activity: row.activity_name || "-",
        type: activityTypeLabel(row.activity_type),
        session: sessionLabel(row.session),
        status: attendanceStatusLabel(row.status),
        notes: row.notes || "-",
      });
    });
    detail.autoFilter = { from: "A1", to: "I1" };
    detail.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: 10,
          bold: rowNumber === 1,
          color: { argb: rowNumber === 1 ? "FFFFFFFF" : "FF1F2937" },
        };
        if (rowNumber === 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
        } else if (rowNumber % 2 === 0) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F6FA" } };
        }
        cell.alignment = { vertical: "middle", wrapText: true };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildFilename();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal mengekspor riwayat kehadiran guru:", error);
    historyError.value = `Laporan Excel gagal dibuat: ${error.message}`;
  } finally {
    exporting.value = false;
  }
}

function selectedTeacherName() {
  if (!filters.value.teacher_id) return "Semua guru";
  return teachers.value.find(
    (teacher) => String(teacher.id) === filters.value.teacher_id,
  )?.name || "Guru terpilih";
}

function selectedActivityTypeLabel() {
  return filters.value.activity_type
    ? activityTypeLabel(filters.value.activity_type)
    : "Semua tugas dan kegiatan";
}

function selectedActivityName() {
  if (!filters.value.activity_id) return "Semua tugas dan kegiatan";
  return availableActivities.value.find(
    (activity) => String(activity.id) === filters.value.activity_id,
  )?.name || "Tugas/kegiatan terpilih";
}

function activityTypeLabel(type) {
  return type === "routine" ? "Tugas rutin" : type === "tentative" ? "Kegiatan" : "-";
}

function sessionLabel(session) {
  return { morning: "Pagi", afternoon: "Siang", all_day: "Seharian" }[session] || "-";
}

function attendanceStatusLabel(status) {
  return {
    present: "Hadir",
    absent: "Tidak hadir",
    sick: "Sakit",
    permission: "Izin",
  }[status] || "Belum ditentukan";
}

function formatDate(value) {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTodayDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getMonthStartDate(date) {
  return `${date.slice(0, 7)}-01`;
}

function formatCreatedAtWib() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function sanitizeFilename(value) {
  return String(value)
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "")
    .slice(0, 70) || "terpilih";
}

function buildFilename() {
  const parts = ["riwayat-kehadiran-guru"];
  if (filters.value.teacher_id) {
    parts.push(`guru-${sanitizeFilename(selectedTeacherName())}`);
  }
  if (filters.value.activity_id) {
    parts.push(`agenda-${sanitizeFilename(selectedActivityName())}`);
  } else if (filters.value.activity_type) {
    parts.push(sanitizeFilename(selectedActivityTypeLabel()));
  }
  parts.push(filters.value.start_date, filters.value.end_date);
  return `${parts.join("-")}.xlsx`;
}
</script>

<style scoped>
.attendance-history-page {
  color: #e2e8f0;
}

.history-heading,
.results-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.history-heading {
  margin: 8px 0 20px;
}

.history-heading h1,
.results-heading h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 700;
}

.history-heading p,
.results-heading p {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 0.88rem;
}

.period-note,
.result-count {
  flex: 0 0 auto;
  padding: 7px 11px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  color: #cbd5e1;
  font-size: 0.78rem;
}

.filter-card,
.results-card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.78);
}

.filter-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
  padding: 18px;
}

.filter-card label {
  display: grid;
  gap: 7px;
  color: #cbd5e1;
  font-size: 0.82rem;
}

.filter-card input,
.filter-card select {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  outline: none;
  background: #111c31;
  color: #f8fafc;
}

.filter-card input:focus,
.filter-card select:focus {
  border-color: #34d399;
}

.activity-filter {
  grid-column: span 2;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
  gap: 9px;
}

.filter-actions button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 14px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  font-size: 0.83rem;
  font-weight: 600;
}

.apply-button {
  background: #15803d;
}

.export-button {
  background: #166534;
}

.filter-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.filter-hint {
  grid-column: 1 / -1;
  margin: -4px 0 0;
  color: #fbbf24;
  font-size: 0.8rem;
}

.history-alert {
  margin-bottom: 14px;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 10px;
  background: rgba(127, 29, 29, 0.2);
  color: #fecaca;
}

.results-card {
  overflow: hidden;
}

.results-heading {
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.results-heading h2 {
  font-size: 1rem;
}

.result-count {
  background: rgba(148, 163, 184, 0.08);
}

.loading-state,
.empty-state {
  display: flex;
  min-height: 150px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 22px;
  color: #94a3b8;
  font-size: 0.9rem;
  text-align: center;
}

.history-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  color: #e2e8f0;
  font-size: 0.82rem;
}

.history-table th,
.history-table td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  text-align: left;
  vertical-align: middle;
}

.history-table th {
  background: rgba(30, 41, 59, 0.72);
  color: #cbd5e1;
  font-weight: 600;
  white-space: nowrap;
}

.history-table td small {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
}

.history-table td {
  overflow-wrap: anywhere;
}

.history-cards {
  display: none;
}

.history-card {
  min-width: 0;
  padding: 15px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.history-card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  color: #f8fafc;
}

.history-card-heading > div {
  min-width: 0;
  overflow-wrap: anywhere;
}

.history-card-heading small {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
}

.history-card dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.history-card dl > div {
  min-width: 0;
}

.history-card dt {
  margin-bottom: 2px;
  color: #94a3b8;
  font-size: 0.72rem;
}

.history-card dd {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.84rem;
  overflow-wrap: anywhere;
}

.history-card-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.status-chip {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
  white-space: nowrap;
}

.status-present {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
}

.status-absent {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.status-sick,
.status-permission {
  background: rgba(234, 179, 8, 0.15);
  color: #fde047;
}

@media (max-width: 900px) {
  .filter-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .activity-filter {
    grid-column: auto;
  }
}

@media (max-width: 600px) {
  .history-heading {
    flex-direction: column;
  }

  .filter-card {
    grid-template-columns: minmax(0, 1fr);
    padding: 14px;
  }

  .filter-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 991px) {
  .results-card > .table-responsive {
    display: none;
  }

  .history-cards {
    display: block;
  }

  .results-heading {
    padding: 14px;
  }

  .history-card-heading .status-chip {
    flex: 0 0 auto;
  }
}
</style>
