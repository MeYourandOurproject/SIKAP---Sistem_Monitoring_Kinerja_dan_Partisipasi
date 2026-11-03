<template>
  <section class="teacher-schedule">
    <!-- <RouterLink to="/guru/dashboard" class="back-link">
        <i class="bi bi-arrow-left"></i>
        Dashboard
      </RouterLink> -->
    <div class="page-heading">
      <div>
        <span>AKADEMIK</span>
        <h1>Jadwal Mengajar</h1>
        <p>Jadwal kelas dan mata pelajaran yang menjadi tanggung jawab Anda.</p>
      </div>
      
    </div>

    <div v-if="loading" class="state-card">
      <span class="spinner-border spinner-border-sm text-success" role="status"></span>
      Memuat jadwal...
    </div>
    <div v-else-if="errorMessage" class="state-card error-state" role="alert">
      <i class="bi bi-exclamation-circle"></i>
      {{ errorMessage }}
    </div>
    <div v-else class="schedule-content">
      <!-- <p class="today-label">{{ formattedToday }}</p> -->

      <section class="realtime-card">
        <div class="realtime-clock">
          <div class="live-indicator" :class="{ simulated: isClockSimulated }">
            <span></span> {{ isClockSimulated ? "SIMULASI WIB" : "REALTIME WIB" }}
          </div>
          <strong>{{ currentTimeLabel }}</strong>
          <span>{{ formattedToday }}</span>
          <div class="clock-simulation">
            <label class="simulation-toggle">
              <input v-model="isClockSimulated" type="checkbox" @change="toggleClockSimulation">
              <span>Simulasikan jam</span>
            </label>
            <label v-if="isClockSimulated" class="simulation-time-field">
              <span>Atur jam untuk mencoba jadwal</span>
              <input v-model="simulatedTime" type="time" aria-label="Atur jam simulasi">
            </label>
          </div>
        </div>
        <div class="realtime-summary">
          <template v-if="activeSchedules.length">
            <span class="summary-label">Jadwal sedang berlangsung</span>
            <div v-for="schedule in activeSchedules" :key="schedule.id" class="active-schedule">
              <strong>{{ schedule.Subject?.subject_name || "Mata pelajaran" }}</strong>
              <span>{{ schedule.Class?.class_name || "Kelas" }}</span>
            </div>
          </template>
          <template v-else>
            <span class="summary-label">Tidak ada jadwal yang sedang berlangsung</span>
            <span class="summary-hint">Status jadwal hari ini akan berubah otomatis mengikuti waktu.</span>
          </template>
        </div>
      </section>

      <div class="row g-3">
        <div class="col-6 col-xl-4">
          <article class="stat-card">
            <div class="stat-icon blue"><i class="bi bi-journal-bookmark"></i></div>
            <div>
              <strong>{{ schedules.length }}</strong>
              <span>Total Jadwal Mengajar</span>
            </div>
          </article>
        </div>
        <div class="col-6 col-xl-4">
          <article class="stat-card">
            <div class="stat-icon green"><i class="bi bi-calendar-check"></i></div>
            <div>
              <strong>{{ todaySchedules.length }}</strong>
              <span>Jadwal Hari Ini</span>
            </div>
          </article>
        </div>
        <div class="col-12 col-xl-4">
          <article class="stat-card">
            <div class="stat-icon orange"><i class="bi bi-people"></i></div>
            <div>
              <strong>{{ classCount }}</strong>
              <span>Kelas Diampu</span>
            </div>
          </article>
        </div>
      </div>

      <section class="today-card">
        <header class="section-header">
          <div>
            <h2>Jadwal Hari Ini</h2>
            <p>Pilih jadwal untuk melihat presensi siswa dan agenda kelas. Input hanya aktif saat jadwal berlangsung.</p>
          </div>
        </header>
        <div v-if="todaySchedules.length" class="today-list class-input-list">
          <article
            v-for="schedule in todaySchedules"
            :key="`input-${schedule.id}`"
            class="class-input-card"
          >
            <header class="class-input-heading">
              <div>
                <span>{{ formatTime(schedule.startTimeslot?.start) }}–{{ formatTime(schedule.endTimeslot?.end) }}</span>
                <h3>{{ schedule.Subject?.subject_name || "Mata pelajaran" }}</h3>
                <p>{{ schedule.Class?.class_name || "Kelas" }} · {{ schedule.Classroom?.classroom_name || "Ruang belum diatur" }}</p>
              </div>
              <div class="schedule-actions">
                <span class="schedule-status" :class="scheduleStatus(schedule).key">
                  {{ scheduleStatus(schedule).label }}
                </span>
                <button
                  class="details-toggle"
                  type="button"
                  :aria-expanded="isScheduleExpanded(schedule)"
                  :aria-controls="`schedule-details-${schedule.id}`"
                  @click="toggleScheduleDetails(schedule)"
                >
                  <i class="bi" :class="isScheduleExpanded(schedule) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  {{ isScheduleExpanded(schedule) ? "Tutup detail" : "Lihat presensi & agenda" }}
                </button>
              </div>
            </header>

            <div
              v-if="isScheduleExpanded(schedule)"
              :id="`schedule-details-${schedule.id}`"
              class="schedule-detail-content"
            >
              <div v-if="!isScheduleActive(schedule)" class="inactive-notice" role="status">
                <i class="bi bi-lock"></i>
                <span>
                  <strong>Input sedang dikunci.</strong>
                  Presensi dan agenda hanya dapat diisi saat jadwal berlangsung.
                </span>
              </div>

              <div class="class-input-grid" :class="{ 'inputs-locked': !isScheduleActive(schedule) }">
              <section class="input-panel attendance-panel">
                <div class="input-panel-heading">
                  <div>
                    <h4>Presensi Siswa</h4>
                    <p>
                      {{ attendanceFor(schedule.id).loading
                        ? "Memuat daftar siswa..."
                        : `${attendanceFor(schedule.id).students.length} siswa aktif di kelas ini` }}
                    </p>
                  </div>
                  <i class="bi bi-person-check"></i>
                </div>
                <div class="attendance-toolbar">
                  <button
                    class="attendance-collapse-button"
                    type="button"
                    :aria-expanded="!attendanceFor(schedule.id).listCollapsed"
                    :aria-controls="`attendance-list-${schedule.id}`"
                    @click="toggleAttendanceList(schedule.id)"
                  >
                    <i
                      class="bi"
                      :class="attendanceFor(schedule.id).listCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'"
                    ></i>
                    {{ attendanceFor(schedule.id).listCollapsed ? "Tampilkan daftar" : "Ciutkan daftar" }}
                  </button>
                  <button
                    class="save-button"
                    type="button"
                    :disabled="
                      !canEditAttendance(schedule) ||
                      attendanceFor(schedule.id).loading ||
                      attendanceFor(schedule.id).saving ||
                      !isAttendanceComplete(schedule.id)
                    "
                    @click="saveAttendance(schedule)"
                  >
                    <span v-if="attendanceFor(schedule.id).saving" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-save me-1"></i>
                    {{ attendanceFor(schedule.id).saving ? "Menyimpan..." : "Simpan presensi" }}
                  </button>
                </div>
                <div
                  v-if="
                    attendanceFor(schedule.id).listCollapsed &&
                    !attendanceFor(schedule.id).loading &&
                    !attendanceFor(schedule.id).error &&
                    attendanceFor(schedule.id).students.length
                  "
                  class="attendance-summary"
                >
                  <div class="attendance-summary-count">
                    <i class="bi bi-person-check"></i>
                    <strong>{{ presentStudentCount(schedule.id) }}</strong>
                    <span>dari {{ attendanceFor(schedule.id).students.length }} siswa hadir</span>
                  </div>
                  <div v-if="nonPresentStudents(schedule.id).length" class="non-present-summary">
                    <h5>
                      <i class="bi bi-person-exclamation"></i>
                      Belum hadir / tidak hadir ({{ nonPresentStudents(schedule.id).length }})
                    </h5>
                    <ul>
                      <li
                        v-for="student in nonPresentStudents(schedule.id)"
                        :key="student.id"
                      >
                        <strong>{{ student.name }}</strong>
                        <span>{{ attendanceStatusLabel(attendanceFor(schedule.id).drafts[student.id]) }}</span>
                      </li>
                    </ul>
                  </div>
                  <p v-else class="all-present-summary">
                    Semua siswa tercatat hadir.
                  </p>
                </div>
                <div v-if="attendanceFor(schedule.id).error" class="attendance-feedback error" role="alert">
                  {{ attendanceFor(schedule.id).error }}
                </div>
                <div v-else-if="attendanceFor(schedule.id).loading" class="attendance-empty">
                  <span class="spinner-border spinner-border-sm text-success" role="status"></span>
                  Memuat daftar siswa dan presensi...
                </div>
                <div
                  v-else-if="attendanceFor(schedule.id).students.length === 0"
                  class="attendance-empty"
                >
                  Belum ada siswa aktif pada kelas ini.
                </div>
                <div
                  v-if="!attendanceFor(schedule.id).listCollapsed"
                  :id="`attendance-list-${schedule.id}`"
                >
                  <label
                    v-if="attendanceFor(schedule.id).students.length"
                    class="attendance-search"
                  >
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <input
                      v-model.trim="attendanceFor(schedule.id).searchQuery"
                      type="search"
                      placeholder="Cari nama atau NIS siswa..."
                      :aria-label="`Cari siswa kelas ${schedule.Class?.class_name || ''}`"
                    >
                  </label>
                  <div class="attendance-list">
                    <label
                      v-for="student in filteredAttendanceStudents(schedule.id)"
                      :key="student.id"
                      class="student-attendance-row"
                    >
                      <span class="student-name">
                        <i class="bi bi-person-circle"></i>
                        <span>
                          {{ student.name }}
                          <small v-if="student.nis" class="student-identifier">NIS {{ student.nis }}</small>
                        </span>
                      </span>
                      <select
                        v-model="attendanceFor(schedule.id).drafts[student.id]"
                        :class="`attendance-select ${attendanceClass(attendanceFor(schedule.id).drafts[student.id])}`"
                        :disabled="!canEditAttendance(schedule) || attendanceFor(schedule.id).saving"
                        :aria-label="`Status presensi ${student.name}`"
                        @change="clearAttendanceFeedback(schedule.id)"
                      >
                        <option value="">Pilih status</option>
                        <option value="present">Hadir</option>
                        <option value="permission">Izin</option>
                        <option value="sick">Sakit</option>
                        <option value="absent">Alfa</option>
                      </select>
                    </label>
                  </div>
                  <div
                    v-if="
                      attendanceFor(schedule.id).students.length &&
                      !filteredAttendanceStudents(schedule.id).length
                    "
                    class="attendance-empty"
                  >
                    Siswa tidak ditemukan.
                  </div>
                </div>
                <div v-if="isClockSimulated" class="attendance-feedback info" role="status">
                  Presensi hanya dapat disimpan menggunakan waktu WIB aktual, bukan simulasi.
                </div>
                <div v-if="attendanceFor(schedule.id).success" class="attendance-feedback success" role="status">
                  {{ attendanceFor(schedule.id).success }}
                </div>
                <div v-if="attendanceFor(schedule.id).saveError" class="attendance-feedback error" role="alert">
                  {{ attendanceFor(schedule.id).saveError }}
                </div>
                <div class="attendance-actions">
                  <span v-if="!isAttendanceComplete(schedule.id) && attendanceFor(schedule.id).students.length" class="attendance-hint">
                    Pilih status untuk seluruh siswa sebelum menyimpan.
                  </span>
                </div>
              </section>

              <form class="input-panel agenda-panel" @submit.prevent="saveAgenda(schedule)">
                <div class="input-panel-heading">
                  <div>
                    <h4>Agenda Kelas</h4>
                    <p>
                      {{ agendaStates[schedule.id]?.agendaDate
                        ? `Agenda tanggal ${formatAgendaDate(agendaStates[schedule.id].agendaDate)}`
                        : "Materi dan catatan pembelajaran" }}
                    </p>
                  </div>
                  <i class="bi bi-journal-text"></i>
                </div>
                <div v-if="agendaStates[schedule.id]?.loading" class="attendance-empty">
                  <span class="spinner-border spinner-border-sm text-success" role="status"></span>
                  Memuat agenda kelas...
                </div>
                <div v-if="agendaStates[schedule.id]?.error" class="attendance-feedback error" role="alert">
                  {{ agendaStates[schedule.id].error }}
                </div>
                <label class="form-field">
                  <span>Status pembelajaran</span>
                  <select
                    v-model="agendaDrafts[schedule.id].activity_status"
                    :disabled="!canEditAgenda(schedule) || agendaStates[schedule.id]?.loading || agendaStates[schedule.id]?.saving"
                  >
                    <option value="teaching">Mengajar</option>
                    <option value="assignment">Tugas</option>
                    <option value="empty">Kelas kosong</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Materi / agenda</span>
                  <textarea
                    v-model.trim="agendaDrafts[schedule.id].content"
                    :disabled="!canEditAgenda(schedule) || agendaStates[schedule.id]?.loading || agendaStates[schedule.id]?.saving"
                    rows="3"
                    placeholder="Tuliskan materi atau agenda pembelajaran..."
                    maxlength="10000"
                    :required="agendaDrafts[schedule.id].activity_status !== 'empty'"
                  ></textarea>
                  <small class="form-hint">
                    {{ agendaDrafts[schedule.id].content.length }}/10000 karakter
                  </small>
                </label>
                <div v-if="!canEditAgenda(schedule)" class="attendance-feedback info" role="status">
                  Agenda hanya dapat disimpan saat jadwal berlangsung pada waktu WIB aktual.
                </div>
                <div v-if="agendaStates[schedule.id]?.saveError" class="attendance-feedback error" role="alert">
                  {{ agendaStates[schedule.id].saveError }}
                </div>
                <div v-if="agendaStates[schedule.id]?.success" class="attendance-feedback success" role="status">
                  {{ agendaStates[schedule.id].success }}
                </div>
                <div class="draft-actions">
                  <button
                    class="save-button"
                    type="submit"
                    :disabled="
                      !canEditAgenda(schedule) ||
                      agendaStates[schedule.id]?.loading ||
                      agendaStates[schedule.id]?.saving ||
                      (agendaDrafts[schedule.id].activity_status !== 'empty' && !agendaDrafts[schedule.id].content.trim())
                    "
                  >
                    <span v-if="agendaStates[schedule.id]?.saving" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-cloud-check me-1"></i>
                    {{ agendaStates[schedule.id]?.saving ? "Menyimpan..." : "Simpan agenda kelas" }}
                  </button>
                  <span v-if="agendaStates[schedule.id]?.updatedAt" class="draft-note">
                    Terakhir disimpan {{ formatAgendaTime(agendaStates[schedule.id].updatedAt) }}
                  </span>
                </div>
              </form>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="today-empty">
          <i class="bi bi-cup-hot"></i>
          Tidak ada jadwal mengajar hari ini.
        </div>
      </section>

      <section class="weekly-schedules">
        <header class="section-header">
          <div>
            <h2>Jadwal Mengajar Setiap Hari</h2>
            <p>Jadwal kelas dan mata pelajaran yang menjadi tanggung jawab Anda.</p>
          </div>
        </header>
        <div v-if="daysWithSchedules.length" class="day-list">
          <section v-for="day in daysWithSchedules" :key="day.name" class="day-card">
            <header>
              <h2>{{ day.name }}</h2>
              <span>{{ day.items.length }} kelas</span>
            </header>
            <article v-for="schedule in day.items" :key="schedule.id" class="schedule-row">
              <div class="time">
                <strong>{{ formatTime(schedule.startTimeslot?.start) }}</strong>
                <span>{{ formatTime(schedule.endTimeslot?.end) }}</span>
              </div>
              <div class="details">
                <h3>{{ schedule.Subject?.subject_name || "Mata pelajaran" }}</h3>
                <p>
                  <span><i class="bi bi-people"></i> {{ schedule.Class?.class_name || "Kelas" }}</span>
                  <span><i class="bi bi-geo-alt"></i> {{ schedule.Classroom?.classroom_name || "Ruang belum diatur" }}</span>
                </p>
              </div>
            </article>
          </section>
        </div>
        <div v-else class="weekly-empty">
          Jadwal mengajar untuk akun ini belum tercatat.
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
  getTeacherScheduleAgenda,
  getTeacherScheduleAttendance,
  getTeacherSchedules,
  saveTeacherScheduleAgenda,
  saveTeacherScheduleAttendance,
} from "@/services/api";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const schedules = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const now = ref(new Date());
const agendaDrafts = ref({});
const agendaStates = ref({});
const attendanceBySchedule = ref({});
const expandedScheduleDetails = ref({});
const isClockSimulated = ref(false);
const simulatedTime = ref("");
const attendanceStateDefaults = () => ({
  loading: false,
  saving: false,
  error: "",
  saveError: "",
  success: "",
  students: [],
  drafts: {},
  searchQuery: "",
  listCollapsed: false,
});
let clockInterval;

const todayName = computed(() => new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  timeZone: "Asia/Jakarta",
}).format(now.value));
const formattedToday = computed(
  () =>
    new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(now.value),
);
const currentTimeLabel = computed(() =>
  isClockSimulated.value
    ? `${simulatedTime.value || getCurrentWibTime()}:00`
    : new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Jakarta",
    }).format(now.value),
);
const currentMinutes = computed(() => parseTime(
  isClockSimulated.value ? simulatedTime.value : getCurrentWibTime(),
));
const todaySchedules = computed(() =>
  schedules.value
    .filter((schedule) => schedule.day === todayName.value)
    .sort((a, b) => scheduleStartMinutes(a) - scheduleStartMinutes(b)),
);
const activeSchedules = computed(() =>
  todaySchedules.value.filter((schedule) => scheduleStatus(schedule).key === "ongoing"),
);
const actualActiveScheduleIds = computed(() =>
  todaySchedules.value
    .filter(isActualScheduleActive)
    .map((schedule) => schedule.id)
    .join(","),
);
const classCount = computed(
  () => new Set(schedules.value.map((schedule) => schedule.class_id)).size,
);
const daysWithSchedules = computed(() =>
  days
    .map((name) => ({
      name,
      items: schedules.value.filter((schedule) => schedule.day === name),
    }))
    .filter((day) => day.items.length),
);

function formatTime(value) {
  return value ? value.slice(0, 5) : "--:--";
}

function scheduleStartMinutes(schedule) {
  return parseTime(schedule.startTimeslot?.start);
}

function parseTime(value) {
  if (!value) return null;
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function getCurrentWibTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(now.value);
}

function toggleClockSimulation() {
  if (isClockSimulated.value) {
    simulatedTime.value = getCurrentWibTime();
  }
}

function scheduleStatus(schedule) {
  const start = parseTime(schedule.startTimeslot?.start);
  const end = parseTime(schedule.endTimeslot?.end);
  if (start === null || end === null || end <= start) {
    return { key: "unknown", label: "Waktu belum diatur" };
  }

  if (currentMinutes.value === null) {
    return { key: "unknown", label: "Atur jam simulasi" };
  }

  if (currentMinutes.value < start) return { key: "upcoming", label: "Akan datang" };
  if (currentMinutes.value < end) return { key: "ongoing", label: "Sedang berlangsung" };
  return { key: "finished", label: "Selesai" };
}

function isScheduleActive(schedule) {
  return schedule.day === todayName.value && scheduleStatus(schedule).key === "ongoing";
}

function isActualScheduleActive(schedule) {
  const start = parseTime(schedule.startTimeslot?.start);
  const end = parseTime(schedule.endTimeslot?.end);
  const current = parseTime(getCurrentWibTime());
  return (
    schedule.day === todayName.value &&
    start !== null &&
    end !== null &&
    current !== null &&
    current >= start &&
    current < end
  );
}

function canEditAttendance(schedule) {
  return !isClockSimulated.value && isActualScheduleActive(schedule);
}

function canEditAgenda(schedule) {
  return !isClockSimulated.value && isActualScheduleActive(schedule);
}

function agendaStateFor(scheduleId) {
  if (!agendaStates.value[scheduleId]) {
    agendaStates.value[scheduleId] = {
      loading: false,
      saving: false,
      loaded: false,
      error: "",
      saveError: "",
      success: "",
      agendaDate: "",
      updatedAt: "",
    };
  }
  return agendaStates.value[scheduleId];
}

function formatAgendaDate(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatAgendaTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function clearAgendaFeedback(scheduleId) {
  const state = agendaStateFor(scheduleId);
  state.success = "";
  state.saveError = "";
}

function isScheduleExpanded(schedule) {
  return Boolean(expandedScheduleDetails.value[schedule.id]);
}

function attendanceFor(scheduleId) {
  if (!attendanceBySchedule.value[scheduleId]) {
    attendanceBySchedule.value[scheduleId] = attendanceStateDefaults();
  }
  return attendanceBySchedule.value[scheduleId];
}

function filteredAttendanceStudents(scheduleId) {
  const state = attendanceFor(scheduleId);
  const query = state.searchQuery.toLocaleLowerCase("id-ID");
  if (!query) return state.students;
  return state.students.filter((student) =>
    [student.name, student.nis, student.nisn]
      .some((value) => String(value || "").toLocaleLowerCase("id-ID").includes(query)),
  );
}

function toggleScheduleDetails(schedule) {
  expandedScheduleDetails.value[schedule.id] = !isScheduleExpanded(schedule);
  if (isScheduleExpanded(schedule)) {
    loadScheduleAgenda(schedule);
    if (isActualScheduleActive(schedule)) loadScheduleAttendance(schedule);
  }
}

function toggleAttendanceList(scheduleId) {
  const state = attendanceFor(scheduleId);
  state.listCollapsed = !state.listCollapsed;
}

function attendanceClass(status) {
  return {
    "": "pending",
    present: "present",
    permission: "excused",
    sick: "sick",
    absent: "absent",
  }[status] || "pending";
}

function isAttendanceComplete(scheduleId) {
  const state = attendanceFor(scheduleId);
  return state.students.length > 0 &&
    state.students.every((student) => Boolean(state.drafts[student.id]));
}

function presentStudentCount(scheduleId) {
  const state = attendanceFor(scheduleId);
  return state.students.filter((student) => state.drafts[student.id] === "present").length;
}

function nonPresentStudents(scheduleId) {
  const state = attendanceFor(scheduleId);
  return state.students.filter((student) => state.drafts[student.id] !== "present");
}

function attendanceStatusLabel(status) {
  return {
    permission: "Izin",
    sick: "Sakit",
    absent: "Alfa",
    "": "Belum diisi",
  }[status] || "Belum diisi";
}

function clearAttendanceFeedback(scheduleId) {
  const state = attendanceFor(scheduleId);
  state.success = "";
  state.saveError = "";
}

async function loadScheduleAttendance(schedule) {
  if (!isActualScheduleActive(schedule)) return;
  const state = attendanceFor(schedule.id);
  if (state.loading) return;

  state.loading = true;
  state.error = "";
  try {
    const result = await getTeacherScheduleAttendance(schedule.id);
    state.students = result.students || [];
    state.drafts = Object.fromEntries(
      state.students.map((student) => [student.id, student.attendance_status || "present"]),
    );
    state.success = "";
    state.saveError = "";
  } catch (error) {
    state.error = `Gagal memuat presensi siswa: ${error.message}`;
    state.students = [];
    state.drafts = {};
  } finally {
    state.loading = false;
  }
}

async function saveAttendance(schedule) {
  if (!isActualScheduleActive(schedule)) return;
  const state = attendanceFor(schedule.id);
  if (!isAttendanceComplete(schedule.id)) return;

  state.saving = true;
  state.saveError = "";
  state.success = "";
  try {
    const attendance = state.students.map((student) => ({
      student_id: student.id,
      attendance_status: state.drafts[student.id],
    }));
    const result = await saveTeacherScheduleAttendance(schedule.id, attendance);
    state.success = `${result.saved_count} presensi siswa berhasil disimpan.`;
  } catch (error) {
    state.saveError = `Gagal menyimpan presensi: ${error.message}`;
  } finally {
    state.saving = false;
  }
}

async function loadScheduleAgenda(schedule) {
  const state = agendaStateFor(schedule.id);
  if (state.loading || state.loaded) return;

  state.loading = true;
  state.error = "";
  try {
    const result = await getTeacherScheduleAgenda(schedule.id);
    const agenda = result.agenda;
    state.agendaDate = result.agenda_date;
    state.updatedAt = agenda?.updatedAt || "";
    agendaDrafts.value[schedule.id] = {
      activity_status: agenda?.activity_status || "teaching",
      content: agenda?.content || "",
    };
    state.loaded = true;
  } catch (error) {
    state.error = `Gagal memuat agenda kelas: ${error.message}`;
  } finally {
    state.loading = false;
  }
}

async function saveAgenda(schedule) {
  if (!canEditAgenda(schedule)) return;
  const draft = agendaDrafts.value[schedule.id];
  if (!draft) return;

  const state = agendaStateFor(schedule.id);
  state.saving = true;
  state.saveError = "";
  state.success = "";
  try {
    const result = await saveTeacherScheduleAgenda(schedule.id, {
      activity_status: draft.activity_status,
      content: draft.content,
    });
    state.agendaDate = result.agenda_date;
    state.updatedAt = result.agenda.updatedAt;
    state.loaded = true;
    state.success = "Agenda kelas berhasil disimpan.";
  } catch (error) {
    state.saveError = `Gagal menyimpan agenda kelas: ${error.message}`;
  } finally {
    state.saving = false;
  }
}

async function loadSchedules() {
  try {
    schedules.value = await getTeacherSchedules();
    agendaDrafts.value = Object.fromEntries(
      schedules.value.map((schedule) => [
        schedule.id,
        { activity_status: "teaching", content: "" },
      ]),
    );
    agendaStates.value = Object.fromEntries(
      schedules.value.map((schedule) => [schedule.id, agendaStateFor(schedule.id)]),
    );
  } catch (error) {
    console.error("Gagal memuat jadwal mengajar:", error);
    errorMessage.value = error.message || "Jadwal mengajar gagal dimuat.";
  } finally {
    loading.value = false;
  }
}

watch(actualActiveScheduleIds, () => {
  for (const schedule of todaySchedules.value) {
    if (isScheduleExpanded(schedule) && isActualScheduleActive(schedule)) {
      loadScheduleAttendance(schedule);
    }
  }
});

onMounted(() => {
  loadSchedules();
  clockInterval = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => window.clearInterval(clockInterval));
</script>

<style scoped>
.teacher-schedule {
  color: #f8fafc;
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
  text-align: left;
}

.page-heading span {
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

.today-label {
  margin: 0 0 12px;
  color: #94a3b8;
  text-align: left;
  text-transform: capitalize;
}

.stat-card {
  display: flex;
  min-height: 108px;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  background: #111c31;
  text-align: left;
}

.stat-icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 14px;
  font-size: 1.2rem;
}

.stat-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.stat-icon.green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.stat-icon.orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.stat-card strong,
.stat-card span {
  display: block;
}

.stat-card strong {
  color: #f8fafc;
  font-size: 1.6rem;
  line-height: 1.2;
}

.stat-card span {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.85rem;
}

.today-card,
.weekly-schedules {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 20px;
  background: #111c31;
}

.section-header {
  margin-bottom: 14px;
  text-align: left;
}

.section-header h2 {
  margin: 0 0 4px;
  color: #f8fafc;
  font-size: 1.1rem;
  font-weight: 700;
}

.section-header p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.today-list {
  display: grid;
}

.class-input-list {
  gap: 14px;
}

.realtime-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
  padding: 18px 22px;
  border: 1px solid rgba(74, 222, 128, 0.24);
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(20, 83, 45, 0.28), #111c31 65%);
  text-align: left;
}

.realtime-clock,
.realtime-summary {
  display: grid;
  gap: 5px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #86efac;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.live-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.75);
}

.live-indicator.simulated {
  color: #fcd34d;
}

.live-indicator.simulated span {
  background: #fbbf24;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.65);
}

.realtime-clock strong {
  color: #f8fafc;
  font-size: 1.8rem;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

.clock-simulation {
  display: grid;
  gap: 8px;
  margin-top: 7px;
}

.simulation-toggle {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 7px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.78rem;
}

.simulation-toggle input {
  accent-color: #4ade80;
}

.simulation-time-field {
  display: grid;
  width: fit-content;
  gap: 4px;
  color: #fcd34d;
  font-size: 0.72rem;
  font-weight: 600;
}

.simulation-time-field input {
  min-height: 34px;
  padding: 4px 8px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 7px;
  background: #0c1729;
  color: #f8fafc;
  color-scheme: dark;
  font: inherit;
}

.realtime-clock > span,
.summary-label {
  color: #cbd5e1;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.summary-label {
  font-weight: 700;
}

.summary-hint,
.active-schedule span {
  color: #94a3b8;
  font-size: 0.8rem;
}

.active-schedule {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: baseline;
}

.active-schedule strong {
  color: #4ade80;
  font-size: 0.95rem;
}

.schedule-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.schedule-title h3 {
  margin-bottom: 6px;
}

.schedule-status {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

.schedule-status.ongoing {
  border-color: rgba(74, 222, 128, 0.25);
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.schedule-status.upcoming {
  border-color: rgba(96, 165, 250, 0.25);
  background: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
}

.schedule-status.finished {
  border-color: rgba(148, 163, 184, 0.2);
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5e1;
}

.schedule-status.unknown {
  border-color: rgba(251, 191, 36, 0.25);
  background: rgba(245, 158, 11, 0.12);
  color: #fcd34d;
}

.class-input-list {
  display: grid;
  gap: 16px;
}

.class-input-card {
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  background: #0c1729;
}

.class-input-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  text-align: left;
}

.class-input-heading > div > span {
  color: #4ade80;
  font-size: 0.78rem;
  font-weight: 700;
}

.class-input-heading h3 {
  margin: 4px 0;
  color: #f8fafc;
  font-size: 1.05rem;
}

.class-input-heading p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.82rem;
}

.schedule-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  flex-direction: column;
  gap: 8px;
}

.details-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.08);
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
}

.details-toggle:hover {
  border-color: rgba(74, 222, 128, 0.35);
  color: #86efac;
}

.schedule-detail-content {
  padding-top: 2px;
}

.class-input-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.input-panel {
  min-width: 0;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  background: #111c31;
  text-align: left;
}

.input-panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.input-panel-heading h4 {
  margin: 0 0 3px;
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 700;
}

.input-panel-heading p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.76rem;
}

.input-panel-heading > i {
  color: #4ade80;
  font-size: 1.25rem;
}

.inactive-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  padding: 11px 13px;
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.08);
  color: #fcd34d;
  font-size: 0.8rem;
  text-align: left;
}

.inactive-notice i {
  margin-top: 2px;
}

.inactive-notice strong {
  display: block;
  margin-bottom: 2px;
  color: #fde68a;
}

.inputs-locked .input-panel {
  border-color: rgba(148, 163, 184, 0.08);
  background: #0e192b;
}

.attendance-toolbar {
  position: sticky;
  top: 0.75rem;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 -4px 10px;
  padding: 8px 4px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  background: #111c31;
}

.inputs-locked .attendance-toolbar {
  background: #0e192b;
}

.attendance-collapse-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 7px 10px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 9px;
  background: rgba(148, 163, 184, 0.08);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 650;
}

.attendance-collapse-button:hover {
  border-color: rgba(74, 222, 128, 0.35);
  color: #86efac;
}

.attendance-summary {
  display: grid;
  gap: 10px;
  margin: 10px 0 12px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.38);
}

.attendance-summary-count {
  display: flex;
  align-items: baseline;
  gap: 7px;
  color: #86efac;
  font-size: 0.8rem;
}

.attendance-summary-count i {
  align-self: center;
}

.attendance-summary-count strong {
  font-size: 1rem;
}

.attendance-summary-count span {
  color: #cbd5e1;
}

.non-present-summary h5 {
  margin: 0 0 6px;
  color: #fca5a5;
  font-size: 0.76rem;
  font-weight: 700;
}

.non-present-summary ul {
  display: grid;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.non-present-summary li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 12px;
  color: #e2e8f0;
  font-size: 0.74rem;
}

.non-present-summary li span {
  color: #fcd34d;
}

.all-present-summary {
  margin: 0;
  color: #86efac;
  font-size: 0.74rem;
}

.attendance-list {
  display: grid;
  max-height: 320px;
  overflow-y: auto;
  gap: 7px;
  padding-right: 4px;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
  scrollbar-width: thin;
}

.attendance-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 8px;
  padding: 0 10px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 9px;
  background: rgba(15, 23, 42, 0.55);
  color: #94a3b8;
}

.attendance-search input {
  width: 100%;
  min-height: 38px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #e2e8f0;
  font-size: 0.78rem;
}

.attendance-search input::placeholder {
  color: #64748b;
}

.student-attendance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 40px;
  padding: 5px 8px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 9px;
  background: rgba(15, 23, 42, 0.45);
}

.student-name {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 0.8rem;
}

.student-identifier {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.68rem;
}

.student-name i {
  color: #94a3b8;
  font-size: 1rem;
}

.attendance-select {
  min-width: 132px;
  min-height: 31px;
  padding: 4px 7px;
  border: 1px solid transparent;
  border-radius: 7px;
  background-color: #111c31;
  font-size: 0.72rem;
  font-weight: 700;
}

.attendance-select.pending {
  border-color: rgba(251, 191, 36, 0.25);
  background-color: rgba(245, 158, 11, 0.12);
  color: #fcd34d;
}

.attendance-select.present {
  border-color: rgba(74, 222, 128, 0.25);
  background-color: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.attendance-select.excused {
  border-color: rgba(96, 165, 250, 0.25);
  background-color: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
}

.attendance-select.sick {
  border-color: rgba(192, 132, 252, 0.25);
  background-color: rgba(168, 85, 247, 0.14);
  color: #d8b4fe;
}

.attendance-select.absent {
  border-color: rgba(248, 113, 113, 0.25);
  background-color: rgba(239, 68, 68, 0.14);
  color: #fca5a5;
}

.attendance-select:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.attendance-empty,
.attendance-feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0;
  color: #94a3b8;
  font-size: 0.72rem;
}

.attendance-feedback {
  padding: 9px 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 8px;
}

.attendance-feedback.error {
  border-color: rgba(248, 113, 113, 0.24);
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.attendance-feedback.success {
  border-color: rgba(74, 222, 128, 0.24);
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
}

.attendance-feedback.info {
  border-color: rgba(96, 165, 250, 0.24);
  background: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
}

.attendance-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin-top: 12px;
}

.attendance-hint {
  color: #94a3b8;
  font-size: 0.7rem;
}

.form-field {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 600;
}

.form-field select,
.form-field textarea {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 9px;
  outline: none;
  background: #0c1729;
  color: #f8fafc;
  font: inherit;
  font-weight: 400;
}

.form-field select {
  min-height: 40px;
  padding: 7px 10px;
}

.form-field textarea {
  min-height: 88px;
  padding: 9px 10px;
  resize: vertical;
}

.form-field select:focus,
.form-field textarea:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.12);
}

.form-field select:disabled,
.form-field textarea:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.form-field textarea::placeholder {
  color: #64748b;
}

.save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid rgba(74, 222, 128, 0.28);
  border-radius: 9px;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
  font-size: 0.78rem;
  font-weight: 700;
}

.save-button:disabled {
  border-color: rgba(148, 163, 184, 0.16);
  background: rgba(148, 163, 184, 0.08);
  color: #64748b;
  cursor: not-allowed;
}

.draft-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
}

.draft-note {
  color: #94a3b8;
  font-size: 0.72rem;
}

.today-card .schedule-row:first-child {
  border-top: 0;
}

.today-empty,
.weekly-empty {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  text-align: center;
}

.today-empty i {
  color: #4ade80;
}

.weekly-empty {
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.back-link {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  color: #4ade80;
  text-decoration: none;
}

.day-list {
  display: grid;
  gap: 16px;
}

.day-card {
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  background: #111c31;
}

.day-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  text-align: left;
}

.day-card header h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 700;
}

.day-card header span {
  color: #94a3b8;
  font-size: 0.8rem;
}

.schedule-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px 4px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  text-align: left;
}

.time {
  display: flex;
  min-width: 66px;
  flex-direction: column;
  gap: 3px;
}

.time strong {
  color: #4ade80;
}

.time span {
  color: #94a3b8;
  font-size: 0.78rem;
}

.details {
  min-width: 0;
  flex: 1;
}

.details h3 {
  margin: 0 0 6px;
  color: #f8fafc;
  font-size: 0.95rem;
}

.details p {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 16px;
  margin: 0;
  color: #94a3b8;
  font-size: 0.82rem;
}

.details i {
  margin-right: 4px;
}

.state-card {
  display: flex;
  min-height: 150px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  background: #111c31;
  color: #94a3b8;
  text-align: center;
}

.state-card > i {
  color: #4ade80;
  font-size: 1.4rem;
}

.state-card strong {
  color: #e2e8f0;
}

.state-card p {
  margin: 5px 0 0;
}

.error-state {
  color: #fca5a5;
}

.error-state i {
  color: #f87171;
}

@media (max-width: 575px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .today-card,
  .weekly-schedules,
  .day-card {
    padding: 16px;
  }

  .realtime-card {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px;
  }

  .class-input-grid {
    grid-template-columns: 1fr;
  }

  .class-input-card {
    padding: 14px;
  }

  .class-input-heading {
    flex-direction: column;
  }

  .schedule-actions {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .student-attendance-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .attendance-select {
    width: 100%;
  }
}
</style>
