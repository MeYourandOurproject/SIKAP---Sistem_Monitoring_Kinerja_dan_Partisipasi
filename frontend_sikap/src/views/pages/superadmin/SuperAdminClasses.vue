<template>
  <section class="superadmin-classes mt-3 text-start">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h2 class="mb-1">Kelola Data Siswa</h2>
        <p class="text-muted mb-0">
          Tambah, ubah, hapus, dan filter data siswa berdasarkan jurusan atau kelas.
        </p>
      </div>
      <button v-if="!showForm" class="btn btn-success" type="button" @click="openAddForm">
        <i class="bi bi-person-plus me-2"></i>Tambah Siswa
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</div>

    <div v-if="showForm" class="card shadow-sm mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingStudent ? "Edit Data Siswa" : "Tambah Siswa" }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveStudent">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="student-name" class="form-label">Nama Lengkap *</label>
              <input id="student-name" v-model.trim="studentForm.name" class="form-control" required maxlength="255" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="student-nis" class="form-label">NIS</label>
              <input id="student-nis" v-model.trim="studentForm.nis" class="form-control" maxlength="20" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="student-nisn" class="form-label">NISN</label>
              <input id="student-nisn" v-model.trim="studentForm.nisn" class="form-control" maxlength="20" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="student-gender" class="form-label">Jenis Kelamin</label>
              <select id="student-gender" v-model="studentForm.gender" class="form-select">
                <option value="">Pilih jenis kelamin</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="student-class" class="form-label">Kelas *</label>
              <select id="student-class" v-model="studentForm.class_id" class="form-select" required>
                <option value="">Pilih kelas</option>
                <option v-for="classItem in sortedClasses" :key="classItem.id" :value="String(classItem.id)">
                  {{ classItem.class_name }} - {{ classItem.major }}
                </option>
              </select>
            </div>
          </div>
          <button class="btn btn-success me-2" type="submit" :disabled="savingStudent || classesLoading">
            {{ savingStudent ? "Menyimpan..." : editingStudent ? "Simpan Perubahan" : "Simpan" }}
          </button>
          <button class="btn btn-secondary" type="button" :disabled="savingStudent" @click="cancelForm">Batal</button>
        </form>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-header">
        <h5 class="mb-0">Daftar Siswa</h5>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-3">
          <div class="col-md-4">
            <label for="filter-major" class="form-label">Filter jurusan</label>
            <select id="filter-major" v-model="selectedMajor" class="form-select" @change="selectedClassId = ''">
              <option value="">Semua jurusan</option>
              <option v-for="major in majors" :key="major" :value="major">{{ major }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="filter-class" class="form-label">Filter kelas</label>
            <select id="filter-class" v-model="selectedClassId" class="form-select">
              <option value="">Semua kelas</option>
              <option v-for="classItem in filterClasses" :key="classItem.id" :value="String(classItem.id)">
                {{ classItem.class_name }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="student-search" class="form-label">Cari siswa</label>
            <input id="student-search" v-model.trim="searchQuery" class="form-control" type="search" placeholder="Nama, NIS, atau NISN" />
          </div>
        </div>
        <div v-if="studentsLoading || classesLoading" class="text-center py-4">
          <span class="spinner-border spinner-border-sm me-2" role="status"></span>Memuat data siswa...
        </div>
        <div v-else-if="!errorMessage && filteredStudents.length === 0" class="text-center text-muted py-4">
          Tidak ada data siswa untuk filter yang dipilih.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">NIS</th>
                <!-- <th scope="col">NISN</th> -->
                <th scope="col">Nama</th>
                <th scope="col">Jenis Kelamin</th>
                <!-- <th scope="col">Jurusan</th> -->
                <th scope="col">Kelas</th>
                <th scope="col">Status</th>
                <th scope="col" class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in filteredStudents" :key="student.id">
                <td>{{ index + 1 }}</td>
                <td>{{ student.nis || "-" }}</td>
                <!-- <td>{{ student.nisn || "-" }}</td> -->
                <td class="text-start">{{ student.name }}</td>
                <td>{{ student.gender === "Male" ? "Laki-laki" : student.gender === "Female" ? "Perempuan" : "-" }}</td>
                <!-- <td>{{ student.class?.major || getClass(student.class_id)?.major || "-" }}</td> -->
                <td>{{ student.class?.class_name || getClass(student.class_id)?.class_name || "-" }}</td>
                <td>
                  <span class="badge" :class="student.status === 'active' ? 'bg-success' : 'bg-secondary'">
                    {{ student.status === "active" ? "Aktif" : "Nonaktif" }}
                  </span>
                </td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-outline-primary me-1" type="button" aria-label="Edit siswa" @click="editStudent(student)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    :class="student.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'"
                    type="button"
                    :aria-label="student.status === 'active' ? 'Nonaktifkan siswa' : 'Aktifkan siswa'"
                    :disabled="updatingStudentId === student.id"
                    @click="toggleStudentStatus(student)"
                  >
                    <span v-if="updatingStudentId === student.id" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi" :class="student.status === 'active' ? 'bi-person-dash' : 'bi-person-check'"></i>
                    {{ student.status === "active" ? "Nonaktifkan" : "Aktifkan" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <h3 class="h5 mb-1">Unggah Daftar Siswa</h3>
      <p class="text-muted mb-0">
        Unduh template dan unggah data secara terpisah untuk kelas X, XI, dan XII.
      </p>
    </div>

    <div class="row g-4">
      <div v-for="grade in grades" :key="grade.level" class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h5 class="mb-0">Input Siswa Kelas {{ grade.level }}</h5>
              <div class="small text-muted">Unggah satu file untuk semua kelas di jenjang ini.</div>
            </div>
            <button
              class="btn btn-outline-success btn-sm"
              type="button"
              :disabled="gradeUploads[grade.level].downloadingTemplate"
              @click="downloadTemplate(grade.level)"
            >
              <span
                v-if="gradeUploads[grade.level].downloadingTemplate"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <i v-else class="bi bi-download me-2"></i>
              Template Kelas {{ grade.level }}
            </button>
          </div>

          <div class="card-body">
            <div
              v-if="gradeUploads[grade.level].errorMessage"
              class="alert alert-danger"
              role="alert"
            >
              <div>{{ gradeUploads[grade.level].errorMessage }}</div>
              <ul
                v-if="gradeUploads[grade.level].rowErrors.length"
                class="mb-0 mt-2"
              >
                <li
                  v-for="(error, index) in gradeUploads[grade.level].rowErrors"
                  :key="`${index}-${error}`"
                >
                  {{ error }}
                </li>
              </ul>
              <div v-if="gradeUploads[grade.level].errorsTruncated" class="small mt-2">
                Sebagian kesalahan tidak ditampilkan. Perbaiki data lain dan unggah kembali.
              </div>
            </div>
            <div
              v-if="gradeUploads[grade.level].successMessage"
              class="alert alert-success"
              role="status"
            >
              {{ gradeUploads[grade.level].successMessage }}
            </div>

            <form @submit.prevent="submitImport(grade.level)">
              <div class="mb-3">
                <label :for="`student-file-${grade.level}`" class="form-label">
                  File Excel kelas {{ grade.level }} *
                </label>
                <input
                  :id="`student-file-${grade.level}`"
                  class="form-control"
                  type="file"
                  accept=".xlsx"
                  :disabled="gradeUploads[grade.level].uploading"
                  required
                  @change="selectFile($event, grade.level)"
                />
                <div class="form-text">Format .xlsx, maksimal 5 MB.</div>
                <div
                  v-if="gradeUploads[grade.level].selectedFile"
                  class="small mt-2 text-muted"
                >
                  File dipilih: {{ gradeUploads[grade.level].selectedFile.name }}
                </div>
              </div>

              <div class="alert alert-info py-2">
                <div class="fw-semibold mb-1">Format workbook</div>
                <div class="small">
                  Gunakan template SIKAP yang diunduh untuk jenjang ini. Jangan ubah nama sheet:
                  nama tersebut berasal dari data kelas resmi di aplikasi. Isi baris pertama dengan
                  header <code>nis, nisn, nama, gender</code>. Setiap sheet otomatis masuk ke kelas
                  yang namanya sama; impor tidak membuat atau mengubah data kelas. Sheet dari file
                  sekolah perlu disalin ke template ini terlebih dahulu.
                </div>
              </div>

              <button
                class="btn btn-success"
                type="submit"
                :disabled="
                  gradeUploads[grade.level].uploading ||
                  !gradeUploads[grade.level].selectedFile
                "
              >
                <span
                  v-if="gradeUploads[grade.level].uploading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <i v-else class="bi bi-cloud-arrow-up me-2"></i>
                {{
                  gradeUploads[grade.level].uploading
                    ? "Mengunggah dan menyimpan..."
                    : `Unggah data kelas ${grade.level}`
                }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  createManagedStudent,
  downloadStudentImportTemplate,
  getManagedClasses,
  getManagedStudents,
  importStudentsFromFile,
  updateManagedStudent,
} from "@/services/api.js";

const maxFileSize = 5 * 1024 * 1024;
const grades = [
  { level: "X" },
  { level: "XI" },
  { level: "XII" },
];

function createUploadState() {
  return {
    selectedFile: null,
    uploading: false,
    downloadingTemplate: false,
    errorMessage: "",
    rowErrors: [],
    errorsTruncated: false,
    successMessage: "",
  };
}

function emptyStudentForm() {
  return { nis: "", nisn: "", name: "", gender: "", class_id: "" };
}

export default {
  name: "SuperAdminStudents",
  data() {
    return {
      grades,
      classes: [],
      classesLoading: true,
      students: [],
      studentsLoading: true,
      showForm: false,
      savingStudent: false,
      updatingStudentId: null,
      editingStudent: null,
      errorMessage: "",
      successMessage: "",
      studentForm: emptyStudentForm(),
      selectedMajor: "",
      selectedClassId: "",
      searchQuery: "",
      gradeUploads: {
        X: createUploadState(),
        XI: createUploadState(),
        XII: createUploadState(),
      },
    };
  },
  computed: {
    sortedClasses() {
      return this.classes
        .slice()
        .sort((a, b) => a.class_name.localeCompare(b.class_name, "id"));
    },
    majors() {
      return [...new Set(this.classes.map((classItem) => classItem.major).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "id"));
    },
    filterClasses() {
      return this.sortedClasses.filter(
        (classItem) => !this.selectedMajor || classItem.major === this.selectedMajor,
      );
    },
    filteredStudents() {
      const query = this.searchQuery.toLocaleLowerCase("id-ID");
      return this.students.filter((student) => {
        const classItem = this.getClass(student.class_id);
        const matchesMajor = !this.selectedMajor || classItem?.major === this.selectedMajor;
        const matchesClass =
          !this.selectedClassId || String(student.class_id) === this.selectedClassId;
        const matchesSearch =
          !query ||
          [student.name, student.nis, student.nisn]
            .some((value) => String(value || "").toLocaleLowerCase("id-ID").includes(query));
        return matchesMajor && matchesClass && matchesSearch;
      });
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getClass(classId) {
      return this.classes.find((classItem) => Number(classItem.id) === Number(classId));
    },
    async loadData() {
      this.classesLoading = true;
      this.studentsLoading = true;
      this.errorMessage = "";
      try {
        const [classes, students] = await Promise.all([
          getManagedClasses(),
          getManagedStudents(),
        ]);
        this.classes = classes;
        this.students = students;
      } catch (error) {
        this.errorMessage = `Gagal memuat data siswa dan kelas: ${error.message}`;
      } finally {
        this.classesLoading = false;
        this.studentsLoading = false;
      }
    },
    openAddForm() {
      this.errorMessage = "";
      this.successMessage = "";
      this.editingStudent = null;
      this.studentForm = emptyStudentForm();
      this.showForm = true;
    },
    editStudent(student) {
      this.errorMessage = "";
      this.successMessage = "";
      this.editingStudent = student;
      this.studentForm = {
        nis: student.nis || "",
        nisn: student.nisn || "",
        name: student.name,
        gender: student.gender || "",
        class_id: String(student.class_id),
      };
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.editingStudent = null;
      this.studentForm = emptyStudentForm();
    },
    async saveStudent() {
      this.savingStudent = true;
      this.errorMessage = "";
      this.successMessage = "";
      const payload = {
        nis: this.studentForm.nis || null,
        nisn: this.studentForm.nisn || null,
        name: this.studentForm.name,
        gender: this.studentForm.gender || null,
        class_id: Number(this.studentForm.class_id),
      };
      try {
        if (this.editingStudent) {
          await updateManagedStudent(this.editingStudent.id, payload);
          this.successMessage = `Data siswa ${payload.name} berhasil diperbarui.`;
        } else {
          await createManagedStudent(payload);
          this.successMessage = `Data siswa ${payload.name} berhasil ditambahkan.`;
        }
        await this.loadData();
        this.cancelForm();
      } catch (error) {
        this.errorMessage = `Gagal menyimpan data siswa: ${error.message}`;
      } finally {
        this.savingStudent = false;
      }
    },
    async toggleStudentStatus(student) {
      const status = student.status === "active" ? "inactive" : "active";
      if (
        status === "inactive" &&
        !confirm(`Nonaktifkan siswa ${student.name}? Data siswa tetap tersimpan.`)
      ) {
        return;
      }
      this.updatingStudentId = student.id;
      this.errorMessage = "";
      this.successMessage = "";
      try {
        const updatedStudent = await updateManagedStudent(student.id, { status });
        student.status = updatedStudent.status;
        this.successMessage =
          status === "active"
            ? `Siswa ${student.name} berhasil diaktifkan kembali.`
            : `Siswa ${student.name} berhasil dinonaktifkan. Data tetap tersimpan.`;
      } catch (error) {
        this.errorMessage = `Gagal mengubah status siswa: ${error.message}`;
      } finally {
        this.updatingStudentId = null;
      }
    },
    selectFile(event, level) {
      const upload = this.gradeUploads[level];
      upload.errorMessage = "";
      upload.rowErrors = [];
      upload.errorsTruncated = false;
      upload.successMessage = "";
      const file = event.target.files?.[0] || null;
      if (!file) {
        upload.selectedFile = null;
        return;
      }
      if (!/\.xlsx$/i.test(file.name)) {
        upload.selectedFile = null;
        event.target.value = "";
        upload.errorMessage = "Pilih file dengan format .xlsx.";
        return;
      }
      if (file.size > maxFileSize) {
        upload.selectedFile = null;
        event.target.value = "";
        upload.errorMessage = "Ukuran file maksimal 5 MB.";
        return;
      }
      upload.selectedFile = file;
    },
    async downloadTemplate(level) {
      const upload = this.gradeUploads[level];
      upload.downloadingTemplate = true;
      upload.errorMessage = "";
      try {
        const blob = await downloadStudentImportTemplate(level);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `template-data-siswa-kelas-${level.toLowerCase()}.xlsx`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        upload.errorMessage = `Gagal mengunduh template: ${error.message}`;
      } finally {
        upload.downloadingTemplate = false;
      }
    },
    async submitImport(level) {
      const upload = this.gradeUploads[level];
      if (!upload.selectedFile) return;
      upload.uploading = true;
      upload.errorMessage = "";
      upload.rowErrors = [];
      upload.errorsTruncated = false;
      upload.successMessage = "";
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const result = await importStudentsFromFile(upload.selectedFile, level);
        upload.successMessage =
          `${result.importedCount} siswa berhasil diimpor ke ${result.classes.length} kelas pada jenjang ${level}.`;
        upload.selectedFile = null;
        const fileInput = document.getElementById(`student-file-${level}`);
        if (fileInput) fileInput.value = "";
        try {
          this.students = await getManagedStudents();
        } catch (error) {
          this.errorMessage = `Impor berhasil, tetapi daftar siswa gagal diperbarui: ${error.message}`;
        }
      } catch (error) {
        upload.errorMessage = error.message || "Gagal mengimpor data siswa.";
        upload.rowErrors = error.data?.errors || [];
        upload.errorsTruncated = Boolean(error.data?.errorsTruncated);
      } finally {
        upload.uploading = false;
      }
    },
  },
};
</script>
