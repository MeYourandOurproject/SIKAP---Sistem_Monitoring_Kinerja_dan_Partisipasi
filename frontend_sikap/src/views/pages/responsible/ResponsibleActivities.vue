<template>
  <div class="activities-page mb-5 py-3">
    <!-- HEADER -->
    <div class="page-header text-start">
      <div>
        <span class="header-badge"> MANAJEMEN KEGIATAN </span>

        <h2 class="page-title mt-3">Kegiatan Sekolah & KBM</h2>

        <p class="page-subtitle mb-0">
          Kelola seluruh kegiatan sekolah, monitoring status pelaksanaan, dan
          dokumentasi aktivitas guru secara terstruktur.
        </p>
      </div>

      <div class="header-stats">
        <div class="mini-stat">
          <strong>{{ activities.length }}</strong>
          <span>Total Kegiatan</span>
        </div>

        <div class="mini-stat green">
          <strong>{{ ongoingCount }}</strong>
          <span>Berlangsung</span>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="row g-4 mt-1">
      <div class="col-12">
        <div
          class="glass-card"
        >
          <div class="row g-2 align-items-center">
            <div class="col-auto text-start">
              <h5 class="section-title mb-1">Daftar Kegiatan</h5>
              <small class="section-subtitle">
                Monitoring seluruh aktivitas sekolah
              </small>
            </div>
            <div class="col-auto ms-auto">
              <button
                type="button"
                class="submit-btn add-activity-btn"
                @click="openAddModal"
              >
                <i class="bi bi-plus-circle-fill"></i>
                Tambah Kegiatan
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LIST -->
      <div class="col-12 col-xl-12 text-start">
        <div class="glass-card">
          <div
            class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
          >
            <div class="search-box">
              <i class="bi bi-search"></i>

              <input
                type="text"
                v-model="search"
                placeholder="Cari kegiatan..."
              />
            </div>

            <div class="filter-box">
              <select v-model="activityFilter" class="custom-input">
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulan Ini</option>
                <option value="year">Tahun Ini</option>
                <option value="past">Sudah Lewat</option>
                <option value="upcoming">Mendatang</option>
              </select>
            </div>
          </div>

          <!-- LIST -->
          <div v-if="filteredActivities.length" class="activity-grid">
            <div
              v-for="activity in filteredActivities"
              :key="activity.id"
              class="activity-card text-start"
            >
              <!-- TOP -->
              <div class="activity-top">
                <div
                  class="activity-type-icon"
                  :class="
                    activity.type === 'tentative' ? 'blue-icon' : 'green-icon'
                  "
                >
                  <i
                    class="bi"
                    :class="
                      activity.type === 'tentative'
                        ? 'bi-calendar-event-fill'
                        : 'bi-arrow-repeat'
                    "
                  ></i>
                </div>

                <span
                  class="activity-status"
                  :class="statusClass(activityStatus(activity))"
                >
                  {{ activityStatus(activity) }}
                </span>
              </div>

              <!-- BODY -->
              <h5 class="activity-title">
                {{ activity.name }}
              </h5>

              <p class="activity-description">
                {{ activity.description || "Tidak ada deskripsi kegiatan." }}
              </p>

              <!-- INFO -->
              <div class="activity-info">
                <div class="info-item">
                  <i class="bi bi-calendar2-week"></i>

                  {{ activitySchedule(activity) }}
                </div>

                <div class="info-item">
                  <i class="bi bi-person-circle"></i>

                  {{ activity.responsiblePerson || "Belum ditentukan" }}
                </div>

                <div v-if="activity.type === 'routine'" class="info-item">
                  <i class="bi bi-book-half"></i>

                  {{ activitySemester(activity) }}
                </div>

                <div class="info-item align-items-start">
                  <i class="bi bi-people"></i>
                  <div class="teacher-pill-group">
                    <span
                      v-for="(name, index) in getAssignedTeacherNames(activity)"
                      :key="`${activity.id}-teacher-${index}`"
                      class="teacher-pill"
                    >
                      {{ name }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- FOOTER -->
              <div class="activity-footer">
                <span class="activity-category">
                  {{ activity.type === "tentative" ? "Tentatif" : "Rutinitas" }}
                </span>

                <div class="button-row">
                  <button class="detail-btn"><i class="bi bi-eye"></i></button>

                  <button
                    type="button"
                    class="submit-btn"
                    @click="openEditModal(activity)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>

                  <button
                    type="button"
                    class="delete-btn"
                    @click="confirmDelete(activity.id)"
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- EMPTY -->
          <div v-else class="empty-state">
            <i class="bi bi-calendar-x"></i>

            <h5>Belum Ada Kegiatan</h5>

            <p>
              Tambahkan kegiatan pertama Anda untuk mulai monitoring aktivitas
              sekolah.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="addModalVisible"
      class="modal-backdrop pb-lg-0"
      @click.self="closeAddModal"
    >
      <div class="activity-modal">
        <div class="activity-modal-header">
          <div>
            <h5 class="section-title mb-1">{{ editMode ? 'Edit Kegiatan' : 'Tambah Kegiatan' }}</h5>
            <small class="section-subtitle">
              {{ editMode ? 'Ubah detail kegiatan' : 'Input kegiatan baru sekolah' }}
            </small>
          </div>
          <button type="button" class="modal-close" @click="closeAddModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="glass-card modal-content-card">
          <!-- ALERT -->
          <div
            v-if="message.text"
            class="custom-alert"
            :class="
              message.type === 'success'
                ? 'alert-success-custom'
                : 'alert-danger-custom'
            "
          >
            <i
              class="bi"
              :class="
                message.type === 'success'
                  ? 'bi-check-circle-fill'
                  : 'bi-exclamation-circle-fill'
              "
            ></i>

            {{ message.text }}
          </div>

          <form @submit.prevent="submitActivity" class="">
            <div class="row text-start">
              <div class="col-12 col-xl-9">
                <div class="mb-3">
                  <label class="form-label-custom"> Nama Kegiatan </label>

                  <input
                    v-model="form.name"
                    type="text"
                    class="custom-input"
                    placeholder="Contoh: Workshop Kurikulum"
                  />
                </div>
              </div>

              <div class="col-12 col-xl-3 mb-3">
                <label class="form-label-custom">Penanggung Jawab</label>

                <select v-model="form.responsiblePerson" class="custom-input">
                  <option value="">Pilih penanggung jawab</option>
                  <option
                    v-for="teacher in teachers"
                    :key="teacher.id"
                    :value="teacher.name"
                  >
                    {{ teacher.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row g-3 mb-3 text-start">
              <div class="col-12 col-xl-6">
                <label class="form-label-custom"> Jenis Kegiatan </label>

                <select v-model="form.type" class="custom-input">
                  <option value="">Pilih jenis kegiatan</option>

                  <option value="routine">Rutinitas (routine)</option>

                  <option value="tentative">Tentatif (tentative)</option>
                </select>
              </div>

              <div class="col-12 col-xl-6" v-if="form.type === 'routine'">
                <label class="form-label-custom">Hari Rutinitas</label>

                <div class="d-flex flex-wrap gap-2">
                  <label
                    v-for="d in [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ]"
                    :key="d"
                    class="btn-day"
                  >
                    <input
                      type="checkbox"
                      :value="d"
                      v-model="daysSelected"
                    />&nbsp;{{ d }}
                  </label>
                </div>
              </div>

              <div class="col-12 col-xl-6" v-if="form.type === 'tentative'">
                <label class="form-label-custom"> Tanggal </label>

                <input v-model="form.date" type="date" class="custom-input" />
              </div>
            </div>

            <div class="mb-3 text-start">
              <label class="form-label-custom"> Deskripsi </label>

              <textarea
                v-model="form.description"
                rows="4"
                class="custom-input textarea-custom"
                placeholder="Tuliskan deskripsi kegiatan..."
              ></textarea>
            </div>

            <div class="row text-start">
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label-custom">Penugasan Guru</label>

                  <div class="mb-2 mt-2">
                    <label class="assign-all">
                      <input type="checkbox" v-model="assignToAll" />
                      &nbsp;Tugaskan untuk seluruh guru
                    </label>
                  </div>

                  <div v-if="!assignToAll">
                    <small class="section-subtitle"
                      >Pilih guru yang ditugaskan</small
                    >

                    <div class="mb-2 mt-2">
                      <label class="assign-all">
                        <input type="checkbox" v-model="expandTeacherList" />
                        &nbsp;Tampilkan daftar guru tanpa scroll
                      </label>
                    </div>

                    <div
                      :class="['teacher-list', { expanded: expandTeacherList }]"
                    >
                      <div
                        v-for="teacher in teachers"
                        :key="teacher.id"
                        class="teacher-item"
                      >
                        <label>
                          <input
                            type="checkbox"
                            :value="teacher.id"
                            v-model="selectedTeacherIds"
                          />
                          &nbsp;{{ teacher.name }}
                        </label>
                      </div>
                    </div>

                    <div class="row g-2 mt-3">
                      <div class="col-7">
                        <label class="form-label-custom">Semester</label>
                        <select
                          v-model="assignment.semester"
                          class="custom-input"
                        >
                          <option value="">Pilih Semester</option>
                          <option value="odd">Ganjil</option>
                          <option value="even">Genap</option>
                        </select>
                      </div>

                      <div class="col-5">
                        <label class="form-label-custom">Sesi</label>
                        <select
                          v-model="assignment.session"
                          class="custom-input"
                        >
                          <option value="">Pilih Sesi</option>
                          <option value="morning">Pagi</option>
                          <option value="afternoon">Siang</option>
                          <option value="all_day">Sehari</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-3 mt-3">
              <button type="button" class="delete-btn" @click="closeAddModal">
                <i class="bi bi-x-lg"></i>
              </button>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? (editMode ? "Menyimpan..." : "Menyimpan...") : (editMode ? "Simpan Perubahan" : "Simpan Kegiatan") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTeachers,
  getActivities,
  createActivity,
  createTeacherAssignment,
  deleteActivity as deleteActivityAPI,
} from "@/services/api";
import { updateActivity } from "@/services/api";

export default {
  name: "PersonResponsibleActivities",

  data() {
    return {
      search: "",

      form: {
        name: "",
        type: "",
        date: "",
        responsiblePerson: "",
        description: "",
        status: "planned",
      },

      // teachers for assignment
      teachers: [],
      assignToAll: false,
      selectedTeacherIds: [],
      daysSelected: [],
      expandTeacherList: false,
      assignment: {
        semester: "",
        session: "",
        day_of_week: "",
      },

      activities: [],
      activityFilter: "today",

      message: {
        text: "",
        type: "success",
      },

      addModalVisible: false,
      editMode: false,
      editActivityId: null,
      isSubmitting: false,
    };
  },

  computed: {
    filteredActivities() {
      return this.activities
        .filter((item) =>
          item.name.toLowerCase().includes(this.search.toLowerCase()),
        )
        .filter((item) => this.matchesActivityFilter(item));
    },

    ongoingCount() {
      return this.activities.filter((item) => item.status === "ongoing").length;
    },
  },

  mounted() {
    this.fetchTeachers();
    this.fetchActivities();
  },

  methods: {
    async fetchActivities() {
      const response = await getActivities();

      if (response.success) {
        this.activities = response.data;
      }
    },

    async fetchTeachers() {
      const response = await getTeachers();

      if (response.success) {
        this.teachers = response.data.sort((a, b) =>
          a.name.localeCompare(b.name, "id", { sensitivity: "base" }),
        );
      } else {
        this.teachers = [];
      }
    },

    getAssignedTeacherNames(activity) {
      if (activity.target_type === "all_teachers") {
        return ["Untuk semua guru"];
      }

      const assignments = activity.Teacherassignments || [];
      const names = assignments
        .map((assignment) => assignment.Teacher?.name)
        .filter(Boolean);
      const uniqueNames = [...new Set(names)];
      return uniqueNames.length > 0
        ? uniqueNames
        : ["Belum ada guru ditugaskan"];
    },

    matchesActivityFilter(activity) {
      const today = new Date();
      const todayDay = today.toLocaleDateString("en-US", { weekday: "long" });
      const localToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0,
      );
      const startOfWeek = new Date(localToday);
      startOfWeek.setDate(
        localToday.getDate() - ((localToday.getDay() + 6) % 7),
      );
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

      const toDate = (value) => {
        if (!value) return null;
        const parsed = new Date(value);
        parsed.setHours(0, 0, 0, 0);
        return parsed;
      };

      const tentativeDate = activity.date ? toDate(activity.date) : null;
      const routineDays = [
        ...(activity.Teacherassignments || [])
          .map((assignment) => assignment.day_of_week)
          .filter(Boolean),
      ];
      const routineOrder = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const hasRoutineToday = routineDays.includes(todayDay);
      const hasRoutineAny = routineDays.length > 0;
      const hasRoutineUpcoming = routineDays.some(
        (day) => routineOrder.indexOf(day) > routineOrder.indexOf(todayDay),
      );

      switch (this.activityFilter) {
        case "today":
          if (activity.type === "tentative") {
            return tentativeDate
              ? tentativeDate.getTime() === localToday.getTime()
              : false;
          }
          if (activity.type === "routine") {
            return hasRoutineToday;
          }
          return false;

        case "week":
          if (activity.type === "tentative") {
            return tentativeDate
              ? tentativeDate >= startOfWeek && tentativeDate <= endOfWeek
              : false;
          }
          if (activity.type === "routine") {
            return hasRoutineAny;
          }
          return false;

        case "month":
          if (activity.type === "tentative") {
            return tentativeDate
              ? tentativeDate >= startOfMonth && tentativeDate <= endOfMonth
              : false;
          }
          if (activity.type === "routine") {
            return hasRoutineAny;
          }
          return false;

        case "year":
          if (activity.type === "tentative") {
            return tentativeDate
              ? tentativeDate >= startOfYear && tentativeDate <= endOfYear
              : false;
          }
          if (activity.type === "routine") {
            return hasRoutineAny;
          }
          return false;

        case "past":
          if (activity.type === "tentative") {
            return tentativeDate ? tentativeDate < localToday : false;
          }
          return false;

        case "upcoming":
          if (activity.type === "tentative") {
            return tentativeDate ? tentativeDate > localToday : false;
          }
          if (activity.type === "routine") {
            return hasRoutineUpcoming || (hasRoutineAny && !hasRoutineToday);
          }
          return false;

        default:
          return true;
      }
    },

    activityStatus(activity) {
      const today = new Date();
      const todayDay = today.toLocaleDateString("en-US", { weekday: "long" });

      if (activity.type === "tentative" && activity.date) {
        const activityDate = new Date(activity.date);
        if (activityDate.toDateString() === today.toDateString()) {
          return "Berlangsung";
        }
        return activityDate < today ? "Selesai" : "Mendatang";
      }

      if (activity.type === "routine") {
        const assignments = activity.Teacherassignments || [];
        const days = [
          ...new Set(
            assignments
              .map((assignment) => assignment.day_of_week)
              .filter(Boolean),
          ),
        ];
        if (!days.length) {
          return activity.status
            ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1)
            : "Planned";
        }

        if (days.includes(todayDay)) {
          return "Berlangsung";
        }

        const order = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const todayIndex = order.indexOf(todayDay);
        const future = days.some((day) => order.indexOf(day) > todayIndex);
        const past = days.some((day) => order.indexOf(day) < todayIndex);

        if (future) return "Mendatang";
        if (past) return "Selesai";
        return "Berlangsung";
      }

      return activity.status
        ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1)
        : "Planned";
    },

    async submitActivity() {
      // validate depending on type
      if (!this.form.name || !this.form.type) {
        this.message = {
          text: "Nama dan jenis kegiatan wajib diisi.",
          type: "danger",
        };
        return;
      }

      if (this.form.type === "tentative" && !this.form.date) {
        this.message = {
          text: "Tanggal wajib diisi untuk kegiatan tentatif.",
          type: "danger",
        };
        return;
      }

      if (this.form.type === "routine" && this.daysSelected.length === 0) {
        this.message = {
          text: "Pilih minimal satu hari untuk kegiatan rutinitas.",
          type: "danger",
        };
        return;
      }

      this.isSubmitting = true;

      const payload = {
        name: this.form.name,
        type: this.form.type,
        responsiblePerson: this.form.responsiblePerson,
        description: this.form.description,
        status: this.form.status,
        target_type: this.assignToAll ? "all_teachers" : "assigned_teachers",
      };

      if (this.form.type === "tentative") {
        payload.date = this.form.date;
      }

      // If in edit mode, call update endpoint; otherwise create new
      if (this.editMode && this.editActivityId) {
        const updateResponse = await updateActivity(this.editActivityId, payload);
        if (updateResponse.success) {
          this.message = { text: "Kegiatan berhasil diperbarui.", type: "success" };
          this.closeAddModal();
          await this.fetchActivities();
          this.isSubmitting = false;
          return;
        } else {
          this.message = { text: updateResponse.message || "Gagal memperbarui kegiatan.", type: "danger" };
          this.isSubmitting = false;
          return;
        }
      } else {
        const response = await createActivity(payload);

        if (response.success) {
          const activity = response.data;

          // if assigned teachers selected, create Teacherassignment records
          if (!this.assignToAll && this.selectedTeacherIds.length) {
            const promises = [];

            // for routine activities, create one assignment per selected teacher task day
            if (this.form.type === "routine") {
              this.selectedTeacherIds.forEach((teacherId) => {
                this.daysSelected.forEach((day) => {
                  promises.push(
                    createTeacherAssignment({
                      activity_id: activity.id,
                      teacher_id: teacherId,
                      semester: this.assignment.semester || null,
                      session: this.assignment.session || null,
                      day_of_week: day,
                    }),
                  );
                });
              });
            } else {
              this.selectedTeacherIds.forEach((teacherId) => {
                promises.push(
                  createTeacherAssignment({
                    activity_id: activity.id,
                    teacher_id: teacherId,
                    semester: this.assignment.semester || null,
                    session: this.assignment.session || null,
                    day_of_week: this.assignment.day_of_week || null,
                  }),
                );
              });
            }

            await Promise.all(promises);
          }

          this.message = {
            text: "Kegiatan berhasil disimpan.",
            type: "success",
          };
        } else {
          this.message = {
            text: response.message || "Gagal menyimpan kegiatan.",
            type: "danger",
          };
        }
      }

      this.isSubmitting = false;
    },

    async deleteActivity(id) {
      const response = await deleteActivityAPI(id);
      if (response.success) {
        this.message = { text: "Kegiatan berhasil dihapus.", type: "success" };
        this.fetchActivities();
      } else {
        this.message = {
          text: response.message || "Gagal menghapus kegiatan.",
          type: "danger",
        };
      }
    },

    openEditModal(activity) {
      this.editMode = true;
      this.editActivityId = activity.id;
      // clear any existing alert when opening edit modal
      this.message.text = "";
      this.form = {
        name: activity.name || "",
        type: activity.type || "",
        date: activity.date || "",
        responsiblePerson: activity.responsiblePerson || "",
        description: activity.description || "",
        status: activity.status || "planned",
      };
      this.assignToAll = activity.target_type === "all_teachers";
      this.selectedTeacherIds = (activity.Teacherassignments || [])
        .map((assignment) => assignment.teacher_id)
        .filter(Boolean);
      this.daysSelected = (activity.Teacherassignments || [])
        .map((assignment) => assignment.day_of_week)
        .filter(Boolean);
      const firstAssignment = (activity.Teacherassignments || [])[0] || {};
      this.assignment = {
        semester: firstAssignment.semester || "",
        session: firstAssignment.session || "",
        day_of_week: firstAssignment.day_of_week || "",
      };
      this.expandTeacherList = false;
      this.addModalVisible = true;
    },

    confirmDelete(id) {
      const confirmed = window.confirm(
        "Hapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.",
      );
      if (confirmed) {
        this.deleteActivity(id);
      }
    },

    openAddModal() {
      // clear any existing alert when opening add modal
      this.message.text = "";
      this.editMode = false;
      this.editActivityId = null;
      this.form = {
        name: "",
        type: "",
        date: "",
        responsiblePerson: "",
        description: "",
        status: "planned",
      };
      this.assignToAll = false;
      this.selectedTeacherIds = [];
      this.daysSelected = [];
      this.assignment = { semester: "", session: "", day_of_week: "" };
      this.expandTeacherList = false;
      this.addModalVisible = true;
    },

    closeAddModal() {
      this.addModalVisible = false;
      this.editMode = false;
      this.editActivityId = null;
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },

    translateDayName(day) {
      const map = {
        Monday: "Senin",
        Tuesday: "Selasa",
        Wednesday: "Rabu",
        Thursday: "Kamis",
        Friday: "Jumat",
        Saturday: "Sabtu",
        Sunday: "Minggu",
      };
      return map[day] || day;
    },

    translateSession(session) {
      const map = {
        morning: "Pagi",
        afternoon: "Siang",
        all_day: "Sehari",
      };
      return map[session] || session;
    },

    activitySchedule(activity) {
      if (activity.type === "tentative") {
        return activity.date
          ? this.formatDate(activity.date)
          : "Tanggal belum diisi";
      }

      if (activity.type === "routine") {
        const assignments = activity.Teacherassignments || [];
        const days = [
          ...new Set(assignments.map((a) => a.day_of_week).filter(Boolean)),
        ];
        const sessions = [
          ...new Set(assignments.map((a) => a.session).filter(Boolean)),
        ];

        const dayLabel = days.length
          ? days.map((day) => this.translateDayName(day)).join(", ")
          : "Hari belum ditentukan";
        const sessionLabel = sessions.length
          ? sessions.map((session) => this.translateSession(session)).join(", ")
          : null;

        return sessionLabel ? `${dayLabel} · ${sessionLabel}` : dayLabel;
      }

      return "Jadwal tidak tersedia";
    },

    translateSemester(semester) {
      const map = {
        odd: "Ganjil",
        even: "Genap",
      };
      return map[semester] || semester;
    },

    activitySemester(activity) {
      const assignments = activity.Teacherassignments || [];
      const semesters = [
        ...new Set(assignments.map((a) => a.semester).filter(Boolean)),
      ];
      if (!semesters.length) {
        return "Semester belum ditentukan";
      }
      return semesters
        .map((semester) => this.translateSemester(semester))
        .join(", ");
    },

    statusClass(status) {
      switch (status) {
        case "Berlangsung":
        case "ongoing":
          return "status-primary rounded-3 p-2";

        case "Selesai":
        case "completed":
          return "status-success rounded-3 p-2";

        case "cancelled":
          return "status-danger rounded-3 p-2";

        case "Mendatang":
          return "status-secondary rounded-3 p-2";

        default:
          return "status-secondary rounded-3 p-2";
      }
    },
  },
};
</script>

<style scoped>
.activities-page {
  color: white;

  animation: fadePage 0.3s ease;
}

/* HEADER */
.page-header {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.18),
    rgba(15, 23, 42, 0.95)
  );

  border: 1px solid rgba(255, 255, 255, 0.06);

  border-radius: 28px;

  padding: 28px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;

  flex-wrap: wrap;
}

.header-badge {
  background: rgba(34, 197, 94, 0.15);

  color: #4ade80;

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 1px;
}

.page-title {
  font-size: 34px;

  font-weight: 700;

  color: white;
}

.page-subtitle {
  color: #94a3b8;

  max-width: 700px;

  line-height: 1.7;
}

.header-stats {
  display: flex;

  gap: 16px;
}

.mini-stat {
  min-width: 130px;

  background: rgba(255, 255, 255, 0.04);

  border: 1px solid rgba(255, 255, 255, 0.06);

  border-radius: 20px;

  padding: 18px;

  text-align: center;
}

.mini-stat strong {
  display: block;

  font-size: 26px;

  color: white;
}

.mini-stat span {
  color: #94a3b8;

  font-size: 12px;
}

.mini-stat.green strong {
  color: #4ade80;
}

/* CARD */
.glass-card {
  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.05);

  border-radius: 28px;

  padding: 24px;
}

.section-title {
  color: white;

  font-weight: 700;
}

.section-subtitle {
  color: #94a3b8;
}

/* FORM */
.form-card {
  position: sticky;

  top: 20px;
}

.form-top {
  display: flex;
  align-items: center;

  gap: 16px;
}

.form-icon {
  width: 58px;
  height: 58px;

  border-radius: 18px;

  background: rgba(59, 130, 246, 0.15);

  color: #60a5fa;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.form-label-custom {
  display: block;

  margin-bottom: 10px;

  color: #cbd5e1;

  font-size: 13px;
  font-weight: 600;
}

.custom-input {
  width: 100%;

  height: 52px;

  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.06);

  border-radius: 16px;

  padding: 0 16px;

  color: white;

  outline: none;

  transition: 0.2s ease;
}

.textarea-custom {
  height: auto;

  padding-top: 14px;
}

.teacher-list {
  max-height: 200px;
  overflow: auto;
  padding: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.teacher-list.expanded {
  max-height: none;
  overflow: visible;
}

.teacher-item {
  padding: 6px 8px;
  color: #e6eef8;
}

.assign-all input {
  transform: translateY(1px);
}

.btn-day {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.03);
}
.btn-day input {
  transform: translateY(2px);
}

.custom-input:focus {
  border-color: rgba(59, 130, 246, 0.4);

  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.custom-input::placeholder {
  color: #64748b;
}

.submit-btn {
  width: 100%;

  height: 54px;

  border: none;

  border-radius: 18px;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);

  color: white;

  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  transition: 0.25s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  padding-bottom: 150px;
  z-index: 2000;
}

.activity-modal {
  width: min(980px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
}

.activity-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.modal-close {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-content-card {
  padding: 0;
  background: transparent;
  border: none;
  margin-bottom: 20px;
}

.add-activity-btn {
  min-width: 220px;
}

/* border-radius: 16px;

  margin-bottom: 18px;

  display: flex;
  align-items: center;

  gap: 10px;

  font-size: 14px;
} */

.alert-success-custom {
  background: rgba(34, 197, 94, 0.15);

  color: #4ade80;
}

.alert-danger-custom {
  background: rgba(239, 68, 68, 0.15);

  color: #f87171;
}

/* SEARCH */
.search-box {
  width: 260px;
  height: 48px;

  background: rgba(255, 255, 255, 0.04);

  border: 1px solid rgba(255, 255, 255, 0.06);

  border-radius: 16px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 16px;
}

.search-box i {
  color: #94a3b8;
}

.search-box input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: white;
}

.search-box input::placeholder {
  color: #64748b;
}

/* GRID */
.activity-grid {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  gap: 18px;
}

.activity-card {
  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(255, 255, 255, 0.05);

  border-radius: 24px;

  padding: 20px;

  transition: 0.25s ease;
}

.activity-card:hover {
  transform: translateY(-4px);

  background: rgba(255, 255, 255, 0.05);
}

.activity-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 18px;
}

.activity-type-icon {
  width: 54px;
  height: 54px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.blue-icon {
  background: rgba(59, 130, 246, 0.15);

  color: #60a5fa;
}

.green-icon {
  background: rgba(34, 197, 94, 0.15);

  color: #4ade80;
}

.activity-title {
  color: white;

  font-size: 18px;
  font-weight: 700;

  margin-bottom: 10px;
}

.activity-description {
  color: #94a3b8;

  font-size: 13px;

  line-height: 1.7;

  min-height: 50px;
}

.activity-info {
  display: flex;
  flex-direction: column;

  gap: 10px;

  margin-top: 18px;
}

.info-item {
  display: flex;
  align-items: center;

  gap: 10px;

  color: #cbd5e1;

  font-size: 13px;
}

.teacher-pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.teacher-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #cbd5e1;
  font-size: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.activity-footer {
  margin-top: 20px;

  padding-top: 16px;

  border-top: 1px solid rgba(255, 255, 255, 0.06);

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-category {
  background: rgba(255, 255, 255, 0.05);

  color: #cbd5e1;

  padding: 7px 12px;

  border-radius: 999px;

  font-size: 12px;
}

.detail-btn {
  border: none;

  height: 40px;

  padding: 0 18px;

  border-radius: 12px;

  background: rgba(59, 130, 246, 0.15);

  color: #60a5fa;

  font-size: 13px;
  font-weight: 600;
}

.button-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delete-btn {
  border: none;
  /* height: 40px; */
  padding: 10px 18px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.18);
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.status-success {
  background: rgba(34, 197, 94, 0.15);

  color: #4ade80;
}

.status-danger {
  background: rgba(239, 68, 68, 0.15);

  color: #f87171;
}

.status-primary {
  background: rgba(59, 130, 246, 0.15);

  color: #60a5fa;
}

.status-secondary {
  background: rgba(148, 163, 184, 0.15);

  color: #cbd5e1;
}

/* EMPTY */
.empty-state {
  padding: 80px 20px;

  text-align: center;

  color: #94a3b8;
}

.empty-state i {
  font-size: 60px;

  margin-bottom: 18px;

  color: #475569;
}

/* ANIMATION */
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

/* MOBILE */
@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .header-stats {
    width: 100%;
  }

  .mini-stat {
    flex: 1;
  }

  .search-box {
    width: 100%;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
