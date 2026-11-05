<template>
  <div class="attendance-page mb-5 pb-3 text-start">
    <!-- ================================================================= -->
    <!-- TAMPILAN 1: GRID PILIH SESI (Sama untuk Desktop & Mobile)        -->
    <!-- ================================================================= -->
    <div v-if="!selectedSessionId" class="session-selection">
      <div class="glass-card mb-4">
        <div
          class="d-flex justify-content-between align-items-center flex-wrap gap-2"
        >
          <div>
            <h4 class="section-title mb-1">Pilih Sesi Kegiatan</h4>
            <p class="section-subtitle mb-0">
              Pilih sesi aktif untuk mengelola dan mencatat kehadiran guru
            </p>
          </div>
          <span class="section-badge">
            {{ todaySessions.length }} Sesi Aktif
          </span>
        </div>
      </div>

      <div v-if="loadingActivities" class="loading-state glass-card mb-4">
        <i class="bi bi-arrow-repeat spin-icon"></i>
        <span>Memuat kegiatan hari ini...</span>
      </div>
      <div v-else-if="attendanceDataError" class="alert alert-danger" role="alert">
        {{ attendanceDataError }}
      </div>

      <div v-else-if="pendingActivities.length" class="pending-activity-alert mb-4" role="alert">
        <div class="pending-alert-content">
          <i class="bi bi-exclamation-circle-fill"></i>
          <span>Ada kegiatan hari ini yang belum di-open session.</span>
        </div>
        <button
          type="button"
          class="pending-alert-button"
          @click="showPendingActivitiesModal = true"
        >
          <i class="bi bi-sliders2"></i>
          Aktifkan Session
          <span class="pending-count">{{ pendingActivities.length }}</span>
        </button>
      </div>

      <div v-if="showPendingActivitiesModal" class="pending-modal-backdrop" @click.self="showPendingActivitiesModal = false">
        <section class="pending-modal" role="dialog" aria-modal="true" aria-labelledby="pending-modal-title">
          <div class="pending-modal-header">
            <div>
              <span class="section-badge">{{ pendingActivities.length }} Belum Aktif</span>
              <h4 id="pending-modal-title" class="section-title mt-2 mb-1">Aktifkan Kegiatan Hari Ini</h4>
              <p class="section-subtitle mb-0">Pilih PIC lalu buka session untuk setiap kegiatan.</p>
            </div>
            <button type="button" class="pending-modal-close" title="Tutup" @click="showPendingActivitiesModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="pending-modal-body row g-3">
            <div
              v-for="activity in pendingActivities"
              :key="`pending-modal-${activity.id}`"
              class="col-12 col-md-6"
            >
              <div class="activity-open-card h-100">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <h5 class="activity-title mb-0">{{ activity.name }}</h5>
                  <span class="activity-type-badge">
                    {{ activity.type === "routine" ? "Rutin" : "Tentatif" }}
                  </span>
                </div>
                <p class="activity-description mb-2">{{ activity.description || "Tidak ada deskripsi." }}</p>
                <p class="activity-session-info mb-3">
                  <i class="bi bi-clock me-2"></i>
                  Session: <strong>{{ getActivitySessionLabel(activity) }}</strong>
                </p>
                <div class="mb-3">
                  <label
                    :for="`activity-pic-${activity.id}`"
                    class="form-label small fw-semibold"
                  >
                    PIC Guru
                  </label>
                  <select
                    :id="`activity-pic-${activity.id}`"
                    v-model="selectedPicTeacherByActivity[activity.id]"
                    class="form-select"
                    :disabled="loadingTeachers || teachers.length === 0"
                  >
                    <option :value="null">
                      {{ loadingTeachers ? "Memuat daftar guru..." : "Pilih PIC Guru" }}
                    </option>
                    <option
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :value="teacher.id"
                    >
                      {{ teacher.name }}
                    </option>
                  </select>
                  <small v-if="teacherLoadError" class="text-danger">
                    {{ teacherLoadError }}
                    <button
                      type="button"
                      class="btn btn-link btn-sm p-0 ms-1"
                      :disabled="loadingTeachers"
                      @click="loadTeachers"
                    >
                      Coba lagi
                    </button>
                  </small>
                </div>
                <button
                  type="button"
                  class="action-btn"
                  :disabled="
                    openingActivityId === activity.id ||
                    !selectedPicTeacherByActivity[activity.id]
                  "
                  @click="openActivity(activity)"
                >
                  <i class="bi" :class="openingActivityId === activity.id ? 'bi-hourglass-split' : 'bi-play-fill'"></i>
                  <span>{{ openingActivityId === activity.id ? "Membuka..." : "Buka Session" }}</span>
                </button>
                <div v-if="activity.type === 'routine'" class="cancel-routine-action">
                  <label
                    :for="`activity-cancel-reason-${activity.id}`"
                    class="form-label small fw-semibold"
                  >
                    Jika tidak diselenggarakan, tulis alasannya
                  </label>
                  <textarea
                    :id="`activity-cancel-reason-${activity.id}`"
                    v-model="cancellationReasons[activity.id]"
                    class="form-control mb-2"
                    rows="2"
                    maxlength="1000"
                    placeholder="Contoh: libur sekolah atau kegiatan lain"
                  ></textarea>
                  <button
                    type="button"
                    class="cancel-activity-btn"
                    :disabled="
                      cancellingActivityId === activity.id ||
                      !cancellationReasons[activity.id]?.trim()
                    "
                    @click="cancelRoutine(activity)"
                  >
                    <i
                      class="bi"
                      :class="
                        cancellingActivityId === activity.id
                          ? 'bi-hourglass-split'
                          : 'bi-calendar2-x'
                      "
                    ></i>
                    {{
                      cancellingActivityId === activity.id
                        ? "Menyimpan..."
                        : "Tandai kegiatan ditiadakan"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section v-if="todayCancellations.length" class="cancelled-activities">
        <div class="cancelled-heading">
          <div>
            <h5 class="mb-1">Kegiatan rutin ditiadakan</h5>
            <p class="mb-0">Kegiatan berikut tidak membuka sesi hari ini.</p>
          </div>
          <span>{{ todayCancellations.length }}</span>
        </div>
        <article
          v-for="cancellation in todayCancellations"
          :key="`cancelled-${cancellation.id}`"
          class="cancelled-activity-card"
        >
          <div>
            <strong>{{ cancellation.activity_name }}</strong>
            <p class="mb-1">
              {{ sessionLabel(cancellation.session) }} ·
              {{ cancellation.reason }}
            </p>
          </div>
          <button
            type="button"
            class="restore-cancellation-btn"
            :disabled="restoringCancellationId === cancellation.id"
            @click="restoreCancellation(cancellation)"
          >
            {{
              restoringCancellationId === cancellation.id
                ? "Memproses..."
                : "Batalkan penandaan"
            }}
          </button>
        </article>
      </section>

      <div class="active-sessions-divider">
        <span>Session Aktif</span>
      </div>

      <div v-if="loadingSessions" class="loading-state">
        <i class="bi bi-arrow-repeat spin-icon"></i>
        <span>Memuat daftar sesi...</span>
      </div>

      <div
        v-else-if="todaySessions.length === 0"
        class="empty-state glass-card"
      >
        <i class="bi bi-calendar-x mb-2 display-6"></i>
        <p class="mb-0">Tidak ada sesi kegiatan untuk hari ini.</p>
      </div>

      <div v-else class="row g-3 g-md-4">
        <div
          v-for="session in todaySessions"
          :key="session.id"
          class="col-12 col-md-6 col-xl-4"
        >
          <div
            class="session-card"
            :class="
              session.attendance_complete
                ? 'session-card-complete'
                : 'session-card-pending'
            "
          >
            <div class="session-card-header">
              <div class="session-icon">
                <i class="bi bi-calendar-event-fill"></i>
              </div>
              <span class="session-badge">{{ session.session }}</span>
            </div>

            <div class="session-card-body">
              <h5 class="activity-title">{{ session.activity_name }}</h5>
              <span
                class="attendance-state-badge"
                :class="
                  session.attendance_complete
                    ? 'attendance-state-complete'
                    : 'attendance-state-pending'
                "
              >
                <i
                  class="bi"
                  :class="
                    session.attendance_complete
                      ? 'bi-check-circle-fill'
                      : 'bi-hourglass-split'
                  "
                ></i>
                {{
                  session.attendance_complete
                    ? "Presensi sudah lengkap"
                    : "Presensi belum lengkap"
                }}
              </span>
              <div class="meta-info">
                <p class="mb-1">
                  <i class="bi bi-clock me-2"></i>
                  {{ formatDate(session.date) }}
                </p>
                <p class="mb-1">
                  <i class="bi bi-person-check me-2"></i>
                  Presensi: {{ session.attendance_count }}/{{
                    session.total_teachers
                  }}
                  guru
                </p>
                <p class="mb-0">
                  <i class="bi bi-people me-2"></i>
                  Target: <strong>{{ session.target_type }}</strong>
                </p>
              </div>
            </div>

            <button @click="selectSession(session.id)" class="action-btn">
              <span>{{
                session.attendance_count
                  ? "Lihat / Perbarui Presensi"
                  : "Isi Presensi"
              }}</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN 2: LEMBAR PRESENSI                                      -->
    <!-- ================================================================= -->
    <div v-else class="attendance-sheet">
      <div
        class="d-flex justify-content-between align-items-center mb-3 mb-md-4"
      >
        <button @click="backToSessions" class="hero-btn secondary-btn">
          <i class="bi bi-arrow-left"></i>
          Kembali ke Daftar Sesi
        </button>
      </div>

      <div v-if="loadingAttendance" class="loading-state glass-card">
        <i class="bi bi-arrow-repeat spin-icon"></i>
        <span>Memuat data absensi...</span>
      </div>

      <template v-else>
        <!-- Header Sesi Aktif -->
        <div v-if="sessionInfo" class="glass-card mb-4 text-start">
          <div
            class="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3"
          >
            <div>
              <span class="section-badge mb-2 d-inline-block"
                >LEMBAR PRESENSI</span
              >
              <h3 class="section-title mb-2">
                {{ sessionInfo.activity_name }}
              </h3>
              <p class="section-subtitle mb-0">
                Tanggal:
                <strong class="text-white">{{
                  formatDate(sessionInfo.date)
                }}</strong>
                <br />
                Sesi:
                <span class="text-info fw-semibold">{{
                  sessionInfo.session
                }}</span>
                <br />
                Target:
                <span class="text-white">{{ sessionInfo.target_type }}</span>
              </p>
            </div>
            <!-- <button
              @click="saveAttendance"
              :disabled="isSubmitting"
              class="hero-btn primary-btn w-100-mobile"
            >
              <i class="bi bi-check-circle-fill"></i>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Presensi' }}
            </button> -->
          </div>
        </div>

        <div v-if="attendances.length > 0">
          <!-- ============================================================ -->
          <!-- KHUSUS MOBILE (v-if="isMobile")                             -->
          <!-- ============================================================ -->
          <div v-if="isMobile" class="mobile-attendance-list">
            <!-- Form Search Mobile -->
            <div class="mobile-search-box mb-3">
              <div class="search-input-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="custom-input search-input"
                  placeholder="Cari nama atau NIP guru..."
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="btn-clear-search"
                  type="button"
                >
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>

            <!-- Empty State Jika Hasil Pencarian Kosong -->
            <div
              v-if="filteredAttendances.length === 0"
              class="empty-state glass-card py-4"
            >
              <i class="bi bi-person-x display-6 mb-2"></i>
              <p class="mb-0">Guru tidak ditemukan.</p>
            </div>

            <!-- List Card Guru -->
            <div
              v-else
              v-for="(teacher, index) in filteredAttendances"
              :key="'mob-' + teacher.teacher_id"
              class="mobile-card"
            >
              <!-- Baris Atas: Nomor, Nama & Radio Options (H, S, I, A) -->
              <div class="mobile-card-row">
                <div class="mobile-teacher-info">
                  <!-- Nomor Urut -->
                  <span class="teacher-number">{{ index + 1 }}.</span>
                  <span class="teacher-name">{{ teacher.name }}</span>
                </div>

                <div class="mobile-status-options">
                  <!-- Tombol Toggle Catatan -->
                  <button
                    type="button"
                    class="btn-toggle-note"
                    :class="{
                      active: teacher.showNote,
                      'has-content': teacher.notes && !teacher.showNote,
                    }"
                    @click="teacher.showNote = !teacher.showNote"
                    :title="
                      teacher.showNote ? 'Sembunyikan Catatan' : 'Buka Catatan'
                    "
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>

                  <!-- Radio Chips H, S, I, A -->
                  <label
                    class="radio-chip"
                    :class="{ selected: teacher.status === 'present' }"
                  >
                    <input
                      type="radio"
                      value="present"
                      v-model="teacher.status"
                    />
                    <span>H</span>
                  </label>
                  <label
                    class="radio-chip"
                    :class="{ selected: teacher.status === 'sick' }"
                  >
                    <input type="radio" value="sick" v-model="teacher.status" />
                    <span>S</span>
                  </label>
                  <label
                    class="radio-chip"
                    :class="{ selected: teacher.status === 'permission' }"
                  >
                    <input
                      type="radio"
                      value="permission"
                      v-model="teacher.status"
                    />
                    <span>I</span>
                  </label>
                  <label
                    class="radio-chip"
                    :class="{ selected: teacher.status === 'absent' }"
                  >
                    <input
                      type="radio"
                      value="absent"
                      v-model="teacher.status"
                    />
                    <span>A</span>
                  </label>
                </div>
              </div>

              <!-- Baris Bawah: Input Catatan (Hanya tampil jika showNote = true) -->
              <div v-if="teacher.showNote" class="mobile-note-input">
                <input
                  type="text"
                  class="custom-input"
                  v-model="teacher.notes"
                  placeholder="Tambah catatan..."
                />
              </div>
            </div>

            <!-- Tombol Simpan Presensi -->
            <button
              @click="saveAttendance"
              :disabled="isSubmitting"
              class="hero-btn primary-btn w-100 mt-3"
            >
              <i class="bi bi-check-circle-fill"></i>
              {{ isSubmitting ? "Menyimpan..." : "Simpan Presensi" }}
            </button>
          </div>

          <!-- ============================================================ -->
          <!-- KHUSUS DESKTOP (v-else)                                      -->
          <!-- ============================================================ -->
          <div v-else class="glass-card table-card">
            <!-- Header Table: Search Box Desktop -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div
                class="search-input-wrapper"
                style="max-width: 320px; width: 100%"
              >
                <i class="bi bi-search search-icon"></i>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="custom-input search-input"
                  placeholder="Cari nama atau NIP guru..."
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="btn-clear-search"
                  type="button"
                >
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>

            <!-- Empty State jika hasil pencarian desktop kosong -->
            <div
              v-if="filteredAttendances.length === 0"
              class="empty-state py-4"
            >
              <i class="bi bi-person-x display-6 mb-2"></i>
              <p class="mb-0">Guru tidak ditemukan.</p>
            </div>

            <!-- Tabel Utama -->
            <table v-else class="custom-table text-start">
              <thead>
                <tr>
                  <th width="50">No</th>
                  <th width="160">NIP</th>
                  <th>Nama Guru</th>
                  <th width="180">Status Kehadiran</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(teacher, index) in filteredAttendances"
                  :key="'desk-' + teacher.teacher_id"
                >
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>
                    <span class="nip-badge">{{ teacher.nip || "-" }}</span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <div class="teacher-avatar">
                        {{ getInitials(teacher.name) }}
                      </div>
                      <strong class="teacher-name">{{ teacher.name }}</strong>
                    </div>
                  </td>
                  <td>
                    <div class="status-pill-group">
                      <button
                        type="button"
                        class="status-pill-btn present"
                        :class="{ active: teacher.status === 'present' }"
                        @click="teacher.status = 'present'"
                      >
                        Hadir
                      </button>
                      <button
                        type="button"
                        class="status-pill-btn sick"
                        :class="{ active: teacher.status === 'sick' }"
                        @click="teacher.status = 'sick'"
                      >
                        Sakit
                      </button>
                      <button
                        type="button"
                        class="status-pill-btn permission"
                        :class="{ active: teacher.status === 'permission' }"
                        @click="teacher.status = 'permission'"
                      >
                        Izin
                      </button>
                      <button
                        type="button"
                        class="status-pill-btn absent"
                        :class="{ active: teacher.status === 'absent' }"
                        @click="teacher.status = 'absent'"
                      >
                        Alfa
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="custom-input"
                      v-model="teacher.notes"
                      placeholder="Catatan tambahan..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="d-flex justify-content-end mt-4">
              <button
                @click="saveAttendance"
                :disabled="isSubmitting"
                class="hero-btn primary-btn"
              >
                <i class="bi bi-check-circle-fill"></i>
                {{ isSubmitting ? "Menyimpan..." : "Simpan Presensi" }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state glass-card">
          <p class="mb-0">Tidak ada daftar guru untuk sesi ini.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import {
  getAcademicPeriod,
  getActivities,
  getActiveActivitySessions,
  getTodayActivityCancellations,
  getTeachers,
  openActivitySession,
  cancelRoutineActivity,
  restoreRoutineActivity,
} from "@/services/api";

const props = defineProps({
  sessionId: {
    type: [Number, String],
    default: null,
  },
});

const API_BASE_URL = "http://localhost:3001/api";

const todaySessions = ref([]);
const loadingSessions = ref(false);
const activities = ref([]);
const academicPeriod = ref(null);
const loadingActivities = ref(false);
const openingActivityId = ref(null);
const showPendingActivitiesModal = ref(false);
const teachers = ref([]);
const loadingTeachers = ref(false);
const teacherLoadError = ref("");
const selectedPicTeacherByActivity = ref({});
const todayCancellations = ref([]);
const cancellationReasons = ref({});
const cancellingActivityId = ref(null);
const restoringCancellationId = ref(null);
const attendanceDataError = ref("");

const selectedSessionId = ref(props.sessionId || null);
const sessionInfo = ref(null);
const attendances = ref([]);
const loadingAttendance = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref("");

const filteredAttendances = computed(() => {
  if (!searchQuery.value.trim()) return attendances.value;
  const query = searchQuery.value.toLowerCase();
  return attendances.value.filter((teacher) => {
    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.nip?.toLowerCase().includes(query)
    );
  });
});

// Deteksi ukuran layar untuk pemisahan komponen Mobile/Desktop
const isMobile = ref(false);
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768;
};

const isToday = (date) => {
  if (!date) return false;
  return new Date(date).toDateString() === new Date().toDateString();
};

const getCurrentPeriodAssignments = (activity) =>
  (activity.Teacherassignments || []).filter(
    (assignment) =>
      assignment.academic_year === academicPeriod.value?.academic_year &&
      assignment.semester === academicPeriod.value?.semester,
  );

const getRoutineDay = (activity) =>
  activity.day_of_week ||
  getCurrentPeriodAssignments(activity).find((assignment) => assignment.day_of_week)
    ?.day_of_week;

const todayActivities = computed(() => {
  const todayDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  return activities.value.filter((activity) => {
    if (activity.type === "tentative") return isToday(activity.date);
    return getRoutineDay(activity) === todayDay;
  });
});

const pendingActivities = computed(() =>
  todayActivities.value.filter(
    (activity) =>
      !todayCancellations.value.some(
        (cancellation) =>
          Number(cancellation.activity_id) === Number(activity.id),
      ) &&
      !todaySessions.value.some(
        (session) => session.activity_id === activity.id,
      ),
  ),
);

const getActivitySessionValue = (activity) =>
  activity.Activitysessions?.find(
    (item) =>
      isToday(item.date) &&
      (activity.type !== "routine" ||
        (item.academic_year === academicPeriod.value?.academic_year &&
          item.semester === academicPeriod.value?.semester)),
  )?.session ||
  getCurrentPeriodAssignments(activity).find((item) => item.session)?.session ||
  activity.session;

const getActivitySessionLabel = (activity) => {
  const session = getActivitySessionValue(activity);

  return (
    {
      morning: "Pagi",
      afternoon: "Siang",
      all_day: "Seharian",
    }[session] || "Belum ditentukan"
  );
};

const sessionLabel = (session) =>
  ({
    morning: "Pagi",
    afternoon: "Siang",
    all_day: "Seharian",
  })[session] || "Sesi belum ditentukan";

const cancelRoutine = async (activity) => {
  cancellingActivityId.value = activity.id;
  try {
    const session = getActivitySessionValue(activity);
    if (!session) throw new Error("Sesi kegiatan belum ditentukan.");
    await cancelRoutineActivity({
      activity_id: activity.id,
      session,
      reason: cancellationReasons.value[activity.id],
    });
    cancellationReasons.value[activity.id] = "";
    await fetchAttendanceData();
    if (pendingActivities.value.length === 0) {
      showPendingActivitiesModal.value = false;
    }
  } catch (error) {
    alert(error.message || "Gagal menandai kegiatan ditiadakan.");
  } finally {
    cancellingActivityId.value = null;
  }
};

const restoreCancellation = async (cancellation) => {
  restoringCancellationId.value = cancellation.id;
  try {
    await restoreRoutineActivity(cancellation.id);
    await fetchAttendanceData();
    showPendingActivitiesModal.value = true;
  } catch (error) {
    alert(error.message || "Gagal membatalkan penandaan kegiatan.");
  } finally {
    restoringCancellationId.value = null;
  }
};

const loadTeachers = async () => {
  loadingTeachers.value = true;
  teacherLoadError.value = "";

  const response = await getTeachers();
  if (response.success) {
    teachers.value = response.data || [];
  } else {
    teacherLoadError.value = response.message || "Gagal memuat daftar guru.";
    console.error("Gagal mengambil daftar guru untuk PIC:", teacherLoadError.value);
  }

  loadingTeachers.value = false;
};

const openActivity = async (activity) => {
  openingActivityId.value = activity.id;
  try {
    const response = await openActivitySession({
      activity_id: activity.id,
      pic_teacher_id: selectedPicTeacherByActivity.value[activity.id],
    });

    if (!response.success) {
      alert(response.message || "Gagal membuka session.");
      return;
    }

    await fetchAttendanceData();
    if (pendingActivities.value.length === 0) {
      showPendingActivitiesModal.value = false;
    }
  } catch (error) {
    console.error("Gagal membuka session kegiatan:", error);
    alert(error.message || "Gagal membuka session.");
  } finally {
    openingActivityId.value = null;
  }
};

const fetchAttendanceData = async () => {
  loadingActivities.value = true;
  loadingSessions.value = true;
  attendanceDataError.value = "";
  try {
    const [
      activityResponse,
      sessionResponse,
      periodResponse,
      cancellationResponse,
    ] = await Promise.all([
      getActivities(),
      getActiveActivitySessions(),
      getAcademicPeriod(),
      getTodayActivityCancellations(),
    ]);
    academicPeriod.value = periodResponse;

    if (!activityResponse.success) {
      throw new Error(activityResponse.message || "Gagal memuat kegiatan.");
    }
    if (!sessionResponse.success) {
      throw new Error(sessionResponse.message || "Gagal memuat sesi kegiatan.");
    }
    activities.value = activityResponse.data || [];
    const selections = { ...selectedPicTeacherByActivity.value };
    for (const activity of activities.value) {
      if (!(activity.id in selections)) {
        selections[activity.id] =
          activity.pic_teacher_id ||
          activity.Activitysessions?.find((item) => isToday(item.date))
            ?.pic_teacher_id ||
          null;
      }
    }
    selectedPicTeacherByActivity.value = selections;
    todaySessions.value = sessionResponse.data || [];
    todayCancellations.value = cancellationResponse || [];
  } catch (error) {
    console.error("Gagal mengambil data kegiatan dan session:", error);
    attendanceDataError.value =
      error.message || "Gagal memuat kegiatan dan sesi hari ini.";
  } finally {
    loadingActivities.value = false;
    loadingSessions.value = false;
  }
};

const selectSession = async (id) => {
  selectedSessionId.value = id;
  loadingAttendance.value = true;

  try {
    const response = await fetch(
      `${API_BASE_URL}/activitysessions/${id}/attendances`,
    );
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();

    sessionInfo.value = {
      activity_name: data.activity_name,
      target_type: data.target_type,
      date: data.date,
      session: data.session,
    };

    attendances.value = (data.attendances || []).map((item) => ({
      teacher_id: item.teacher_id,
      name: item.name,
      nip: item.nip,
      status: item.status || "present",
      notes: item.notes || "",
      // showNote diatur true HANYA saat data awal dibaca jika catatan tidak kosong,
      // tapi selanjutnya dikontrol sepenuhnya oleh toggle user.
      showNote: Boolean(item.notes && item.notes.trim() === ""),
    }));
  } catch (error) {
    console.error("Gagal mengambil lembar absensi:", error);
    alert("Terjadi kesalahan saat memuat data absensi.");
  } finally {
    loadingAttendance.value = false;
  }
};

const backToSessions = () => {
  selectedSessionId.value = null;
  sessionInfo.value = null;
  attendances.value = [];
  fetchAttendanceData();
};

const saveAttendance = async () => {
  if (!selectedSessionId.value) return;

  isSubmitting.value = true;
  try {
    const payload = {
      attendances: attendances.value.map((item) => ({
        teacher_id: item.teacher_id,
        status: item.status,
        notes: item.notes,
      })),
    };

    const response = await fetch(
      `${API_BASE_URL}/activitysessions/${selectedSessionId.value}/attendances`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Gagal menyimpan absensi");

    alert("Presensi berhasil disimpan!");
    await selectSession(selectedSessionId.value);
  } catch (error) {
    console.error("Gagal menyimpan presensi:", error);
    alert(error.message || "Terjadi kesalahan saat menyimpan data.");
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getInitials = (name) => {
  if (!name) return "G";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  if (props.sessionId) {
    selectSession(props.sessionId);
  } else {
    fetchAttendanceData();
  }
  loadTeachers();
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
.attendance-page {
  color: white;
  animation: fadePage 0.3s ease;
}

/* GLASS CARD CONTAINER */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(16px);
}

.section-title {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.section-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
}

.section-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* SESSION CARD */
.session-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transition: all 0.25s ease;
}

.session-card-complete {
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(20, 83, 45, 0.2);
}

.session-card-pending {
  border-color: rgba(251, 191, 36, 0.45);
  background: rgba(120, 53, 15, 0.16);
}

.session-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(59, 130, 246, 0.3);
}

.session-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.session-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.session-badge {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.attendance-state-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.attendance-state-complete {
  color: #86efac;
  background: rgba(34, 197, 94, 0.16);
}

.attendance-state-pending {
  color: #fde68a;
  background: rgba(251, 191, 36, 0.16);
}

.activity-title {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
}

.meta-info p {
  color: #94a3b8;
  font-size: 13px;
}

.activity-open-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 14px;
  padding: 12px;
}

.cancel-routine-action {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(251, 191, 36, 0.18);
}

.cancel-routine-action .form-control {
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(148, 163, 184, 0.3);
}

.cancel-routine-action .form-control::placeholder {
  color: #94a3b8;
}

.cancel-activity-btn,
.restore-cancellation-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 10px;
  padding: 9px 12px;
  color: #fecaca;
  background: rgba(127, 29, 29, 0.25);
  font-size: 13px;
  font-weight: 700;
}

.cancel-activity-btn {
  width: 100%;
}

.cancel-activity-btn:disabled,
.restore-cancellation-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.cancelled-activities {
  margin-bottom: 24px;
  padding: 18px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 18px;
  background: rgba(127, 29, 29, 0.12);
}

.cancelled-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: #fecaca;
}

.cancelled-heading h5 {
  color: #fecaca;
  font-size: 15px;
  font-weight: 700;
}

.cancelled-heading p,
.cancelled-activity-card p {
  color: #cbd5e1;
  font-size: 13px;
}

.cancelled-heading > span {
  display: grid;
  min-width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  color: #fecaca;
  background: rgba(248, 113, 113, 0.18);
  font-size: 12px;
  font-weight: 700;
}

.cancelled-activity-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid rgba(248, 113, 113, 0.16);
}

.cancelled-activity-card strong {
  display: block;
  margin-bottom: 4px;
  color: #f8fafc;
}

.cancelled-activity-card p {
  margin-bottom: 0;
  overflow-wrap: anywhere;
}

.restore-cancellation-btn {
  flex-shrink: 0;
}

.pending-activity-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 14px;
  background: rgba(120, 53, 15, 0.2);
  color: #fde68a;
}

.pending-alert-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
}

.pending-alert-content i {
  color: #fbbf24;
  font-size: 18px;
}

.pending-alert-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid rgba(253, 230, 138, 0.35);
  border-radius: 10px;
  background: rgba(251, 191, 36, 0.16);
  color: #fef3c7;
  font-size: 12px;
  font-weight: 700;
}

.pending-alert-button:hover {
  background: rgba(251, 191, 36, 0.25);
}

.pending-count {
  min-width: 20px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #fbbf24;
  color: #451a03;
  text-align: center;
}

.pending-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(5px);
}

.pending-modal {
  width: min(760px, 100%);
  max-height: min(720px, 90vh);
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  background: #111827;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
}

.pending-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.pending-modal-close {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
}

.pending-modal-body {
  max-height: calc(min(720px, 90vh) - 115px);
  overflow-y: auto;
  padding: 18px 24px 24px;
}

@media (max-width: 576px) {
  .cancelled-activity-card {
    align-items: stretch;
    flex-direction: column;
  }

  .restore-cancellation-btn {
    width: 100%;
  }

  .pending-activity-alert {
    align-items: flex-start;
    flex-direction: column;
  }

  .pending-alert-button {
    width: 100%;
    justify-content: center;
  }

  .pending-modal-header,
  .pending-modal-body {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.activity-open-card .activity-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.activity-open-card .activity-description,
.activity-open-card .activity-session-info {
  font-size: 11px;
}

.activity-open-card .action-btn {
  height: 38px;
  margin-top: 10px;
  font-size: 12px;
}

.active-sessions-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 28px 0 18px;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.active-sessions-divider::before,
.active-sessions-divider::after {
  content: "";
  height: 1px;
  flex: 1;
  background: rgba(148, 163, 184, 0.25);
}

.active-sessions-divider span {
  padding: 6px 12px;
  border: 1px solid rgba(96, 165, 250, 0.25);
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
}

.activity-type-badge {
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.15);
  color: #fcd34d;
  font-size: 11px;
  font-weight: 700;
}

.activity-description {
  color: #cbd5e1;
  font-size: 13px;
}

.activity-session-info {
  color: #94a3b8;
  font-size: 13px;
}

.activity-session-info strong {
  color: #f8fafc;
}

/* BUTTONS */
.action-btn {
  width: 100%;
  margin-top: 16px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: 0.2s ease;
}

.session-card:hover .action-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: transparent;
}

.hero-btn {
  height: 46px;
  padding: 0 20px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  border: none;
  transition: 0.25s ease;
  cursor: pointer;
  font-size: 14px;
}

.primary-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
}

.hero-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  opacity: 0.95;
}

/* ========================================================
   1. STYLES KHUSUS DESKTOP TABLE
   ======================================================== */
.table-card {
  padding: 16px;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.custom-table th {
  padding: 12px 16px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  border: none;
}

.custom-table td {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  vertical-align: middle;
}

.custom-table td:first-child {
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
}

.custom-table td:last-child {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
}

.nip-badge {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 12px;
}

.teacher-avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.teacher-name {
  font-size: 14px;
}

.status-select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  min-height: 40px;
}

.status-select.present {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.3);
}

.status-select.sick {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.status-select.permission {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.3);
}

.status-select.absent {
  color: #f43f5e;
  border-color: rgba(244, 63, 94, 0.3);
}

.custom-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 13px;
  outline: none;
  min-height: 40px;
}

.custom-input:focus {
  border-color: #2563eb;
}

/* ========================================================
   2. STYLES KHUSUS MOBILE CARD
   ======================================================== */
.mobile-attendance-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
}

.mobile-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mobile-teacher-info {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 50%;
  overflow: hidden;
}

.mobile-teacher-info .teacher-name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-toggle-note {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 14px;
  padding: 0 4px;
  cursor: pointer;
  transition: color 0.2s ease;
}

/* Indikator Tombol saat Aktif/Dibuka */
.btn-toggle-note.active {
  color: #3b82f6;
}

/* Indikator Kuning saat Ditutup tapi Ada Isinya (Agar user tahu) */
.btn-toggle-note.has-content {
  color: #f59e0b;
}

/* Radio Chip H, S, I, A */
.mobile-status-options {
  display: flex;
  gap: 4px;
}

.radio-chip {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  transition: all 0.15s ease;
}

.radio-chip input {
  display: none;
}

/* Warna Aktif untuk Pilihan H, S, I, A */
.radio-chip:has(input[value="present"]:checked) {
  background-color: #16a34a; color: #ffffff; border-color: #15803d;
}

.radio-chip:has(input[value="sick"]:checked) {
  background-color: #d97706; color: #ffffff; border-color: #b45309;
}

.radio-chip:has(input[value="permission"]:checked) {
  background-color: #0284c7; color: #ffffff; border-color: #0369a1;
}

.radio-chip:has(input[value="absent"]:checked) {
  background-color: #dc2626; color: #ffffff; border-color: #b91c1c;
}

.mobile-note-input {
  margin-top: 8px;
}

.mobile-note-input .custom-input {
  font-size: 12px;
  min-height: 34px;
  padding: 4px 10px;
}

/* UTILITY STATES */
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spin-icon {
  font-size: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadePage {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .glass-card {
    padding: 16px;
    border-radius: 18px;
  }
  .w-100-mobile {
    width: 100%;
  }
}

/* Style Search Input Mobile */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 14px;
}

.search-input {
  padding-left: 36px !important;
  padding-right: 36px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
}

.btn-clear-search {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

/* Style Nomor Urut */
.teacher-number {
  font-size: 12px;
  font-weight: 700;
  color: #60a5fa;
  min-width: 20px;
}

/* Style Badge Dropdown / Pill */
.status-select.status-pill {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
}

.status-select.present {
  background-color: #d1e7dd;
  color: #0f5132;
  border-color: #badbcc;
}

.status-select.sick {
  background-color: #fff3cd;
  color: #664d03;
  border-color: #ffecb5;
}

.status-select.permission {
  background-color: #cff4fc;
  color: #055160;
  border-color: #b6effb;
}

.status-select.absent {
  background-color: #f8d7da;
  color: #842029;
  border-color: #f5c2c7;
}

/* Style Badge Dropdown / Pill */
.status-select.status-pill {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

/* Base Style Status Button Pills Group */
.status-pill-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.status-pill-btn {
  border: 1px solid #cbd5e1;
  background: #f1f5f9;
  color: #475569;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* ========================================== */
/* WARNA STATUS KONTRAS TINGGI               */
/* ========================================== */

/* Ganti bagian status di atas dengan ini jika mobile menggunakan warna solid */
.status-select.present, .status-pill-btn.present.active {
  background-color: #16a34a; color: #ffffff; border-color: #15803d;
}
.status-select.sick, .status-pill-btn.sick.active {
  background-color: #d97706; color: #ffffff; border-color: #b45309;
}
.status-select.permission, .status-pill-btn.permission.active {
  background-color: #0284c7; color: #ffffff; border-color: #0369a1;
}
.status-select.absent, .status-pill-btn.absent.active {
  background-color: #dc2626; color: #ffffff; border-color: #b91c1c;
}
</style>
