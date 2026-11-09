<template>
  <div class="efek">
    <nav class="kbm-mobile-tabs" aria-label="Menu KBM">
      <RouterLink :to="`${routeBase}/realtime`">
        <i class="bi bi-activity" aria-hidden="true"></i>
        Realtime Keterisian Kelas
      </RouterLink>
      <RouterLink :to="`${routeBase}/riwayat`">
        <i class="bi bi-clock-history" aria-hidden="true"></i>
        Riwayat Keterisian Kelas
      </RouterLink>
    </nav>
    <div v-if="mode === 'realtime'">
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

        <!-- <div class="text-end">
          <span class="badge bg-success-subtle text-success"
            >Realtime · Hari ini</span
          >
          <div class="small text-white-50 mt-1">{{ currentTime }} WIB</div>
        </div> -->
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

                <small class="card-subtitle"
                  >Kelas tervalidasi dari jadwal hari ini</small
                >
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
              >Kelas tampil setelah jadwal dimulai; status diperbarui realtime.
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
                <span>Tervalidasi</span>
              </div>

              <strong>{{ occupiedClasses }}</strong>
            </div>

            <!-- Terlambat dihitung ke Aktif; tidak tampil terpisah -->

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
            <div v-if="loadError" class="alert alert-danger" role="alert">
              {{ loadError }}
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4 text-start">
              <div>
                <h6 class="problem-title mb-1">Monitoring Semua Kelas</h6>

                <small class="problem-subtitle">
                  Status dan presensi jadwal hari ini
                </small>
              </div>

              <div class="text-end">
                <span class="problem-count">{{ allClasses.length }} Kelas</span>
                <div v-if="lastUpdated" class="small text-white-50 mt-1">
                  Diperbarui {{ lastUpdated }}
                </div>
              </div>
            </div>

            <div
              v-if="!loading && allClasses.length === 0"
              class="text-center text-white-50 py-5"
            >
              <i class="bi bi-info-circle me-2 text-warning"></i> Tidak ada jadwal yang berjalan pada waktu ini.
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
                  <div class="problem-header">
                    <div class="problem-icon" :class="item.statusClass">
                      <i :class="item.icon"></i>
                    </div>
                    <div class="text-start">
                      <h6 class="class-name">
                        {{ item.class }}
                      </h6>
                    </div>
                  </div>

                  <div class="d-flex flex-wrap gap-2 mb-2">
                    <span class="status-badge" :class="item.badgeClass">
                      {{ item.status }}
                    </span>
                    <span class="status-badge badge-neutral">
                      {{ item.validated ? "Tervalidasi" : "Belum divalidasi" }}
                    </span>
                  </div>

                  <p class="teacher-name">
                    <i class="bi bi-person"></i>
                    {{ item.teacher }}
                  </p>

                  <div class="compact-info">
                    <i class="bi bi-book"></i>
                    {{ item.subject }}
                  </div>

                  <div class="compact-info">
                    <i class="bi bi-clock"></i>
                    {{ item.start }} - {{ item.end }}
                  </div>

                  <div class="compact-info">
                    <i class="bi bi-geo-alt"></i>
                    {{ item.room }}
                  </div>
                  <div class="attendance-counts">
                    <span
                      ><i class="bi bi-person-check"></i> Hadir
                      <strong>{{ item.present_count }}</strong></span
                    >
                    <span
                      ><i class="bi bi-person-x"></i> Tidak hadir
                      <strong>{{ item.non_present_count }}</strong></span
                    >
                  </div>
                  <button
                    class="detail-button"
                    type="button"
                    @click="openDetails(item)"
                  >
                    <i class="bi bi-eye me-2"></i> Lihat detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section v-if="mode === 'history'" class="history-wrapper mt-3 text-start">
      <header class="history-header">
        <div>
          <h6 class="problem-title mb-1">Riwayat Keterisian Kelas</h6>
          <small class="problem-subtitle">
            Tentukan periode tanggal, lalu pilih kelas atau guru. Periode
            maksimal 90 hari.
          </small>
        </div>
        <button
          class="history-filter-button export-button"
          type="button"
          :disabled="
            historyLoading || exportingHistory || !historyClasses.length
          "
          @click="exportHistory"
        >
          <span
            v-if="exportingHistory"
            class="spinner-border spinner-border-sm"
            role="status"
          ></span>
          <i v-else class="bi bi-file-earmark-excel"></i>
          {{ exportingHistory ? "Menyiapkan Excel..." : "Unduh Excel" }}
        </button>
      </header>

      <div class="history-filters">
        <label>
          <span>Dari tanggal</span>
          <input
            v-model="historyQuery.start_date"
            type="date"
            :max="historyQuery.end_date || todayDate"
            aria-label="Tanggal awal periode riwayat"
          />
        </label>
        <label>
          <span>Sampai tanggal</span>
          <input
            v-model="historyQuery.end_date"
            type="date"
            :min="historyQuery.start_date"
            :max="todayDate"
            aria-label="Tanggal akhir periode riwayat"
          />
        </label>
        <label>
          <span>Kelas</span>
          <select
            v-model="historyQuery.class_id"
            aria-label="Filter riwayat berdasarkan kelas"
            :disabled="historyOptionsLoading"
          >
            <option value="">
              {{ historyOptionsLoading ? "Memuat daftar kelas..." : "Pilih kelas" }}
            </option>
            <option
              v-for="item in historyOptions.classes"
              :key="item.id"
              :value="String(item.id)"
            >
              {{ item.name }}
            </option>
          </select>
        </label>
        <label>
          <span>Guru</span>
          <select
            v-model="historyQuery.teacher_id"
            aria-label="Filter riwayat berdasarkan guru"
            :disabled="historyOptionsLoading"
          >
            <option value="">
              {{ historyOptionsLoading ? "Memuat daftar guru..." : "Pilih guru" }}
            </option>
            <option
              v-for="item in historyOptions.teachers"
              :key="item.id"
              :value="String(item.id)"
            >
              {{ item.name }}
            </option>
          </select>
        </label>
        <button
          class="history-filter-button"
          type="button"
          :disabled="historyLoading || !hasHistoryFilter"
          @click="loadHistory"
        >
          <span
            v-if="historyLoading"
            class="spinner-border spinner-border-sm"
          ></span>
          <i v-else class="bi bi-funnel"></i>
          Terapkan
        </button>
      </div>

      <div
        v-if="historyError"
        class="alert alert-danger mt-3 mb-0"
        role="alert"
      >
        {{ historyError }}
      </div>
      <div v-if="exportError" class="alert alert-danger mt-3 mb-0" role="alert">
        {{ exportError }}
      </div>
      <div v-else-if="historyLoading" class="history-empty">
        Memuat riwayat keterisian kelas...
      </div>
      <div v-else-if="!hasHistoryFilter" class="history-empty">
        Pilih periode tanggal dan kelas atau guru, lalu tekan Terapkan.
      </div>
      <div v-else-if="historyClasses.length" class="history-list">
        <article
          v-for="item in historyClasses"
          :key="`${item.schedule_id}-${item.agenda_date}`"
          class="history-row"
        >
          <div class="history-date">
            <strong>{{ formatHistoryDate(item.agenda_date) }}</strong>
            <span>{{ item.start }}–{{ item.end }}</span>
          </div>
          <div class="history-description">
            <strong>{{ item.class }}</strong>
            <span>{{ item.subject }} · {{ item.teacher }}</span>
            <small
              >{{ item.present_count }} hadir ·
              {{ item.non_present_count }} tidak hadir</small
            >
          </div>
          <span class="status-badge" :class="item.badgeClass">{{
            item.status
          }}</span>
          <button
            class="history-detail-button"
            type="button"
            @click="openDetails(item)"
          >
            Detail
          </button>
        </article>
      </div>
      <div v-else class="history-empty">
        Tidak ada riwayat pada filter dan rentang tanggal ini.
      </div>
    </section>

    <div
      v-if="selectedClass"
      class="monitoring-modal-backdrop"
      role="presentation"
      @click.self="closeDetails"
    >
      <section
        class="monitoring-modal text-start"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`monitoring-detail-title-${selectedClass.schedule_id}`"
      >
        <header class="monitoring-modal-header">
          <div>
            <span class="modal-eyebrow">DETAIL MONITORING KBM</span>
            <h2 :id="`monitoring-detail-title-${selectedClass.schedule_id}`">
              {{ selectedClass.class }}
            </h2>
            <p>
              {{ selectedClass.subject }} · {{ selectedClass.teacher }}
              <span v-if="selectedClass.agenda_date">
                · {{ formatHistoryDate(selectedClass.agenda_date) }}
              </span>
            </p>
          </div>
          <button
            class="modal-close-button"
            type="button"
            aria-label="Tutup detail"
            @click="closeDetails"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <div class="monitoring-modal-body">
          <div class="modal-status-row">
            <span class="status-badge" :class="selectedClass.badgeClass">{{
              selectedClass.status
            }}</span>
            <span class="status-badge badge-neutral">{{
              selectedClass.validation_status
            }}</span>
            <span class="modal-attendance-count">
              {{ selectedClass.present_count }} hadir ·
              {{ selectedClass.non_present_count }} tidak hadir
            </span>
          </div>

          <section class="modal-detail-section">
            <h3><i class="bi bi-person-x"></i> Daftar siswa tidak hadir</h3>
            <div
              v-if="selectedClass.non_present_students.length"
              class="modal-student-list"
            >
              <div
                v-for="student in selectedClass.non_present_students"
                :key="student.student_id"
                class="modal-student-row"
              >
                <span>
                  <strong>{{ student.name }}</strong>
                  <small v-if="student.nis">NIS {{ student.nis }}</small>
                </span>
                <span
                  class="status-badge"
                  :class="studentStatusClass(student.attendance_status)"
                >
                  {{ attendanceStatusLabel(student.attendance_status) }}
                </span>
              </div>
            </div>
            <p v-else class="modal-empty">
              {{
                selectedClass.validated
                  ? "Semua siswa tercatat hadir."
                  : "Belum ada data presensi siswa."
              }}
            </p>
          </section>

          <section class="modal-detail-section">
            <h3><i class="bi bi-journal-text"></i> Agenda kelas</h3>
            <div v-if="selectedClass.agenda_status" class="agenda-detail">
              <span
                class="status-badge"
                :class="selectedClass.activity_badge_class"
              >
                {{ selectedClass.activity_label }}
              </span>
              <p v-if="selectedClass.agenda_content">
                {{ selectedClass.agenda_content }}
              </p>
              <p v-else class="modal-empty">
                Tidak ada materi untuk status kelas ini.
              </p>
              <small v-if="selectedClass.agenda_updated_at">
                Disimpan
                {{ formatUpdatedAt(selectedClass.agenda_updated_at) }} WIB
              </small>
            </div>
            <p v-else class="modal-empty">Guru belum mengisi agenda kelas.</p>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { getClasses, getClassScheduleHistory } from "@/services/api";
import { applicationClock } from "@/services/applicationClock";

const route = useRoute();
const props = defineProps({
  mode: {
    type: String,
    default: "realtime",
    validator: (value) => ["realtime", "history"].includes(value),
  },
});
const routeBase = computed(() =>
  route.path.startsWith("/kepala-sekolah/")
    ? "/kepala-sekolah/kbm"
    : "/penanggung-jawab/kbm",
);

const monitoringData = ref([]);
const totalClasses = ref(0);
const loading = ref(false);
const currentTime = ref("");
const lastUpdated = ref("");
const loadError = ref("");
const selectedClass = ref(null);
const historyData = ref([]);
const historyOptions = ref({ classes: [], teachers: [] });
const historyOptionsLoading = ref(false);
const historyOptionsLoaded = ref(false);
const historyLoading = ref(false);
const historyError = ref("");
const exportingHistory = ref(false);
const exportError = ref("");
const todayDate = computed(getTodayDateKey);
const historyQuery = ref({
  class_id: "",
  teacher_id: "",
  start_date: getMonthStartDate(todayDate.value),
  end_date: todayDate.value,
});
watch(todayDate, (date, previousDate) => {
  if (historyQuery.value.end_date === previousDate) {
    historyQuery.value.end_date = date;
  }
  if (historyQuery.value.start_date === getMonthStartDate(previousDate)) {
    historyQuery.value.start_date = getMonthStartDate(date);
  }
  if (props.mode === "history" && !historyOptionsLoaded.value && !historyLoading.value) {
    loadHistory();
  }
});
const hasHistoryFilter = computed(() =>
  Boolean(
    historyQuery.value.start_date &&
    historyQuery.value.end_date &&
    historyQuery.value.start_date <= historyQuery.value.end_date &&
    historyQuery.value.end_date <= todayDate.value &&
    (historyQuery.value.class_id || historyQuery.value.teacher_id),
  ),
);

let interval = null;

function formatWibTime(date = applicationClock.currentTime) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

const loadMonitoring = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const data = await getClasses();

    monitoringData.value = data?.data || [];
    totalClasses.value = data?.total || 0;
    lastUpdated.value = formatWibTime();
    loadError.value = "";
  } catch (error) {
    console.error("Gagal memuat monitoring kelas:", error);
    monitoringData.value = [];
    totalClasses.value = 0;
    loadError.value = `Gagal memperbarui monitoring kelas: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

const colorStyles = {
  green: {
    badgeClass: "badge-success",
    statusClass: "icon-success",
    icon: "bi bi-check-circle-fill",
  },
  yellow: {
    badgeClass: "badge-warning",
    statusClass: "icon-warning",
    icon: "bi bi-journal-check",
  },
  red: {
    badgeClass: "badge-danger",
    statusClass: "icon-danger",
    icon: "bi bi-x-circle-fill",
  },
  blue: {
    badgeClass: "badge-blue",
    statusClass: "icon-blue",
    icon: "bi bi-info-circle-fill",
  },
};

function normalizeMonitoringItem(item) {
  const color = colorStyles[item.color] ? item.color : "blue";
  const activityLabels = {
    teaching: "Mengajar",
    assignment: "Tugas",
    empty: "Kelas Kosong",
  };
  const activityColor =
    {
      teaching: "green",
      assignment: "yellow",
      empty: "red",
    }[item.activity_status] || "blue";

  return {
    ...item,
    class: item.class_name,
    teacher: item.teacher_name,
    subject: item.subject_name,
    room: item.classroom_name || "-",
    start: formatTime(item.start),
    end: formatTime(item.end),
    status: item.status || "Belum divalidasi",
    validation_status: item.validation_status || "Belum divalidasi",
    activity_label: activityLabels[item.activity_status] || "Belum divalidasi",
    activity_badge_class: colorStyles[activityColor].badgeClass,
    present_count: Number(item.present_count) || 0,
    non_present_count: Number(item.non_present_count) || 0,
    non_present_students: item.non_present_students || [],
    validated: item.validated === true,
    badgeClass: colorStyles[color].badgeClass,
    statusClass: colorStyles[color].statusClass,
    icon: colorStyles[color].icon,
    color,
  };
}

const allClasses = computed(() =>
  monitoringData.value.map(normalizeMonitoringItem),
);
const historyClasses = computed(() =>
  historyData.value.map(normalizeMonitoringItem),
);

const emptyClasses = computed(
  () =>
    allClasses.value.filter((item) => item.status === "Kelas Kosong").length,
);

const unvalidatedCount = computed(
  () =>
    allClasses.value.filter(
      (item) => !item.validated && item.status !== "Kelas Kosong",
    ).length,
);

const occupiedClasses = computed(
  () =>
    allClasses.value.filter(
      (item) => item.validated && item.activity_status !== "empty",
    ).length,
);

const occupancyPercent = computed(() => {
  if (!totalClasses.value) return 0;

  return Math.round((occupiedClasses.value / totalClasses.value) * 100);
});

function formatTime(value) {
  return value ? String(value).slice(0, 5) : "--:--";
}

function getTodayDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(applicationClock.currentTime);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function getMonthStartDate(date) {
  return `${date.slice(0, 7)}-01`;
}

function sanitizeFilenameSegment(value) {
  return (
    String(value)
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[.-]+|[.-]+$/g, "")
      .slice(0, 80) || "terpilih"
  );
}

function formatHistoryDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

async function loadHistory() {
  if (historyLoading.value) return;
  const requestedEndDate = historyQuery.value.end_date;
  historyLoading.value = true;
  if (!historyOptionsLoaded.value) historyOptionsLoading.value = true;
  historyError.value = "";
  try {
    const result = await getClassScheduleHistory(historyQuery.value);
    historyData.value = result?.data || [];
    historyOptions.value = result?.filters || { classes: [], teachers: [] };
    historyOptionsLoaded.value = true;
  } catch (error) {
    console.error("Gagal memuat riwayat keterisian kelas:", error);
    historyData.value = [];
    historyError.value = `Riwayat keterisian kelas gagal dimuat: ${error.message}`;
  } finally {
    historyLoading.value = false;
    historyOptionsLoading.value = false;
    if (
      !historyOptionsLoaded.value &&
      requestedEndDate !== historyQuery.value.end_date
    ) {
      loadHistory();
    }
  }
}

async function exportHistory() {
  if (!historyClasses.value.length || exportingHistory.value) return;
  exportingHistory.value = true;
  exportError.value = "";

  try {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIKAP";
    workbook.subject = "Laporan riwayat keterisian kelas";
    workbook.title = "Riwayat Keterisian Kelas";
    workbook.created = applicationClock.currentTime;
    const createdAtWib = `${new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Jakarta",
    }).format(applicationClock.currentTime)} WIB`;

    const summarySheet = workbook.addWorksheet("Ringkasan", {
      views: [{ state: "frozen", ySplit: 4 }],
    });
    summarySheet.columns = [
      { header: "Informasi", key: "label", width: 30 },
      { header: "Nilai", key: "value", width: 42 },
    ];
    summarySheet.mergeCells("A1:B1");
    summarySheet.getCell("A1").value = "LAPORAN RIWAYAT KETERISIAN KELAS";
    summarySheet.getCell("A1").font = {
      name: "Arial",
      size: 16,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    summarySheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF17365D" },
    };
    summarySheet.getRow(1).height = 30;
    summarySheet.addRow([]);
    summarySheet.addRows([
      [
        "Periode",
        `${historyQuery.value.start_date} s.d. ${historyQuery.value.end_date}`,
      ],
      [
        "Filter kelas",
        historyQuery.value.class_id
          ? historyOptions.value.classes.find(
              (item) => String(item.id) === historyQuery.value.class_id,
            )?.name || "Kelas terpilih"
          : "Semua kelas",
      ],
      [
        "Filter guru",
        historyQuery.value.teacher_id
          ? historyOptions.value.teachers.find(
              (item) => String(item.id) === historyQuery.value.teacher_id,
            )?.name || "Guru terpilih"
          : "Semua guru",
      ],
      ["Jumlah jadwal", historyClasses.value.length],
      [
        "Tervalidasi",
        historyClasses.value.filter((item) => item.validated).length,
      ],
      [
        "Kelas kosong",
        historyClasses.value.filter((item) => item.status === "Kelas Kosong")
          .length,
      ],
      [
        "Total siswa hadir",
        historyClasses.value.reduce((sum, item) => sum + item.present_count, 0),
      ],
      [
        "Total siswa tidak hadir",
        historyClasses.value.reduce(
          (sum, item) => sum + item.non_present_count,
          0,
        ),
      ],
      ["Dibuat pada", createdAtWib],
    ]);
    summarySheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        row.getCell(1).font = {
          name: "Arial",
          bold: true,
          color: { argb: "FF17365D" },
        };
        row.getCell(2).font = { name: "Arial", color: { argb: "FF1F2937" } };
        row.eachCell((cell) => {
          cell.border = {
            bottom: { style: "thin", color: { argb: "FFD9E2F3" } },
          };
        });
      }
    });

    const historySheet = workbook.addWorksheet("Riwayat Kelas", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    historySheet.columns = [
      { header: "Tanggal", key: "date", width: 16 },
      { header: "Mulai", key: "start", width: 12 },
      { header: "Selesai", key: "end", width: 12 },
      { header: "Kelas", key: "class", width: 20 },
      { header: "Guru", key: "teacher", width: 28 },
      { header: "Mata Pelajaran", key: "subject", width: 30 },
      { header: "Ruang", key: "room", width: 16 },
      { header: "Status Kelas", key: "status", width: 20 },
      { header: "Status Validasi", key: "validation", width: 20 },
      { header: "Jumlah Siswa", key: "students", width: 15 },
      { header: "Hadir", key: "present", width: 12 },
      { header: "Tidak Hadir", key: "nonPresent", width: 15 },
      { header: "Agenda", key: "agenda", width: 55 },
    ];
    historyClasses.value.forEach((item) => {
      historySheet.addRow({
        date: new Date(`${item.agenda_date}T00:00:00.000Z`),
        start: item.start,
        end: item.end,
        class: item.class,
        teacher: item.teacher,
        subject: item.subject,
        room: item.room,
        status: item.status,
        validation: item.validation_status,
        students: Number(item.student_count) || 0,
        present: item.present_count,
        nonPresent: item.non_present_count,
        agenda: item.agenda_content || "-",
      });
    });
    historySheet.getColumn("date").numFmt = "dd mmm yyyy";
    historySheet.autoFilter = {
      from: "A1",
      to: "M1",
    };
    historySheet.eachRow((row, rowNumber) => {
      row.height = rowNumber === 1 ? 28 : 36;
      row.alignment = { vertical: "middle", wrapText: rowNumber > 1 };
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFD9E2F3" } },
        };
        if (rowNumber === 1) {
          cell.font = {
            name: "Arial",
            bold: true,
            color: { argb: "FFFFFFFF" },
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF1F4E78" },
          };
        } else {
          cell.font = { name: "Arial", size: 10, color: { argb: "FF1F2937" } };
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF3F6FA" },
            };
          }
        }
      });
    });

    const absentSheet = workbook.addWorksheet("Detail Tidak Hadir", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    absentSheet.columns = [
      { header: "Tanggal", key: "date", width: 16 },
      { header: "Kelas", key: "class", width: 20 },
      { header: "Guru", key: "teacher", width: 28 },
      { header: "Mata Pelajaran", key: "subject", width: 30 },
      { header: "Nama Siswa", key: "student", width: 32 },
      { header: "NIS", key: "nis", width: 18 },
      { header: "Keterangan", key: "status", width: 18 },
    ];
    historyClasses.value.forEach((item) => {
      item.non_present_students.forEach((student) => {
        absentSheet.addRow({
          date: new Date(`${item.agenda_date}T00:00:00.000Z`),
          class: item.class,
          teacher: item.teacher,
          subject: item.subject,
          student: student.name,
          nis: student.nis || "-",
          status: attendanceStatusLabel(student.attendance_status),
        });
      });
    });
    absentSheet.getColumn("date").numFmt = "dd mmm yyyy";
    absentSheet.autoFilter = { from: "A1", to: "G1" };
    absentSheet.eachRow((row, rowNumber) => {
      row.height = 26;
      row.alignment = { vertical: "middle", wrapText: true };
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFD9E2F3" } },
        };
        if (rowNumber === 1) {
          cell.font = {
            name: "Arial",
            bold: true,
            color: { argb: "FFFFFFFF" },
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF1F4E78" },
          };
        } else {
          cell.font = { name: "Arial", size: 10, color: { argb: "FF1F2937" } };
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF3F6FA" },
            };
          }
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filenameParts = ["riwayat-keterisian-kelas"];
    if (historyQuery.value.teacher_id) {
      const teacherName =
        historyOptions.value.teachers.find(
          (item) => String(item.id) === historyQuery.value.teacher_id,
        )?.name || "guru-terpilih";
      filenameParts.push(`guru-${sanitizeFilenameSegment(teacherName)}`);
    }
    if (historyQuery.value.class_id) {
      const className =
        historyOptions.value.classes.find(
          (item) => String(item.id) === historyQuery.value.class_id,
        )?.name || "kelas-terpilih";
      filenameParts.push(`kelas-${sanitizeFilenameSegment(className)}`);
    }
    filenameParts.push(
      historyQuery.value.start_date,
      historyQuery.value.end_date,
    );
    link.download = `${filenameParts.join("-")}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal mengekspor laporan riwayat keterisian kelas:", error);
    exportError.value = `Laporan Excel gagal dibuat: ${error.message}`;
  } finally {
    exportingHistory.value = false;
  }
}

function attendanceStatusLabel(status) {
  return (
    { permission: "Izin", sick: "Sakit", absent: "Alfa" }[status] ||
    "Tidak hadir"
  );
}

function studentStatusClass(status) {
  return (
    {
      permission: "badge-warning",
      sick: "badge-blue",
      absent: "badge-danger",
    }[status] || "badge-neutral"
  );
}

function openDetails(item) {
  selectedClass.value = item;
}

function closeDetails() {
  selectedClass.value = null;
}

function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function handleEscape(event) {
  if (event.key === "Escape") closeDetails();
}

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
  if (props.mode === "realtime") {
    currentTime.value = formatWibTime();
    loadMonitoring();
    interval = setInterval(() => {
      currentTime.value = formatWibTime();
      loadMonitoring();
    }, 15000);
  }
  if (props.mode === "history") loadHistory();
});

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
  window.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.kbm-mobile-tabs {
  display: none;
}

.kbm-mobile-tabs a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 0.75rem;
  text-align: left;
  text-decoration: none;
}

.kbm-mobile-tabs a.router-link-active {
  border-color: rgba(74, 222, 128, 0.25);
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
}

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
.problem-wrapper,
.history-wrapper {
  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.05);

  border-radius: 20px;

  padding: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
}

.history-filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr)) auto;
  align-items: end;
  gap: 10px;
}

.history-header .export-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.history-filters label {
  display: grid;
  min-width: 0;
  gap: 6px;
  color: #94a3b8;
  font-size: 11px;
}

.history-filters select,
.history-filters input {
  width: 100%;
  min-height: 38px;
  padding: 7px 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 9px;
  background: #0b1b2e;
  color: #e2e8f0;
  color-scheme: dark;
  font-size: 12px;
}

.history-filter-button,
.history-detail-button {
  min-height: 38px;
  padding: 7px 12px;
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 9px;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.history-filter-button:disabled {
  opacity: 0.65;
}

.history-list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.history-row {
  display: grid;
  grid-template-columns: 115px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
}

.history-date strong,
.history-date span,
.history-description strong,
.history-description span,
.history-description small {
  display: block;
}

.history-date strong,
.history-description strong {
  color: #f1f5f9;
  font-size: 12px;
}

.history-date span,
.history-description span,
.history-description small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 11px;
}

.history-description {
  min-width: 0;
}

.history-description span,
.history-description strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-detail-button {
  min-height: 32px;
  border-color: rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
}

.history-detail-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.history-empty {
  padding: 28px 8px 8px;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.card-title {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.card-subtitle {
  color: #ffffff;
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

.problem-card.blue {
  border-left: 4px solid #3b82f6;
  background: rgba(255, 255, 255, 0.03);
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
  color: #ffffff;

  font-size: 12px;

  margin-bottom: 12px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-info {
  color: #ffffff;

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

.attendance-counts {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 12px 0;
  color: #cbd5e1;
  font-size: 11px;
}

.attendance-counts strong {
  color: #fff;
}

.detail-button {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
}

.detail-button:hover {
  background: rgba(246, 243, 243, 0.1);
}

.monitoring-modal-backdrop {
  position: fixed;
  z-index: 1055;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 6, 23, 0.78);
}

.monitoring-modal {
  width: min(680px, 100%);
  max-height: min(85vh, 760px);
  overflow: auto;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  background: #0b1b2e;
  color: #e2e8f0;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
}

.monitoring-modal-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  background: #0b1b2e;
}

.modal-eyebrow {
  color: #60a5fa;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.monitoring-modal-header h2 {
  margin: 6px 0 2px;
  color: #fff;
  font-size: 21px;
}

.monitoring-modal-header p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.modal-close-button {
  align-self: flex-start;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

.monitoring-modal-body {
  display: grid;
  gap: 20px;
  padding: 20px 24px 24px;
}

.modal-status-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.modal-attendance-count {
  margin-left: auto;
  color: #cbd5e1;
  font-size: 12px;
}

.modal-detail-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: #fff;
  font-size: 14px;
}

.modal-student-list {
  display: grid;
  gap: 8px;
}

.modal-student-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.modal-student-row strong,
.modal-student-row small {
  display: block;
}

.modal-student-row strong {
  color: #f8fafc;
  font-size: 13px;
}

.modal-student-row small,
.agenda-detail small {
  color: #94a3b8;
  font-size: 11px;
}

.agenda-detail {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.agenda-detail p {
  margin: 10px 0 8px;
  color: #e2e8f0;
  white-space: pre-wrap;
}

.modal-empty {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
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
  .kbm-mobile-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 8px 0 16px;
  }

  .history-wrapper {
    padding: 16px;
  }

  .history-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .history-filter-button {
    grid-column: 1 / -1;
  }

  .history-header {
    align-items: flex-start;
  }

  .history-header .export-button {
    padding: 7px 9px;
    font-size: 11px;
  }

  .history-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 12px;
  }

  .history-date {
    grid-column: 1;
  }

  .history-row > .status-badge {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }

  .history-description {
    grid-column: 1;
  }

  .history-detail-button {
    grid-column: 2;
    grid-row: 2;
  }

  .monitoring-modal-backdrop {
    padding: 10px;
  }

  .monitoring-modal-header,
  .monitoring-modal-body {
    padding-right: 16px;
    padding-left: 16px;
  }

  .attendance-counts {
    flex-direction: column;
  }

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
