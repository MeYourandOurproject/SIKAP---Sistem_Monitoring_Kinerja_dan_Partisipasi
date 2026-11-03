<template>
  <section class="superadmin-homeroom mt-3 text-start">
    <div class="mb-4">
      <h2 class="mb-1">Kelola Wali Kelas</h2>
      <p class="text-muted mb-0">Atur wali kelas untuk setiap kelas yang terdaftar.</p>
    </div>

    <div class="card shadow-sm">
      <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h5 class="mb-0">Daftar Wali Kelas</h5>
          <div class="small text-muted">Pilih guru untuk setiap kelas, lalu simpan perubahan.</div>
        </div>
        <select
          v-model="selectedGrade"
          class="form-select form-select-sm"
          aria-label="Filter jenjang kelas"
          style="max-width: 180px"
        >
          <option value="">Semua jenjang</option>
          <option value="10">Kelas X</option>
          <option value="11">Kelas XI</option>
          <option value="12">Kelas XII</option>
        </select>
      </div>
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</div>
        <div v-if="loading" class="text-center py-4">
          <span class="spinner-border spinner-border-sm me-2" role="status"></span>
          Memuat data kelas dan guru...
        </div>
        <div v-else-if="!errorMessage && filteredClasses.length === 0" class="text-muted py-3">
          Tidak ada kelas pada jenjang yang dipilih.
        </div>
        <div v-else-if="!loading && !errorMessage" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Kelas</th>
                <th scope="col">Jurusan</th>
                <th scope="col">Jumlah Siswa</th>
                <th scope="col">Wali Kelas</th>
                <th scope="col" class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="classItem in filteredClasses" :key="classItem.id">
                <td class="fw-semibold">{{ classItem.class_name }}</td>
                <td>{{ classItem.major }}</td>
                <td>{{ classItem.total_student }}</td>
                <td>
                  <select
                    v-model="teacherSelections[classItem.id]"
                    class="form-select form-select-sm"
                    :disabled="savingClassId !== null"
                    :aria-label="`Wali kelas ${classItem.class_name}`"
                    @change="clearClassSaveError(classItem.id)"
                  >
                    <option value="">Belum ditentukan</option>
                    <option
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :value="String(teacher.id)"
                    >
                      {{ teacher.name }}{{ teacher.status === "inactive" ? " (Nonaktif)" : "" }}
                    </option>
                  </select>
                  <div v-if="classSaveErrors[classItem.id]" class="text-danger small mt-1" role="alert">
                    {{ classSaveErrors[classItem.id] }}
                  </div>
                </td>
                <td class="text-end">
                  <button
                    class="btn btn-outline-success btn-sm"
                    type="button"
                    :disabled="
                      savingClassId !== null ||
                      teacherSelections[classItem.id] === String(classItem.classteacher_id ?? '')
                    "
                    @click="saveClassTeacher(classItem)"
                  >
                    <span v-if="savingClassId === classItem.id" class="spinner-border spinner-border-sm me-1"></span>
                    {{ savingClassId === classItem.id ? "Menyimpan..." : "Simpan" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getManagedClasses, getManagedTeachers, updateManagedClass } from "@/services/api.js";

export default {
  name: "SuperAdminHomeroom",
  data() {
    return {
      classes: [],
      teachers: [],
      teacherSelections: {},
      classSaveErrors: {},
      loading: true,
      savingClassId: null,
      selectedGrade: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    filteredClasses() {
      return this.classes
        .filter((classItem) => !this.selectedGrade || String(classItem.level) === this.selectedGrade)
        .slice()
        .sort((a, b) => {
          const levelOrder = String(a.level).localeCompare(String(b.level));
          return levelOrder || a.class_name.localeCompare(b.class_name, "id");
        });
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const [classes, teachers] = await Promise.all([
          getManagedClasses(),
          getManagedTeachers(),
        ]);
        this.classes = classes;
        this.teachers = teachers;
        this.teacherSelections = Object.fromEntries(
          classes.map((classItem) => [classItem.id, String(classItem.classteacher_id ?? "")]),
        );
      } catch (error) {
        this.errorMessage = `Gagal memuat data kelas atau guru: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    clearClassSaveError(classId) {
      delete this.classSaveErrors[classId];
      this.successMessage = "";
    },
    async saveClassTeacher(classItem) {
      const selectedTeacherId = this.teacherSelections[classItem.id] || null;
      this.savingClassId = classItem.id;
      this.errorMessage = "";
      this.successMessage = "";
      this.classSaveErrors = { ...this.classSaveErrors, [classItem.id]: "" };
      try {
        const updatedClass = await updateManagedClass(classItem.id, {
          classteacher_id: selectedTeacherId ? Number(selectedTeacherId) : null,
        });
        classItem.classteacher_id = updatedClass.classteacher_id;
        this.teacherSelections[classItem.id] = String(updatedClass.classteacher_id ?? "");
        this.successMessage = `Wali kelas ${classItem.class_name} berhasil diperbarui.`;
      } catch (error) {
        this.classSaveErrors = {
          ...this.classSaveErrors,
          [classItem.id]: `Gagal menyimpan wali kelas: ${error.message}`,
        };
      } finally {
        this.savingClassId = null;
      }
    },
  },
};
</script>
