<template>
  <section class="superadmin-schedule mt-3">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h2 class="mb-1">Manajemen Jadwal Pelajaran</h2>
        <p class="text-muted mb-0">Pantau progres dan input jadwal guru di setiap kelas.</p>
      </div>
      <button v-if="!showForm" class="btn btn-success" @click="openAddForm">
        <i class="bi bi-calendar-plus me-2"></i>Tambah Jadwal
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success" role="status">
      {{ successMessage }}
    </div>

    <div v-if="loading" class="text-center text-muted py-4">
      <span class="spinner-border spinner-border-sm me-2"></span>Memuat data jadwal...
    </div>

    <div v-if="!showForm && !loading" class="card shadow-sm mb-4">
      <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h5 class="mb-1">Progres Input Jadwal</h5>
          <small class="text-muted">Status dihitung dari jumlah jadwal yang sudah tersimpan.</small>
        </div>
        <div class="btn-group" role="group" aria-label="Pilih ringkasan jadwal">
          <button
            type="button"
            class="btn"
            :class="progressView === 'class' ? 'btn-primary' : 'btn-outline-primary'"
            @click="progressView = 'class'"
          >
            Berdasarkan Kelas
          </button>
          <button
            type="button"
            class="btn"
            :class="progressView === 'teacher' ? 'btn-primary' : 'btn-outline-primary'"
            @click="progressView = 'teacher'"
          >
            Berdasarkan Guru Aktif
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-sm-4">
            <div class="border rounded p-3 h-100">
              <div class="text-muted small">Total jadwal tersimpan</div>
              <strong class="fs-4">{{ schedules.length }}</strong>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="border rounded p-3 h-100">
              <div class="text-muted small">Kelas sudah ada jadwal</div>
              <strong class="fs-4">{{ classesWithSchedules }}/{{ classes.length }}</strong>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="border rounded p-3 h-100">
              <div class="text-muted small">Guru aktif sudah ada jadwal</div>
              <strong class="fs-4">{{ teachersWithSchedules }}/{{ activeTeachers.length }}</strong>
            </div>
          </div>
        </div>

        <div class="table-responsive progress-table">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>{{ progressView === "class" ? "Kelas" : "Guru Aktif" }}</th>
                <th>Jumlah Jadwal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="progressItems.length === 0">
                <td colspan="4" class="text-center text-muted py-4">
                  {{ progressView === "class" ? "Belum ada data kelas" : "Belum ada guru aktif" }}
                </td>
              </tr>
              <tr v-for="item in progressItems" :key="item.id">
                <td class="text-start">{{ item.name }}</td>
                <td>{{ item.scheduleCount }}</td>
                <td>
                  <span class="badge" :class="item.scheduleCount ? 'bg-success' : 'bg-secondary'">
                    {{ item.scheduleCount ? "Sudah ada jadwal" : "Belum ada jadwal" }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="openAddForm(progressView, item.id)">
                    <i class="bi bi-plus-circle me-1"></i>Tambah jadwal
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="card shadow-sm mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingSchedule ? "Edit Jadwal" : "Tambah Jadwal" }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveSchedule">
          <div v-if="!editingSchedule" class="mb-3">
            <label class="form-label d-block">Cara input jadwal</label>
            <div class="btn-group" role="group" aria-label="Cara input jadwal">
              <button
                type="button"
                class="btn"
                :class="inputMode === 'class' ? 'btn-primary' : 'btn-outline-primary'"
                @click="setInputMode('class')"
              >
                Dari Kelas
              </button>
              <button
                type="button"
                class="btn"
                :class="inputMode === 'teacher' ? 'btn-primary' : 'btn-outline-primary'"
                @click="setInputMode('teacher')"
              >
                Dari Guru Aktif
              </button>
            </div>
          </div>
          <div class="row">
            <div v-if="inputMode === 'class' || editingSchedule" class="col-md-6 mb-3">
              <label class="form-label">Kelas *</label>
              <select v-model="form.class_id" class="form-select" required :disabled="saving">
                <option value="">Pilih kelas</option>
                <option v-for="item in classes" :key="item.id" :value="item.id">{{ item.class_name }}</option>
              </select>
            </div>
            <div v-if="inputMode === 'teacher' && !editingSchedule" class="col-md-6 mb-3">
              <label class="form-label">Guru Aktif *</label>
              <select v-model="form.teacher_id" class="form-select" required :disabled="saving">
                <option value="">Pilih guru aktif</option>
                <option v-for="item in activeTeachers" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Mata Pelajaran *</label>
              <select v-model="form.subject_id" class="form-select" required>
                <option value="">Pilih mata pelajaran</option>
                <option v-for="item in subjects" :key="item.id" :value="item.id">{{ item.subject_name }}</option>
              </select>
            </div>
            <div v-if="inputMode === 'class' || editingSchedule" class="col-md-6 mb-3">
              <label class="form-label">Guru Pengajar *</label>
              <select v-model="form.teacher_id" class="form-select" required>
                <option value="">Pilih guru</option>
                <option v-for="item in activeTeachers" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
            <div v-if="inputMode === 'teacher' && !editingSchedule" class="col-md-6 mb-3">
              <label class="form-label">Kelas *</label>
              <select v-model="form.class_id" class="form-select" required>
                <option value="">Pilih kelas</option>
                <option v-for="item in classes" :key="item.id" :value="item.id">{{ item.class_name }}</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Ruang Kelas *</label>
              <select v-model="form.classroom_id" class="form-select" required>
                <option value="">Pilih ruang</option>
                <option v-for="item in classrooms" :key="item.id" :value="item.id">{{ item.classroom_name }}</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Hari *</label>
              <select v-model="form.day" class="form-select" required>
                <option value="">Pilih hari</option>
                <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Jam Mulai *</label>
              <select v-model="form.start_timeslot_id" class="form-select" required>
                <option value="">Pilih jam mulai</option>
                <option v-for="item in timeslots" :key="item.id" :value="item.id">
                  {{ item.jp }} ({{ item.start }}–{{ item.end }})
                </option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Jam Selesai *</label>
              <select v-model="form.end_timeslot_id" class="form-select" required>
                <option value="">Pilih jam selesai</option>
                <option v-for="item in timeslots" :key="item.id" :value="item.id">
                  {{ item.jp }} ({{ item.start }}–{{ item.end }})
                </option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary me-2" type="submit" :disabled="saving">
            {{ saving ? "Menyimpan..." : editingSchedule ? "Simpan Perubahan" : "Simpan & Input Berikutnya" }}
          </button>
          <button class="btn btn-secondary" type="button" @click="cancelForm">Batal</button>
        </form>
      </div>
    </div>

    <template v-else-if="!loading">
      <div class="row mb-3 g-2">
        <div class="col-md-4">
          <input v-model="searchQuery" class="form-control" type="search" placeholder="Cari kelas, guru, atau pelajaran..." />
        </div>
        <div class="col-md-3">
          <select v-model="filterTeacherId" class="form-select" aria-label="Filter berdasarkan guru">
            <option value="">Semua guru</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filterClassId" class="form-select" aria-label="Filter berdasarkan kelas">
            <option value="">Semua kelas</option>
            <option v-for="item in classes" :key="item.id" :value="item.id">
              {{ item.class_name }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filterDay" class="form-select" aria-label="Filter berdasarkan hari">
            <option value="">Semua hari</option>
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
      </div>
      <div class="card shadow-sm">
        <div class="card-body table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr><th>Kelas</th><th>Mata Pelajaran</th><th>Guru</th><th>Hari</th><th>Waktu</th><th>Ruang</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="!loading && filteredSchedules.length === 0">
                <td colspan="7" class="text-center text-muted py-4">Tidak ada jadwal pelajaran</td>
              </tr>
              <tr v-for="schedule in filteredSchedules" :key="schedule.id">
                <td>{{ schedule.Class?.class_name || "-" }}</td>
                <td class="text-start">{{ schedule.Subject?.subject_name || "-" }}</td>
                <td>{{ schedule.Teacher?.name || "-" }}</td>
                <td><span class="badge bg-info">{{ schedule.day }}</span></td>
                <td>{{ schedule.startTimeslot?.start || "-" }} - {{ schedule.endTimeslot?.end || "-" }}</td>
                <td>{{ schedule.Classroom?.classroom_name || "-" }}</td>
                <td class="text-nowrap">
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editSchedule(schedule)" aria-label="Edit jadwal">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteSchedule(schedule)" aria-label="Hapus jadwal">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="7" class="text-center py-4">
                  <span class="spinner-border spinner-border-sm me-2"></span>Memuat jadwal...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import {
  createManagedSchedule,
  deleteManagedSchedule,
  getScheduleManagementData,
  updateManagedSchedule,
} from "@/services/api.js";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const emptyForm = () => ({
  class_id: "",
  subject_id: "",
  teacher_id: "",
  classroom_id: "",
  day: "",
  start_timeslot_id: "",
  end_timeslot_id: "",
});

export default {
  name: "SuperAdminSchedule",
  data() {
    return {
      schedules: [],
      classes: [],
      teachers: [],
      subjects: [],
      classrooms: [],
      timeslots: [],
      days,
      inputMode: "class",
      progressView: "class",
      searchQuery: "",
      filterDay: "",
      filterTeacherId: "",
      filterClassId: "",
      showForm: false,
      loading: false,
      saving: false,
      editingSchedule: null,
      errorMessage: "",
      successMessage: "",
      form: emptyForm(),
    };
  },
  computed: {
    activeTeachers() {
      return this.teachers.filter((teacher) => teacher.status === "active");
    },
    classesWithSchedules() {
      return this.classes.filter((item) =>
        this.schedules.some((schedule) => Number(schedule.class_id) === Number(item.id)),
      ).length;
    },
    teachersWithSchedules() {
      return this.activeTeachers.filter((item) =>
        this.schedules.some((schedule) => Number(schedule.teacher_id) === Number(item.id)),
      ).length;
    },
    progressItems() {
      const entities = this.progressView === "class"
        ? this.classes.map((item) => ({ id: item.id, name: item.class_name, field: "class_id" }))
        : this.activeTeachers.map((item) => ({ id: item.id, name: item.name, field: "teacher_id" }));

      return entities.map((item) => ({
        ...item,
        scheduleCount: this.schedules.filter(
          (schedule) => Number(schedule[item.field]) === Number(item.id),
        ).length,
      }));
    },
    filteredSchedules() {
      const query = this.searchQuery.trim().toLowerCase();
      return this.schedules.filter((schedule) => {
        const searchFields = [
          schedule.Class?.class_name,
          schedule.Subject?.subject_name,
          schedule.Teacher?.name,
        ];
        return (
          (!this.filterDay || schedule.day === this.filterDay) &&
          (!this.filterTeacherId || Number(schedule.teacher_id) === Number(this.filterTeacherId)) &&
          (!this.filterClassId || Number(schedule.class_id) === Number(this.filterClassId)) &&
          searchFields.some((value) => String(value || "").toLowerCase().includes(query))
        );
      }).sort((a, b) => {
        const dayOrderA = days.indexOf(a.day);
        const dayOrderB = days.indexOf(b.day);
        const dayDifference =
          (dayOrderA === -1 ? days.length : dayOrderA) -
          (dayOrderB === -1 ? days.length : dayOrderB);
        return dayDifference ||
          String(a.startTimeslot?.start || "").localeCompare(String(b.startTimeslot?.start || ""));
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const data = await getScheduleManagementData();
        for (const key of ["schedules", "classes", "teachers", "subjects", "classrooms", "timeslots"]) {
          if (!Array.isArray(data[key])) throw new Error(`Format data ${key} tidak valid`);
        }
        Object.assign(this, data);
      } catch (error) {
        this.errorMessage = `Gagal memuat data jadwal: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    setInputMode(mode) {
      this.inputMode = mode;
      this.form.class_id = "";
      this.form.teacher_id = "";
      this.successMessage = "";
    },
    openAddForm(mode = this.inputMode, entityId = null) {
      this.inputMode = mode;
      this.editingSchedule = null;
      this.form = emptyForm();
      if (entityId !== null) {
        this.form[mode === "class" ? "class_id" : "teacher_id"] = Number(entityId);
      }
      this.errorMessage = "";
      this.successMessage = "";
      this.showForm = true;
    },
    editSchedule(schedule) {
      this.editingSchedule = schedule;
      this.form = {
        class_id: schedule.class_id,
        subject_id: schedule.subject_id,
        teacher_id: schedule.teacher_id,
        classroom_id: schedule.classroom_id,
        day: schedule.day,
        start_timeslot_id: schedule.start_timeslot_id,
        end_timeslot_id: schedule.end_timeslot_id,
      };
      this.errorMessage = "";
      this.successMessage = "";
      this.showForm = true;
    },
    async saveSchedule() {
      const start = this.timeslots.find((item) => item.id === Number(this.form.start_timeslot_id));
      const end = this.timeslots.find((item) => item.id === Number(this.form.end_timeslot_id));
      if (!start || !end || start.start >= end.end) {
        this.errorMessage = "Waktu selesai harus setelah waktu mulai.";
        return;
      }

      const payload = {
        ...this.form,
        class_id: Number(this.form.class_id),
        subject_id: Number(this.form.subject_id),
        teacher_id: Number(this.form.teacher_id),
        classroom_id: Number(this.form.classroom_id),
        start_timeslot_id: Number(this.form.start_timeslot_id),
        end_timeslot_id: Number(this.form.end_timeslot_id),
      };
      this.saving = true;
      this.errorMessage = "";
      this.successMessage = "";
      try {
        if (this.editingSchedule) {
          await updateManagedSchedule(this.editingSchedule.id, payload);
          this.showForm = false;
          this.editingSchedule = null;
          await this.fetchData();
        } else {
          await createManagedSchedule(payload);
          const nextForm = emptyForm();
          const primaryField = this.inputMode === "class" ? "class_id" : "teacher_id";
          nextForm[primaryField] = Number(this.form[primaryField]);
          this.form = nextForm;
          this.successMessage = "Jadwal berhasil disimpan. Silakan lanjutkan input jadwal berikutnya.";
          await this.fetchData();
        }
      } catch (error) {
        this.errorMessage = `Gagal menyimpan jadwal: ${error.message}`;
      } finally {
        this.saving = false;
      }
    },
    async deleteSchedule(schedule) {
      if (!window.confirm("Hapus jadwal pelajaran ini?")) return;
      this.errorMessage = "";
      try {
        await deleteManagedSchedule(schedule.id);
        await this.fetchData();
      } catch (error) {
        this.errorMessage = `Gagal menghapus jadwal: ${error.message}`;
      }
    },
    cancelForm() {
      this.showForm = false;
      this.editingSchedule = null;
      this.form = emptyForm();
      this.errorMessage = "";
      this.successMessage = "";
    },
  },
};
</script>
