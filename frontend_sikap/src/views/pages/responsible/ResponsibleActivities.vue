<template>
  <div class="activity-container container-fluid py-4">
    <!-- Header Page -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 text-start">
      <div>
        <h3 class="fw-bold text-white mb-1">Daftar Kegiatan (Activities)</h3>
        <p class="text-white small mb-0">Kelola seluruh agenda kegiatan rutin maupun tentatif</p>
        <span
          v-if="academicPeriod"
          class="badge rounded-pill bg-light text-dark mt-2"
        >
          Periode aktif: {{ academicPeriod.academic_year }} ·
          {{ academicPeriod.semester === "odd" ? "Ganjil" : "Genap" }}
        </span>
      </div>
      <button class="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4" @click="openModal">
        <i class="bi bi-plus-lg"></i>
        <span>Tambah Activity</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="filter-wrapper mb-4 p-3 rounded-4">
      <div class="row g-3">
        <!-- Search Input -->
        <div class="col-12 col-md-4">
          <div class="search-input-wrapper position-relative">
            <i class="bi bi-search search-icon position-absolute top-50 start-0 translate-middle-y ms-3"></i>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control ps-5 rounded-pill filter-input"
              placeholder="Cari nama kegiatan..."
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y me-2"
            >
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </div>

        <!-- Filter Waktu -->
        <div class="col-12 col-md-4">
          <select v-model="filterTime" class="form-select rounded-pill filter-select">
            <option value="all">Semua Waktu</option>
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>

        <!-- Filter Status -->
        <div class="col-12 col-md-4">
          <select v-model="filterStatus" class="form-select rounded-pill filter-select">
            <option value="all">Semua Status</option>
            <option value="ongoing">Berlangsung</option>
            <option value="upcoming">Mendatang</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </div>
    </div>

    <!-- State Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Memuat daftar kegiatan...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredActivities.length === 0" class="text-center py-5 empty-state-wrapper rounded-4">
      <i class="bi bi-calendar-x text-muted display-4"></i>
      <h5 class="fw-semibold mt-3">Tidak Ada Kegiatan</h5>
      <p class="text-muted small">Tidak ada kegiatan yang sesuai dengan filter pilihan kamu.</p>
    </div>

    <!-- Monthly Calendar -->
    <div v-else class="calendar-layout ">
      <section class="calendar-panel p-3">
        <header class="calendar-header">
          <div>
            <h4>{{ calendarMonthLabel }}</h4>
            <p>Pilih tanggal untuk melihat agenda kegiatan.</p>
          </div>
          <div class="calendar-navigation">
            <button type="button" class="calendar-nav-button" aria-label="Bulan sebelumnya" @click="changeMonth(-1)">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button type="button" class="calendar-today-button" @click="goToToday">Hari ini</button>
            <button type="button" class="calendar-nav-button" aria-label="Bulan berikutnya" @click="changeMonth(1)">
              <i class="bi bi-chevron-right"></i>
            </button>
            <button
              type="button"
              class="calendar-today-button calendar-size-button"
              :aria-expanded="calendarExpanded"
              @click="calendarExpanded = !calendarExpanded"
            >
              <i class="bi" :class="calendarExpanded ? 'bi-arrows-angle-contract' : 'bi-arrows-angle-expand'"></i>
              {{ calendarExpanded ? 'Perkecil' : 'Perbesar' }}
            </button>
          </div>
        </header>

        <div class="calendar-grid" role="grid" :aria-label="`Kalender ${calendarMonthLabel}`">
          <div v-for="dayName in weekdays" :key="dayName" class="calendar-weekday" role="columnheader">
            {{ dayName }}
          </div>
          <button
            v-for="day in calendarDays"
            :key="day.dateKey"
            type="button"
            class="calendar-day"
            :class="{
              'outside-month': !day.isCurrentMonth,
              'selected-day': day.dateKey === selectedDate,
              'today-day': day.dateKey === todayDateKey,
              'has-activities': day.activities.length,
            }"
            :aria-label="calendarDayLabel(day)"
            :aria-pressed="day.dateKey === selectedDate"
            role="gridcell"
            @click="selectCalendarDay(day)"
          >
            <span class="calendar-day-number">{{ day.dayNumber }}</span>
            <span v-if="day.dateKey === todayDateKey" class="calendar-today-label">Hari ini</span>
            <span v-if="day.activities.length" class="calendar-event-count">
              <i class="bi bi-circle-fill"></i>
              {{ day.activities.length }} kegiatan
            </span>
            <span v-for="activity in day.activities.slice(0, 2)" :key="activity.id" class="calendar-event-name">
              {{ activity.name || activity.title || 'Kegiatan sekolah' }}
            </span>
            <span v-if="day.activities.length > 2" class="calendar-more">
              +{{ day.activities.length - 2 }} lainnya
            </span>
          </button>
        </div>

        <div class="calendar-legend">
          <span><i class="bi bi-circle-fill event-legend"></i> Ada kegiatan</span>
          <span><i class="bi bi-circle-fill today-legend"></i> Hari ini</span>
        </div>
      </section>

      <section class="selected-day-panel p-3">
        <header class="selected-day-header">
          <div>
            <span>AGENDA TANGGAL</span>
            <h4>{{ selectedDateLabel }}</h4>
          </div>
          <span class="selected-day-count">{{ selectedDayActivities.length }} kegiatan</span>
        </header>

        <div v-if="selectedDayActivities.length" class="selected-activity-list">
          <article v-for="act in selectedDayActivities" :key="act.id" class="selected-activity-card">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
              <span
                class="activity-badge"
                :class="act.type === 'routine' ? 'badge-routine' : 'badge-tentative'"
              >
                {{ act.type === 'routine' ? 'Rutin' : 'Tentatif' }}
              </span>
              <span class="activity-badge status-badge" :class="getStatusBadgeClass(act.calculatedStatus)">
                {{ act.calculatedStatusText }}
              </span>
            </div>
            <h5 class="activity-title">{{ act.name || act.title }}</h5>
            <p class="activity-description">{{ act.description || 'Tidak ada deskripsi' }}</p>
            <div class="activity-footer">
              <div class="activity-date">
                <i class="bi me-1" :class="act.type === 'routine' ? 'bi-arrow-repeat' : 'bi-clock'"></i>
                <span>{{ act.type === 'routine' ? routineDaysLabel(act) : formatDate(act.start_date || act.date) }}</span>
              </div>
              <div class="d-flex gap-2">
                <button class="btn-action view" @click="showDetails(act)" :aria-label="`Lihat detail ${act.name || act.title}`" title="Lihat detail">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action edit" @click="handleEdit(act)" :aria-label="`Edit ${act.name || act.title}`" title="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action delete" @click="handleDelete(act.id)" :disabled="deletingActivityId !== null" :aria-label="`Hapus ${act.name || act.title}`" title="Hapus">
                  <span v-if="deletingActivityId === act.id" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="selected-day-empty">
          <i class="bi bi-calendar2-check"></i>
          <p>Tidak ada kegiatan pada tanggal ini.</p>
        </div>
      </section>
    </div>

    <div
      v-if="detailActivity"
      class="activity-detail-overlay modal d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      :aria-label="`Detail ${detailActivity.name || detailActivity.title || 'kegiatan'}`"
      @click.self="closeDetails"
      @keydown.esc="closeDetails"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content activity-detail-dialog border-0 text-start">
          <div class="modal-header">
            <div class="activity-detail-heading">
              <span class="badge me-2" :class="detailActivity.type === 'routine' ? 'text-bg-primary' : 'text-bg-info'">
                {{ detailActivity.type === 'routine' ? 'Rutin' : 'Tentatif' }}
              </span>
              <span class="badge" :class="getStatusBadgeClass(getCalculatedStatus(detailActivity))">
                {{ getStatusText(detailActivity) }}
              </span>
              <h5 class="modal-title fw-bold mt-3">{{ detailActivity.name || detailActivity.title }}</h5>
              <p class="activity-detail-subtitle mb-0">Ringkasan agenda dan informasi penugasan guru</p>
            </div>
            <button type="button" class="btn-close" aria-label="Tutup" @click="closeDetails"></button>
          </div>
          <div class="modal-body">
            <p class="activity-detail-description mb-4">
              {{ detailActivity.description || 'Tidak ada deskripsi kegiatan.' }}
            </p>
            <div class="activity-detail-meta mb-4">
              <div class="activity-meta-item">
                <span><i class="bi bi-calendar3"></i>Jadwal</span>
                <strong>
                {{ detailActivity.type === 'routine' ? routineDaysLabel(detailActivity) : formatDate(detailActivity.start_date || detailActivity.date) }}
                </strong>
              </div>
              <div class="activity-meta-item">
                <span><i class="bi bi-clock"></i>Waktu</span>
                <strong>{{ getActivityTime(detailActivity) }}</strong>
              </div>
              <div class="activity-meta-item">
                <span><i class="bi bi-person-badge"></i>PIC Guru</span>
                <strong>{{ getActivityPic(detailActivity) }}</strong>
              </div>
              <div class="activity-meta-item">
                <span><i class="bi bi-people"></i>Penugasan</span>
                <strong>
                {{ detailActivity.target_type === 'all_teachers' ? 'Semua guru aktif' : 'Guru terpilih' }}
                </strong>
              </div>
            </div>

            <section
              v-if="detailActivity.target_type !== 'all_teachers'"
              class="activity-teacher-section"
            >
              <div class="activity-teacher-heading">
                <div>
                  <h6 class="fw-semibold mb-1">Guru yang ditugaskan</h6>
                  <p class="mb-0">Daftar guru yang termasuk dalam agenda ini</p>
                </div>
                <span class="activity-teacher-count">{{ getActivityTeachers(detailActivity).length }}</span>
              </div>
              <ul v-if="getActivityTeachers(detailActivity).length" class="list-group activity-teacher-list">
                <li v-for="teacher in getActivityTeachers(detailActivity)" :key="teacher.id" class="list-group-item d-flex justify-content-between align-items-center gap-2">
                  <span class="activity-teacher-name">
                    <span class="activity-teacher-avatar">{{ (teacher.name || '?').charAt(0).toUpperCase() }}</span>
                    {{ teacher.name || 'Guru tanpa nama' }}
                  </span>
                  <span v-if="teacher.status" class="badge rounded-pill" :class="teacher.status === 'active' ? 'text-bg-success' : 'text-bg-secondary'">
                    {{ teacher.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </li>
              </ul>
              <p v-else class="activity-teacher-state mb-0">
                {{ detailActivity.target_type === 'all_teachers' ? 'Tidak ada guru aktif.' : 'Belum ada guru yang ditugaskan.' }}
              </p>
            </section>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeDetails">Tutup</button>
            <button type="button" class="btn btn-primary" @click="handleEdit(detailActivity); closeDetails()">
              <i class="bi bi-pencil me-1"></i>Edit kegiatan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay Modal Input Activity -->
    <ActivityFormModal
      v-if="isModalOpen"
      :show="isModalOpen"
      :editData="selectedActivity"
      @close="closeModal"
      @refresh="loadActivities"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  getActivities,
  getAcademicPeriod,
  getTeachers,
  deleteActivity,
} from "@/services/api";
import ActivityFormModal from "./ActivityFormModal.vue";
import { getApplicationDateKey } from "@/services/applicationClock";

const activities = ref([]);
const academicPeriod = ref(null);
const isLoading = ref(false);
const teachers = ref([]);
const isLoadingTeachers = ref(false);
const teacherLoadError = ref("");
const isModalOpen = ref(false);
const selectedActivity = ref(null);
const detailActivity = ref(null);
const deletingActivityId = ref(null);

const searchQuery = ref("");
const filterTime = ref("all");
const filterStatus = ref("all");
const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const todayDateKey = computed(() => getApplicationDateKey());
const calendarMonth = ref(parseDateKey(`${todayDateKey.value.slice(0, 7)}-01`));
const selectedDate = ref(todayDateKey.value);
const calendarExpanded = ref(false);

watch(todayDateKey, (date, previousDate) => {
  if (selectedDate.value === previousDate) selectedDate.value = date;
  if (
    calendarMonth.value.getFullYear() === Number(previousDate.slice(0, 4)) &&
    calendarMonth.value.getMonth() === Number(previousDate.slice(5, 7)) - 1
  ) {
    calendarMonth.value = parseDateKey(`${date.slice(0, 7)}-01`);
  }
});

// Fetch Data
const loadActivities = async () => {
  isLoading.value = true;
  try {
    const res = await getActivities();
    if (!res.success) throw new Error(res.message || "Gagal memuat kegiatan");
    if (!Array.isArray(res.data)) throw new Error("Format data kegiatan tidak valid");
    activities.value = res.data;
  } catch (error) {
    alert(error.message || "Gagal memuat kegiatan");
  } finally {
    isLoading.value = false;
  }
};

const loadTeachers = async () => {
  isLoadingTeachers.value = true;
  teacherLoadError.value = "";
  try {
    const res = await getTeachers();
    if (!res.success) throw new Error(res.message || "Gagal memuat daftar guru");
    if (!Array.isArray(res.data)) throw new Error("Format data guru tidak valid");
    teachers.value = res.data;
  } catch (error) {
    teacherLoadError.value = error.message || "Gagal memuat daftar guru";
  } finally {
    isLoadingTeachers.value = false;
  }
};

const loadAcademicPeriod = async () => {
  try {
    academicPeriod.value = await getAcademicPeriod();
  } catch (error) {
    alert(error.message || "Gagal memuat periode akademik aktif");
  }
};

onMounted(() => {
  void loadActivities();
  void loadTeachers();
  void loadAcademicPeriod();
});

const getCalculatedStatus = (act) => {
  if (act.type === "routine") return "ongoing";
  const startDate = normalizeDate(act.start_date || act.date);
  const endDate = normalizeDate(act.end_date || startDate);

  if (!startDate) return "upcoming";
  if (todayDateKey.value > endDate) return "completed";
  if (todayDateKey.value >= startDate && todayDateKey.value <= endDate) return "ongoing";
  return "upcoming";
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "ongoing": return "status-select present";
    case "upcoming": return "status-select permission";
    case "completed": return "status-select absent";
    default: return "bg-secondary text-white";
  }
};
const getStatusText = (activity) => {
  const status = getCalculatedStatus(activity);
  if (status === "ongoing") return "Berlangsung";
  if (status === "completed") return "Selesai";
  return "Mendatang";
};
const getCurrentPeriodAssignments = (activity) => {
  const assignments =
    activity.Teacherassignments ||
    activity.teacherassignments ||
    activity.TeacherAssignments ||
    [];
  if (activity.type !== "routine") return assignments;
  return assignments.filter(
    (assignment) =>
      assignment.academic_year === academicPeriod.value?.academic_year &&
      assignment.semester === academicPeriod.value?.semester,
  );
};
const getActivityTeachers = (activity) => {
  if (activity.target_type === "all_teachers") {
    return teachers.value
      .filter((teacher) => teacher.status === "active")
      .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "id"));
  }
  const assignments = getCurrentPeriodAssignments(activity);
  const uniqueTeachers = new Map();
  assignments.forEach((assignment) => {
    const teacher = assignment.Teacher || assignment.teacher ||
      teachers.value.find((item) => Number(item.id) === Number(assignment.teacher_id));
    if (teacher) uniqueTeachers.set(Number(teacher.id), teacher);
  });
  return [...uniqueTeachers.values()].sort((left, right) =>
    String(left.name || "").localeCompare(String(right.name || ""), "id"),
  );
};
const getActivityTime = (activity) => {
  const activitySession =
    activity.type === "routine"
      ? {}
      : activity.Activitysessions?.[0] ||
        activity.activitysessions?.[0] ||
        activity;
  const assignment = getCurrentPeriodAssignments(activity)[0];
  const start = activity.start_time || activitySession.start_time || assignment?.start_time;
  const end = activity.end_time || activitySession.end_time || assignment?.end_time;
  const session = activitySession.session || assignment?.session;
  const sessionLabel = {
    morning: "Pagi",
    afternoon: "Siang",
    all_day: "Seharian",
  }[session];
  const timeRange = start && end ? `${String(start).slice(0, 5)}–${String(end).slice(0, 5)}` : "";
  return [sessionLabel, timeRange].filter(Boolean).join(" · ") || "-";
};
const getActivityPic = (activity) =>
  teachers.value.find((teacher) => Number(teacher.id) === Number(activity.pic_teacher_id))?.name ||
  activity.responsiblePerson ||
  "-";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return parseDateKey(normalizeDate(dateStr)).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const calendarMonthLabel = computed(() =>
  new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(calendarMonth.value),
);
const selectedDateLabel = computed(() =>
  parseDateKey(selectedDate.value).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);
const filteredActivities = computed(() => {
  return activities.value
    .map((act) => {
      const status = getCalculatedStatus(act);
      let statusText = "Mendatang";
      if (status === "ongoing") statusText = "Berlangsung";
      if (status === "completed") statusText = "Selesai";

      return {
        ...act,
        calculatedStatus: status,
        calculatedStatusText: statusText
      };
    })
    .filter((act) => {
      // 1. Filter Search
      const name = (act.name || act.title || "").toLowerCase();
      const matchesSearch = name.includes(searchQuery.value.toLowerCase());

      // 2. Filter Status
      const matchesStatus = filterStatus.value === "all" || act.calculatedStatus === filterStatus.value;

      // 3. Filter Waktu
      const actDate = normalizeDate(act.start_date || act.date);
      let matchesTime = true;

      if (filterTime.value === "today") {
        matchesTime = activityOccursOnDate(act, todayDateKey.value);
      } else if (filterTime.value === "week") {
        const today = parseDateKey(todayDateKey.value);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        matchesTime = Array.from({ length: 7 }, (_, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          return activityOccursOnDate(act, toDateKey(date));
        }).some(Boolean);
      } else if (filterTime.value === "month") {
        matchesTime = getMonthDateKeys(todayDateKey.value).some((date) =>
          activityOccursOnDate(act, date),
        );
      } else if (filterTime.value === "year") {
        matchesTime = getYearDateKeys(todayDateKey.value).some((date) =>
          activityOccursOnDate(act, date),
        );
      }

      return matchesSearch && matchesStatus && matchesTime;
    });
});
const calendarDays = computed(() => {
  const firstOfMonth = new Date(
    calendarMonth.value.getFullYear(),
    calendarMonth.value.getMonth(),
    1,
  );
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - ((firstOfMonth.getDay() + 6) % 7));
  const displayStart = calendarExpanded.value
    ? gridStart
    : (() => {
        const selected = parseDateKey(selectedDate.value);
        selected.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));
        return selected;
      })();
  const visibleDayCount = calendarExpanded.value ? 42 : 7;

  return Array.from({ length: visibleDayCount }, (_, index) => {
    const date = new Date(displayStart);
    date.setDate(displayStart.getDate() + index);
    const dateKey = toDateKey(date);

    return {
      dateKey,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === calendarMonth.value.getMonth(),
      activities: filteredActivities.value.filter((act) =>
        activityOccursOnDate(act, dateKey),
      ),
    };
  });
});
const selectedDayActivities = computed(() =>
  filteredActivities.value.filter((act) =>
    activityOccursOnDate(act, selectedDate.value),
  ),
);

const englishWeekdays = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
const indonesianWeekdays = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
};

function routineWeekdays(activity) {
  const activityDay = String(activity.day_of_week || "").toLowerCase();
  const activityWeekday =
    englishWeekdays[activityDay] ?? indonesianWeekdays[activityDay];
  if (activityWeekday !== undefined) return [activityWeekday];

  const allAssignments =
    activity.Teacherassignments ||
    activity.teacherassignments ||
    activity.TeacherAssignments ||
    [];
  const assignments = allAssignments.filter(
    (assignment) =>
      assignment.academic_year === academicPeriod.value?.academic_year &&
      assignment.semester === academicPeriod.value?.semester,
  );
  const days = assignments
    .map((assignment) => {
      const day = String(assignment.day_of_week || "").toLowerCase();
      return englishWeekdays[day] ?? indonesianWeekdays[day];
    })
    .filter((day) => day !== undefined);
  if (days.length) return [...new Set(days)];
  return activity.target_type === "assigned_teachers" || allAssignments.length
    ? []
    : [0, 1, 2, 3, 4, 5, 6];
}

function activityOccursOnDate(activity, dateKey) {
  if (activity.type === "routine") {
    return routineWeekdays(activity).includes(parseDateKey(dateKey).getDay());
  }

  const startDate = normalizeDate(activity.start_date || activity.date);
  const endDate = normalizeDate(activity.end_date || startDate);
  return Boolean(startDate && dateKey >= startDate && dateKey <= endDate);
}

function routineDaysLabel(activity) {
  const days = routineWeekdays(activity);
  if (days.length === 7) return "Setiap hari";
  return days
    .sort((left, right) => left - right)
    .map((day) => ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][day])
    .join(", ");
}

function getMonthDateKeys(dateKey) {
  const date = parseDateKey(`${dateKey.slice(0, 7)}-01`);
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const monthDate = new Date(date);
    monthDate.setDate(index + 1);
    return toDateKey(monthDate);
  });
}

function getYearDateKeys(dateKey) {
  const year = Number(dateKey.slice(0, 4));
  const start = new Date(year, 0, 1);
  const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  return Array.from({ length: daysInYear }, (_, index) => {
    const date = new Date(start);
    date.setDate(index + 1);
    return toDateKey(date);
  });
}

function normalizeDate(value) {
  if (!value) return "";
  return value instanceof Date ? toDateKey(value) : String(value).slice(0, 10);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calendarDayLabel(day) {
  const dateLabel = parseDateKey(day.dateKey).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return day.activities.length
    ? `${dateLabel}, ${day.activities.length} kegiatan`
    : dateLabel;
}

function selectCalendarDay(day) {
  selectedDate.value = day.dateKey;
  if (!day.isCurrentMonth) {
    calendarMonth.value = parseDateKey(`${day.dateKey.slice(0, 7)}-01`);
  }
}

function changeMonth(offset) {
  const nextMonth = new Date(
    calendarMonth.value.getFullYear(),
    calendarMonth.value.getMonth() + offset,
    1,
  );
  calendarMonth.value = nextMonth;
  selectedDate.value = toDateKey(nextMonth);
}

function goToToday() {
  calendarMonth.value = parseDateKey(`${todayDateKey.value.slice(0, 7)}-01`);
  selectedDate.value = todayDateKey.value;
}

// Modal Actions
const openModal = () => {
  selectedActivity.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedActivity.value = null;
};

const handleEdit = (act) => {
  selectedActivity.value = act;
  isModalOpen.value = true;
};

const showDetails = (activity) => {
  detailActivity.value = activity;
};

const closeDetails = () => {
  detailActivity.value = null;
};

const handleDelete = async (id) => {
  if (deletingActivityId.value !== null) return;
  if (!window.confirm("Apakah kamu yakin ingin menghapus kegiatan ini?")) return;
  deletingActivityId.value = id;
  try {
    const res = await deleteActivity(id);
    if (!res.success) throw new Error(res.message || "Gagal menghapus kegiatan");
    if (detailActivity.value?.id === id) closeDetails();
    await loadActivities();
  } catch (error) {
    alert(error.message || "Gagal menghapus kegiatan");
  } finally {
    deletingActivityId.value = null;
  }
};
</script>

<style scoped>
/* CONTAINER */
.activity-container {
  animation: fadeIn 0.25s ease-in;
}

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

/* HEADER */
.activity-container h3 {
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.activity-container > div:first-child p {
  color: #94a3b8;
  font-size: 13px;
}

/* FILTER SECTION */
.filter-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.filter-input {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
}

.filter-input::placeholder {
  color: #94a3b8;
}

.filter-input:focus {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: #94a3b8;
}

.filter-input:focus ~ .search-icon {
  color: #3b82f6;
}

.filter-select {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding-right: 35px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.filter-select:focus {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select option {
  background-color: #0f1419;
  color: white;
}

/* MONTHLY CALENDAR */
.calendar-layout {
  display: grid;
  gap: 18px;
}

.calendar-panel,
.selected-day-panel {
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
}

.calendar-header,
.selected-day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  text-align: left;
}

.calendar-header h4,
.selected-day-header h4 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.15rem;
  font-weight: 700;
  text-transform: capitalize;
}

.calendar-header p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 0.82rem;
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-nav-button,
.calendar-today-button {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
}

.calendar-nav-button:hover,
.calendar-today-button:hover {
  border-color: rgba(96, 165, 250, 0.45);
  background: rgba(59, 130, 246, 0.12);
  color: #bfdbfe;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.calendar-weekday {
  padding: 8px 4px;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
}

.calendar-day {
  display: flex;
  min-width: 0;
  min-height: 112px;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 9px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.42);
  color: #e2e8f0;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.calendar-day:hover {
  border-color: rgba(96, 165, 250, 0.45);
  background: rgba(59, 130, 246, 0.08);
}

.calendar-day.outside-month {
  border-color: transparent;
  background: rgba(15, 23, 42, 0.18);
  color: #64748b;
  opacity: 0.45;
}

.calendar-day:not(.outside-month) {
  border-color: rgba(74, 222, 128, 0.18);
  background: rgba(22, 163, 74, 0.07);
}

.calendar-day.selected-day {
  border-color: #4ade80;
  background: rgba(34, 197, 94, 0.18);
  box-shadow: inset 0 0 0 1px rgba(74, 222, 128, 0.22);
  opacity: 1;
}

.calendar-day.today-day {
  border-color: #fbbf24;
  box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.28);
}

.calendar-day.today-day:not(.selected-day) {
  background: rgba(245, 158, 11, 0.12);
}

.calendar-day-number {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 50%;
  font-size: 0.82rem;
  font-weight: 700;
}

.today-day .calendar-day-number {
  background: #d97706;
  color: #fff;
}

.selected-day .calendar-day-number {
  background: #16a34a;
  color: #fff;
}

.calendar-today-label {
  color: #fcd34d;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
}

.calendar-day.selected-day .calendar-today-label {
  color: #bbf7d0;
}

.calendar-event-count {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #93c5fd;
  font-size: 0.68rem;
  font-weight: 700;
}

.calendar-event-count i {
  color: #60a5fa;
  font-size: 0.45rem;
}

.calendar-event-name,
.calendar-more {
  width: 100%;
  overflow: hidden;
  color: #cbd5e1;
  font-size: 0.68rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-more {
  color: #93c5fd;
}

.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 14px;
  color: #94a3b8;
  font-size: 0.75rem;
}

.calendar-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.event-legend {
  color: #60a5fa;
  font-size: 0.55rem;
}

.today-legend {
  color: #fbbf24;
  font-size: 0.55rem;
}

.selected-day-header {
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.selected-day-header > div > span {
  color: #60a5fa;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.selected-day-header h4 {
  margin-top: 5px;
}

.selected-day-count {
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
  font-size: 0.75rem;
}

.selected-activity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 12px;
}

.selected-activity-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.48);
  text-align: left;
}

.selected-activity-card .activity-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.selected-day-empty {
  display: grid;
  min-height: 120px;
  place-content: center;
  justify-items: center;
  color: #94a3b8;
  text-align: center;
}

.selected-day-empty i {
  color: #60a5fa;
  font-size: 1.5rem;
}

.selected-day-empty p {
  margin: 8px 0 0;
  font-size: 0.85rem;
}

/* EMPTY STATE */
.empty-state-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 3rem 2rem;
}

.empty-state-wrapper h5 {
  color: white;
  font-weight: 600;
}

.empty-state-wrapper .text-muted {
  color: #94a3b8;
}

/* ACTIVITY CARD */
.activity-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.today-session-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
}

.session-controls {
  display: grid;
  gap: 8px;
}

.session-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.35);
}

.session-row strong,
.session-row small {
  display: block;
}

.session-row strong {
  color: #e2e8f0;
  font-size: 13px;
}

.session-row small {
  margin-top: 2px;
  font-size: 11px;
}

.session-open-btn {
  flex: 0 0 32px;
  color: #86efac;
}

.session-check {
  color: #4ade80;
  font-size: 18px;
}

.session-pic-select {
  min-height: 36px;
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.session-pic-select option {
  background-color: #0f1419;
  color: white;
}

/* BADGES */
.activity-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  display: inline-block;
}

.badge-routine {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.badge-tentative {
  background: rgba(250, 204, 21, 0.15);
  color: #fde047;
}

.status-badge {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.status-badge.ongoing {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.status-badge.upcoming {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.status-badge.completed {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* TITLE */
.activity-title {
  color: white;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
}

/* DESCRIPTION */
.activity-description {
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* -webkit-line-clamp: 2; */
  overflow: hidden;
}

/* FOOTER */
.activity-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 12px;
}

.activity-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ACTION BUTTONS */
.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-action:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-action.edit:hover {
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.3);
}

.btn-action.view:hover {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.3);
}

.btn-action.delete:hover {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-action:active {
  transform: scale(0.95);
}

/* LOADING STATE */
.spinner-border {
  border-color: rgba(255, 255, 255, 0.2);
  border-right-color: #3b82f6;
}

/* Activity detail overlay */
.activity-detail-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
  overflow: hidden;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(5px);
}

.activity-detail-overlay .modal-dialog {
  width: min(100%, 800px);
  max-height: calc(100vh - 3rem);
  margin: 0;
}

.activity-detail-dialog {
  position: relative;
  display: flex;
  max-height: calc(100vh - 3rem);
  flex-direction: column;
  overflow: hidden;
  color: #34463d;
  background: #f3f7f4;
  border: 1px solid #dfe9e2 !important;
  border-radius: 20px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
}

.activity-detail-dialog::before {
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, #16834a, #34a853, #8bcf9e);
  content: "";
}

.activity-detail-dialog .modal-header,
.activity-detail-dialog .modal-footer {
  border-color: #edf0f5;
}

.activity-detail-dialog .modal-header {
  flex: 0 0 auto;
  align-items: flex-start;
  padding: 1.6rem 1.75rem 1.25rem;
  background: #f7faf8;
}

.activity-detail-dialog .modal-body {
  min-height: 0;
  padding: 1.25rem 1.75rem 1.5rem;
  overflow-y: auto;
}

.activity-detail-dialog .modal-footer {
  flex: 0 0 auto;
  padding: 1rem 1.75rem 1.25rem;
  background: #f7faf8;
}

.activity-detail-dialog .modal-title,
.activity-detail-dialog h6 {
  color: #172033;
}

.activity-detail-heading {
  min-width: 0;
  padding-right: 1rem;
}

.activity-detail-heading .modal-title {
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.activity-detail-subtitle,
.activity-teacher-heading p {
  color: #667085;
  font-size: 0.86rem;
}

.activity-detail-description {
  color: #475467;
  line-height: 1.7;
  white-space: pre-line;
}

.activity-detail-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.activity-meta-item {
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid #dfe9e2;
  border-radius: 13px;
  background: #fbfdfb;
}

.activity-meta-item > span {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
  color: #667085;
  font-size: 0.78rem;
  font-weight: 600;
}

.activity-meta-item > span i {
  color: #16834a;
  font-size: 0.95rem;
}

.activity-meta-item > strong {
  display: block;
  color: #172033;
  font-size: 0.92rem;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.activity-teacher-section {
  padding-top: 1.25rem;
  border-top: 1px solid #dfe9e2;
}

.activity-teacher-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.activity-teacher-count {
  display: grid;
  min-width: 34px;
  height: 34px;
  place-items: center;
  padding: 0 9px;
  border-radius: 999px;
  color: #167443;
  background: #eaf7ef;
  font-size: 0.85rem;
  font-weight: 700;
}

.activity-teacher-list {
  border: 1px solid #dfe9e2;
  border-radius: 13px;
}

.activity-detail-dialog .activity-teacher-list .list-group-item {
  min-height: 52px;
  padding: 9px 14px;
  color: #344054;
  background: #fbfdfb;
  border-color: #e7eee9;
}

.activity-teacher-name {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.activity-teacher-avatar {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 50%;
  color: #167443;
  background: #eaf7ef;
  font-size: 0.78rem;
  font-weight: 700;
}

.activity-teacher-state {
  padding: 16px;
  border: 1px dashed #cddbd1;
  border-radius: 12px;
  color: #667085;
  background: #f8fbf8;
  text-align: center;
  font-size: 0.88rem;
}

.activity-detail-dialog .btn-close {
  margin-top: 3px;
}

.activity-detail-dialog .modal-footer .btn {
  min-height: 40px;
  padding-inline: 16px;
  border-radius: 10px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .activity-container h3 {
    font-size: 18px;
  }

  .activity-card {
    padding: 12px;
  }

  .calendar-panel,
  .selected-day-panel {
    padding: 14px;
  }

  .calendar-grid {
    width: 100%;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 5px;
  }

  .calendar-day {
    position: relative;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 5px 1px 7px;
    border-radius: 10px;
  }

  .calendar-event-count {
    display: none;
  }

  .calendar-event-name,
  .calendar-more {
    display: none;
  }

  .calendar-day.has-activities::after {
    position: absolute;
    bottom: 5px;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #60a5fa;
    content: "";
    transform: translateX(-50%);
  }

  .calendar-day.selected-day.has-activities::after {
    background: #fff;
  }

  .calendar-day-number {
    width: 28px;
    height: 28px;
    font-size: 0.82rem;
  }

  .calendar-weekday {
    padding: 6px 1px;
    font-size: 0.66rem;
  }

  .calendar-today-label {
    font-size: 0.56rem;
  }

  .calendar-header,
  .selected-day-header {
    align-items: flex-start;
  }

  .calendar-header {
    flex-direction: column;
    gap: 12px;
  }

  .calendar-panel {
    padding: 12px;
  }

  .calendar-navigation {
    width: 100%;
    flex-wrap: wrap;
    gap: 6px;
  }

  .calendar-nav-button,
  .calendar-today-button {
    min-width: 34px;
    height: 34px;
    padding: 0 9px;
    font-size: 0.78rem;
  }

  .calendar-size-button {
    margin-left: auto;
  }

  .activity-detail-overlay {
    padding:
      max(18px, env(safe-area-inset-top))
      16px
      max(18px, env(safe-area-inset-bottom));
  }

  .activity-detail-overlay .modal-dialog {
    width: 100%;
    max-height: calc(100dvh - 36px);
  }

  .activity-detail-dialog {
    max-height: calc(100dvh - 36px);
    border-radius: 17px;
  }

  .activity-detail-dialog .modal-header {
    padding: 1rem 1rem 0.8rem;
  }

  .activity-detail-dialog .modal-body {
    padding: 0.85rem 1rem 1rem;
    overscroll-behavior: contain;
  }

  .activity-detail-dialog .modal-footer {
    gap: 0.5rem;
    padding: 0.75rem 1rem max(0.75rem, env(safe-area-inset-bottom));
  }

  .activity-detail-dialog .modal-footer .btn {
    flex: 1 1 0;
    min-height: 42px;
    padding-inline: 10px;
    font-size: 0.88rem;
  }

  .activity-detail-heading .badge {
    font-size: 0.7rem;
  }

  .activity-detail-heading .modal-title {
    margin-top: 0.7rem !important;
    font-size: 1.08rem;
  }

  .activity-detail-subtitle {
    font-size: 0.76rem;
  }

  .activity-detail-description {
    margin-bottom: 0.8rem !important;
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .activity-detail-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    margin-bottom: 0.9rem !important;
  }

  .activity-meta-item {
    padding: 9px 10px;
    border-radius: 11px;
  }

  .activity-meta-item > span {
    gap: 5px;
    margin-bottom: 4px;
    font-size: 0.68rem;
  }

  .activity-meta-item > span i {
    font-size: 0.8rem;
  }

  .activity-meta-item > strong {
    font-size: 0.78rem;
    line-height: 1.3;
  }

  .activity-teacher-section {
    padding-top: 0.8rem;
  }

  .activity-teacher-heading {
    margin-bottom: 0.55rem;
  }

  .activity-teacher-heading h6 {
    font-size: 0.9rem;
  }

  .activity-teacher-heading p {
    font-size: 0.72rem;
  }

  .activity-teacher-count {
    min-width: 29px;
    height: 29px;
    font-size: 0.78rem;
  }

  .activity-detail-dialog .activity-teacher-list .list-group-item {
    min-height: 40px;
    padding: 5px 9px;
    font-size: 0.82rem;
  }

  .activity-teacher-avatar {
    width: 27px;
    height: 27px;
    flex-basis: 27px;
    font-size: 0.7rem;
  }

  .activity-teacher-state {
    padding: 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) and (max-height: 700px) {
  .activity-detail-dialog .modal-header {
    padding-top: 0.75rem;
    padding-bottom: 0.6rem;
  }

  .activity-detail-dialog .modal-footer {
    padding-top: 0.55rem;
  }

  .activity-detail-description {
    margin-bottom: 0.55rem !important;
  }

  .activity-detail-meta {
    gap: 5px;
    margin-bottom: 0.65rem !important;
  }

  .activity-meta-item {
    padding: 7px 9px;
  }

}
</style>