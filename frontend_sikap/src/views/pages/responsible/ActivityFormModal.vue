<template>
  <div class="modal-backdrop-overlay" @click.self="close">
    <div class="modal-dialog-custom glass-card text-start">
      <!-- Header Modal -->
      <div
        class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
      >
        <h5 class="fw-bold mb-0 text-dark">
          {{ editData ? "Edit Kegiatan" : "Tambah Kegiatan Baru" }}
        </h5>
        <button type="button" class="btn-close-custom" @click="close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Tab Menu Kategori: Tentative / Routine -->
      <div class="nav-tab-wrapper mb-4">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: form.type === 'tentative' }"
          :disabled="Boolean(editData)"
          @click="switchType('tentative')"
        >
          <i class="bi bi-calendar2-event me-2"></i>Tentative
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: form.type === 'routine' }"
          :disabled="Boolean(editData)"
          @click="switchType('routine')"
        >
          <i class="bi bi-arrow-repeat me-2"></i>Routine
        </button>
      </div>
      <p v-if="editData" class="form-text mb-3">
        Jenis kegiatan tidak dapat diubah saat mengedit.
      </p>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label small fw-semibold">Nama Kegiatan</label>
          <input
            type="text"
            v-model="form.name"
            class="form-control rounded-3"
            placeholder="Contoh: Rapat Evaluasi Bulanan"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">Deskripsi</label>
          <textarea
            v-model="form.description"
            class="form-control rounded-3"
            rows="3"
            placeholder="Tambahkan detail kegiatan..."
          ></textarea>
        </div>

        <!-- Dynamic Fields Berdasarkan Tipe -->
        <template v-if="form.type === 'tentative'">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Tanggal</label>
              <input
                type="date"
                v-model="form.date"
                class="form-control rounded-3"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Sesi</label>
              <select
                v-model="form.session_time"
                class="form-select rounded-3"
                required
              >
                <option value="all_day">Seharian</option>
                <option value="morning">Pagi</option>
                <option value="afternoon">Siang</option>
              </select>
            </div>
            <!-- <div class="row g-3 mb-3">
              <div class="col-md-12 d-flex align-items-end">
                <p class="form-text mb-1">
                  Tentukan rentang waktu kegiatan, misalnya 07.00 sampai 08.00.
                </p>
              </div>
            </div> -->
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Jam Mulai</label>
              <input
                type="time"
                v-model="form.start_time"
                class="form-control rounded-3"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Jam Selesai</label>
              <input
                type="time"
                v-model="form.end_time"
                class="form-control rounded-3"
                :min="form.start_time || undefined"
                required
              />
            </div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Target Peserta</label>
              <select v-model="form.target_type" class="form-select rounded-3">
                <option value="all_teachers">Semua Guru</option>
                <option value="assigned_teachers">Guru Terpilih</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">PIC Guru</label>
              <select
                v-model="form.pic_teacher_id"
                class="form-select rounded-3"
              >
                <option :value="null">Pilih PIC</option>
                <option
                  v-for="teacher in sortedTeachers"
                  :key="teacher.id"
                  :value="teacher.id"
                >
                  {{ teacher.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="form.target_type === 'assigned_teachers'" class="mb-3">
            <div class="teacher-picker-heading">
              <label
                for="tentative-teacher-search"
                class="form-label small fw-semibold mb-0"
                >Guru yang Ditugaskan</label
              >
              <span>{{ form.assignments.length }} dipilih</span>
            </div>
            <div class="selected-teachers" aria-live="polite">
              <span
                v-for="teacher in selectedTeachers"
                :key="`selected-tentative-${teacher.id}`"
                class="selected-teacher"
              >
                {{ teacher.name }}
                <button
                  type="button"
                  :aria-label="`Hapus ${teacher.name} dari daftar guru terpilih`"
                  @click="removeTeacher(teacher.id)"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </span>
              <p
                v-if="!selectedTeachers.length"
                class="selected-teachers-empty"
              >
                Belum ada guru yang dipilih.
              </p>
            </div>
            <div class="teacher-search">
              <i class="bi bi-search"></i>
              <input
                id="tentative-teacher-search"
                v-model="teacherSearch"
                type="search"
                class="form-control"
                placeholder="Cari nama guru..."
                autocomplete="off"
              />
            </div>
            <div class="teacher-picker">
              <label
                v-for="teacher in filteredTeachers"
                :key="`tentative-${teacher.id}`"
                class="teacher-option"
              >
                <input
                  v-model="form.assignments"
                  type="checkbox"
                  :value="teacher.id"
                />
                <span>{{ teacher.name }}</span>
              </label>
              <p v-if="!filteredTeachers.length" class="teacher-search-empty">
                Guru tidak ditemukan.
              </p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">
                Semester
                <span class="text-muted fw-normal">
                  ({{ academicPeriod?.academic_year || "tahun ajaran" }})
                </span>
              </label>
              <select
                v-model="form.semester"
                class="form-select rounded-3"
                required
              >
                <option value="odd">Ganjil</option>
                <option value="even">Genap</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Hari</label>
              <select
                v-model="form.day_of_week"
                class="form-select rounded-3"
                required
              >
                <option
                  v-for="day in daysOfWeek"
                  :key="day.value"
                  :value="day.value"
                >
                  {{ day.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Sesi</label>
              <select
                v-model="form.session"
                class="form-select rounded-3"
                required
              >
                <option value="morning">Pagi</option>
                <option value="afternoon">Siang</option>
                <option value="all_day">Seharian</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Target Peserta</label>
              <select v-model="form.target_type" class="form-select rounded-3">
                <option value="all_teachers">Semua Guru</option>
                <option value="assigned_teachers">Guru Terpilih</option>
              </select>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Jam Mulai</label>
              <input
                type="time"
                v-model="form.start_time"
                class="form-control rounded-3"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Jam Selesai</label>
              <input
                type="time"
                v-model="form.end_time"
                class="form-control rounded-3"
                :min="form.start_time || undefined"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">PIC Guru</label>
            <select v-model="form.pic_teacher_id" class="form-select rounded-3">
              <option :value="null">Pilih PIC</option>
              <option
                v-for="teacher in sortedTeachers"
                :key="teacher.id"
                :value="teacher.id"
              >
                {{ teacher.name }}
              </option>
            </select>
          </div>

          <div v-if="form.target_type === 'assigned_teachers'" class="mb-3">
            <div class="teacher-picker-heading">
              <label
                for="routine-teacher-search"
                class="form-label small fw-semibold mb-0"
                >Guru yang Ditugaskan</label
              >
              <span>{{ form.assignments.length }} dipilih</span>
            </div>
            <div class="selected-teachers" aria-live="polite">
              <span
                v-for="teacher in selectedTeachers"
                :key="`selected-routine-${teacher.id}`"
                class="selected-teacher"
              >
                {{ teacher.name }}
                <button
                  type="button"
                  :aria-label="`Hapus ${teacher.name} dari daftar guru terpilih`"
                  @click="removeTeacher(teacher.id)"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </span>
              <p
                v-if="!selectedTeachers.length"
                class="selected-teachers-empty"
              >
                Belum ada guru yang dipilih.
              </p>
            </div>
            <div class="teacher-search">
              <i class="bi bi-search"></i>
              <input
                id="routine-teacher-search"
                v-model="teacherSearch"
                type="search"
                class="form-control"
                placeholder="Cari nama guru..."
                autocomplete="off"
              />
            </div>
            <div class="teacher-picker">
              <label
                v-for="teacher in filteredTeachers"
                :key="`routine-${teacher.id}`"
                class="teacher-option"
              >
                <input
                  v-model="form.assignments"
                  type="checkbox"
                  :value="teacher.id"
                />
                <span>{{ teacher.name }}</span>
              </label>
              <p v-if="!filteredTeachers.length" class="teacher-search-empty">
                Guru tidak ditemukan.
              </p>
            </div>
          </div>
        </template>

        <!-- Footer Actions -->
        <div class="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
          <button
            type="button"
            class="btn btn-light rounded-pill px-4"
            @click="close"
          >
            Batal
          </button>
          <button
            type="submit"
            class="btn btn-primary rounded-pill px-4"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ editData ? "Simpan Perubahan" : "Tambah Kegiatan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import {
  createRoutineActivity,
  createTentativeActivity,
  getAcademicPeriod,
  getTeachers,
  updateActivity,
} from "@/services/api";

const props = defineProps({
  show: Boolean,
  editData: Object,
});

const emit = defineEmits(["close", "refresh"]);

const isSubmitting = ref(false);
const teachers = ref([]);
const academicPeriod = ref(null);
const teacherSearch = ref("");
const assignmentsBySemester = reactive({ odd: [], even: [] });
const isHydratingAssignments = ref(false);
const sortedTeachers = computed(() =>
  [...teachers.value].sort((left, right) =>
    String(left.name || "").localeCompare(String(right.name || ""), "id", {
      sensitivity: "base",
    }),
  ),
);
const filteredTeachers = computed(() => {
  const query = teacherSearch.value.trim().toLocaleLowerCase("id");
  return sortedTeachers.value.filter((teacher) =>
    String(teacher.name || "")
      .toLocaleLowerCase("id")
      .includes(query),
  );
});
const selectedTeachers = computed(() =>
  sortedTeachers.value.filter((teacher) =>
    form.assignments.some((id) => String(id) === String(teacher.id)),
  ),
);

function removeTeacher(teacherId) {
  form.assignments = form.assignments.filter(
    (id) => String(id) !== String(teacherId),
  );
}

const daysOfWeek = [
  { value: "Monday", label: "Senin" },
  { value: "Tuesday", label: "Selasa" },
  { value: "Wednesday", label: "Rabu" },
  { value: "Thursday", label: "Kamis" },
  { value: "Friday", label: "Jumat" },
  { value: "Saturday", label: "Sabtu" },
];

const form = reactive({
  name: "",
  description: "",
  type: "tentative", // tentative | routine
  date: "",
  start_time: "",
  end_time: "",
  target_type: "all_teachers",
  pic_teacher_id: null,
  session_time: "all_day",
  semester: "odd",
  day_of_week: "Monday",
  session: "morning",
  assignments: [],
});

watch(
  () => form.semester,
  (semester, previousSemester) => {
    if (isHydratingAssignments.value || !previousSemester) return;
    assignmentsBySemester[previousSemester] = [...form.assignments];
    form.assignments = [...assignmentsBySemester[semester]];
  },
  { flush: "sync" },
);

onMounted(async () => {
  try {
    const [teacherResponse, academicPeriodResponse] = await Promise.all([
      getTeachers(),
      getAcademicPeriod(),
    ]);
    if (!teacherResponse.success) {
      throw new Error(teacherResponse.message || "Gagal memuat daftar guru");
    }
    if (!Array.isArray(teacherResponse.data)) {
      throw new Error("Format data guru tidak valid");
    }
    teachers.value = teacherResponse.data;
    academicPeriod.value = academicPeriodResponse;
    if (!props.editData) {
      form.semester = academicPeriodResponse.semester;
    }
  } catch (error) {
    alert(error.message || "Gagal memuat data formulir kegiatan");
  }

  if (props.editData) {
    form.name = props.editData.name || props.editData.title || "";
    form.description = props.editData.description || "";
    form.type = props.editData.type || "tentative";
    form.date = props.editData.date || "";
    form.target_type = props.editData.target_type || "all_teachers";
    form.pic_teacher_id = props.editData.pic_teacher_id || null;
    const activitySession =
      props.editData.Activitysessions?.[0] ||
      props.editData.activitysessions?.[0] ||
      props.editData;
    const routineAssignment = (
      props.editData.Teacherassignments ||
      props.editData.teacherassignments ||
      []
    )[0];
    form.session_time =
      activitySession.session || props.editData.session || "all_day";
    form.start_time = formatTimeInput(activitySession.start_time);
    form.end_time = formatTimeInput(activitySession.end_time);
    const activeYearAssignments = (
      props.editData.Teacherassignments ||
      props.editData.teacherassignments ||
      []
    ).filter(
      (item) => item.academic_year === academicPeriod.value?.academic_year,
    );
    isHydratingAssignments.value = true;
    assignmentsBySemester.odd = activeYearAssignments
      .filter((item) => item.semester === "odd")
      .map((item) => item.teacher_id);
    assignmentsBySemester.even = activeYearAssignments
      .filter((item) => item.semester === "even")
      .map((item) => item.teacher_id);
    form.semester =
      props.editData.semester ||
      activeYearAssignments[0]?.semester ||
      academicPeriod.value?.semester ||
      "odd";
    form.day_of_week =
      props.editData.day_of_week || routineAssignment?.day_of_week || "Monday";
    form.session = props.editData.session || routineAssignment?.session || "morning";
    form.assignments =
      form.type === "routine"
        ? [...assignmentsBySemester[form.semester]]
        : (
            props.editData.Teacherassignments ||
            props.editData.teacherassignments ||
            []
          ).map((item) => item.teacher_id);
    isHydratingAssignments.value = false;
    if (form.type === "routine") {
      form.start_time = formatTimeInput(
        props.editData.start_time || routineAssignment?.start_time,
      );
      form.end_time = formatTimeInput(
        props.editData.end_time || routineAssignment?.end_time,
      );
    }
  }
});

const switchType = (type) => {
  if (props.editData) return;
  form.type = type;
};

function formatTimeInput(value) {
  return value ? String(value).slice(0, 5) : "";
}

const close = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (form.start_time && form.end_time && form.end_time <= form.start_time) {
    alert("Jam selesai harus setelah jam mulai.");
    return;
  }
  if (form.target_type === "assigned_teachers" && !form.assignments.length) {
    alert("Pilih minimal satu guru yang ditugaskan.");
    return;
  }

  isSubmitting.value = true;
  try {
    const payload =
      form.type === "tentative"
        ? {
            name: form.name,
            date: form.date,
            description: form.description,
            target_type: form.target_type,
            pic_teacher_id: form.pic_teacher_id,
            session_time: form.session_time,
            start_time: form.start_time,
            end_time: form.end_time,
            ...(form.target_type === "assigned_teachers"
              ? { assignments: form.assignments }
              : {}),
          }
        : {
            name: form.name,
            description: form.description,
            target_type: form.target_type,
            pic_teacher_id: form.pic_teacher_id,
            semester: form.semester,
            day_of_week: form.day_of_week,
            session: form.session,
            start_time: form.start_time,
            end_time: form.end_time,
            ...(form.target_type === "assigned_teachers"
              ? { assignments: form.assignments }
              : {}),
          };
    const res = props.editData?.id
      ? await updateActivity(props.editData.id, payload)
      : form.type === "tentative"
        ? await createTentativeActivity(payload)
        : await createRoutineActivity(payload);

    if (!res.success) throw new Error(res.message || "Gagal menyimpan data kegiatan");
    emit("refresh");
    close();
  } catch (error) {
    alert(error.message || "Gagal menyimpan data kegiatan");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Background Overlay Fullscreen */
.modal-backdrop-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 16px;
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

/* Modal Content Box */
.modal-dialog-custom {
  background: #ffffff;
  width: min(90%, 520px);
  max-width: 520px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  border-radius: 20px;
  padding: 24px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 576px) {
  .modal-backdrop-overlay {
    align-items: flex-start;
    padding: 12px;
  }

  .modal-dialog-custom {
    width: 100%;
    max-height: calc(100vh - 24px);
    padding: 18px;
    border-radius: 16px;
  }
}

/* Custom Tab Menu Style */
.nav-tab-wrapper {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-close-custom {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
}

.teacher-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.teacher-picker-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.teacher-picker-heading > span {
  color: #64748b;
  font-size: 0.75rem;
}

.selected-teachers {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.selected-teacher {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 7px 5px 10px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1e40af;
  font-size: 0.78rem;
  font-weight: 600;
}

.selected-teacher button {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.6rem;
}

.selected-teacher button:hover {
  background: #fecaca;
  color: #b91c1c;
}

.selected-teachers-empty {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
}

.teacher-search {
  position: relative;
  margin-bottom: 8px;
}

.teacher-search > i {
  position: absolute;
  top: 50%;
  left: 12px;
  z-index: 1;
  color: #64748b;
  transform: translateY(-50%);
}

.teacher-search .form-control {
  padding-left: 34px;
  border-color: #e2e8f0;
  font-size: 0.84rem;
}

.teacher-search-empty {
  grid-column: 1 / -1;
  margin: 0;
  padding: 8px;
  color: #64748b;
  font-size: 0.82rem;
  text-align: center;
}

.teacher-option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 8px;
  color: #334155;
  font-size: 0.82rem;
  cursor: pointer;
}

.teacher-option:hover {
  background: #e0f2fe;
}

.teacher-option span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
