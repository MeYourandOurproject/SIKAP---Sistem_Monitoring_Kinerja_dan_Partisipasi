<template>
  <section class="superadmin-teacher mt-3">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h2 class="mb-1">Manajemen Data Guru</h2>
        <p class="text-muted mb-0">Kelola profil, identitas, dan status guru.</p>
      </div>
      <button v-if="!showForm" class="btn btn-success" @click="openAddForm">
        <i class="bi bi-plus-circle me-2"></i>Tambah Guru
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success" role="status">
      {{ successMessage }}
    </div>

    <div v-if="showForm" class="card shadow-sm mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingTeacher ? "Edit Data Guru" : "Tambah Guru" }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveTeacher">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nama Lengkap *</label>
              <input v-model.trim="form.name" class="form-control" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">NIP</label>
              <input v-model.trim="form.nip" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">NUPTK</label>
              <input v-model.trim="form.nuptk" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Jenis Kelamin *</label>
              <select v-model="form.gender" class="form-select" required>
                <option value="">Pilih jenis kelamin</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Jenis PTK</label>
              <input v-model.trim="form.ptk_type" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Jenis GTK</label>
              <input v-model.trim="form.gtk_type" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select" required>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak aktif</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary me-2" type="submit" :disabled="saving">
            {{ saving ? "Menyimpan..." : editingTeacher ? "Simpan Perubahan" : "Simpan" }}
          </button>
          <button class="btn btn-secondary" type="button" @click="cancelForm">Batal</button>
        </form>
      </div>
    </div>

    <template v-else>
      <div class="row mb-3">
        <div class="col-md-5">
          <input
            v-model="searchQuery"
            class="form-control"
            type="search"
            placeholder="Cari nama, NIP, atau NUPTK..."
          />
        </div>
      </div>
      <div v-if="selectedTeacherIds.length" class="bulk-toolbar mb-3">
        <div class="d-flex flex-wrap align-items-center gap-2">
          <span class="fw-semibold">
            <i class="bi bi-check2-square me-1"></i>
            {{ selectedTeacherIds.length }} guru dipilih
          </span>
          <button
            type="button"
            class="btn btn-sm btn-success"
            :disabled="bulkUpdating"
            @click="setSelectedStatus('active')"
          >
            <i class="bi bi-person-check me-1"></i>Aktifkan
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            :disabled="bulkUpdating"
            @click="setSelectedStatus('inactive')"
          >
            <i class="bi bi-person-dash me-1"></i>Nonaktifkan
          </button>
          <button
            type="button"
            class="btn btn-sm btn-link text-decoration-none"
            :disabled="bulkUpdating"
            @click="selectedTeacherIds = []"
          >
            Batal pilih
          </button>
          <span v-if="bulkUpdating" class="small text-muted">
            <span class="spinner-border spinner-border-sm me-1"></span>Memperbarui status...
          </span>
        </div>
      </div>
      <div class="card shadow-sm">
        <div class="card-body table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="selection-column">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="allFilteredSelected"
                    :disabled="filteredTeachers.length === 0 || loading || bulkUpdating"
                    aria-label="Pilih semua guru yang tampil"
                    @change="toggleSelectAll"
                  />
                </th>
                <th>Nama</th><th>NIP</th><th>NUPTK</th><th>Jenis Kelamin</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!loading && filteredTeachers.length === 0">
                <td colspan="7" class="text-center text-muted py-4">Tidak ada data guru</td>
              </tr>
              <tr v-for="teacher in filteredTeachers" :key="teacher.id">
                <td>
                  <input
                    v-model="selectedTeacherIds"
                    class="form-check-input"
                    type="checkbox"
                    :value="teacher.id"
                    :aria-label="`Pilih ${teacher.name}`"
                    :disabled="bulkUpdating"
                  />
                </td>
                <td class="text-start">{{ teacher.name }}</td>
                <td>{{ teacher.nip || "-" }}</td>
                <td>{{ teacher.nuptk || "-" }}</td>
                <td>{{ teacher.gender === "Male" ? "Laki-laki" : "Perempuan" }}</td>
                <td>
                  <span class="badge" :class="teacher.status === 'active' ? 'bg-success' : 'bg-secondary'">
                    {{ teacher.status === "active" ? "Aktif" : "Tidak aktif" }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editTeacher(teacher)" aria-label="Edit guru">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteTeacher(teacher)" aria-label="Hapus guru">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="7" class="text-center py-4">
                  <span class="spinner-border spinner-border-sm me-2"></span>Memuat data guru...
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
  createManagedTeacher,
  deleteManagedTeacher,
  getManagedTeachers,
  updateManagedTeachersStatus,
  updateManagedTeacher,
} from "@/services/api.js";

const emptyForm = () => ({
  name: "",
  nip: "",
  nuptk: "",
  gender: "",
  ptk_type: "",
  gtk_type: "",
  status: "active",
});

export default {
  name: "SuperAdminTeacher",
  data() {
    return {
      teachers: [],
      searchQuery: "",
      showForm: false,
      loading: false,
      saving: false,
      bulkUpdating: false,
      selectedTeacherIds: [],
      editingTeacher: null,
      errorMessage: "",
      successMessage: "",
      form: emptyForm(),
    };
  },
  computed: {
    filteredTeachers() {
      const query = this.searchQuery.trim().toLowerCase();
      return this.teachers.filter((teacher) =>
        [teacher.name, teacher.nip, teacher.nuptk]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    },
    allFilteredSelected() {
      return this.filteredTeachers.length > 0 &&
        this.filteredTeachers.every((teacher) =>
          this.selectedTeacherIds.includes(teacher.id),
        );
    },
  },
  mounted() {
    this.fetchTeachers();
  },
  methods: {
    async fetchTeachers() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const teachers = await getManagedTeachers();
        if (!Array.isArray(teachers)) throw new Error("Format data guru tidak valid");
        this.teachers = teachers;
        const existingIds = new Set(teachers.map((teacher) => teacher.id));
        this.selectedTeacherIds = this.selectedTeacherIds.filter((id) => existingIds.has(id));
      } catch (error) {
        this.errorMessage = `Gagal memuat data guru: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    openAddForm() {
      this.editingTeacher = null;
      this.form = emptyForm();
      this.errorMessage = "";
      this.successMessage = "";
      this.showForm = true;
    },
    editTeacher(teacher) {
      this.editingTeacher = teacher;
      this.form = {
        name: teacher.name || "",
        nip: teacher.nip || "",
        nuptk: teacher.nuptk || "",
        gender: teacher.gender || "",
        ptk_type: teacher.ptk_type || "",
        gtk_type: teacher.gtk_type || "",
        status: teacher.status || "active",
      };
      this.errorMessage = "";
      this.successMessage = "";
      this.showForm = true;
    },
    async saveTeacher() {
      this.saving = true;
      this.errorMessage = "";
      this.successMessage = "";
      try {
        if (this.editingTeacher) {
          await updateManagedTeacher(this.editingTeacher.id, this.form);
        } else {
          await createManagedTeacher(this.form);
        }
        this.showForm = false;
        this.editingTeacher = null;
        await this.fetchTeachers();
      } catch (error) {
        this.errorMessage = `Gagal menyimpan data guru: ${error.message}`;
      } finally {
        this.saving = false;
      }
    },
    async deleteTeacher(teacher) {
      if (!window.confirm(`Hapus data guru ${teacher.name}?`)) return;
      this.errorMessage = "";
      this.successMessage = "";
      try {
        await deleteManagedTeacher(teacher.id);
        await this.fetchTeachers();
        this.successMessage = "Data guru berhasil dihapus.";
      } catch (error) {
        this.errorMessage = `Gagal menghapus data guru: ${error.message}`;
      }
    },
    toggleSelectAll(event) {
      const visibleIds = this.filteredTeachers.map((teacher) => teacher.id);
      if (event.target.checked) {
        this.selectedTeacherIds = [
          ...new Set([...this.selectedTeacherIds, ...visibleIds]),
        ];
      } else {
        this.selectedTeacherIds = this.selectedTeacherIds.filter(
          (id) => !visibleIds.includes(id),
        );
      }
    },
    async setSelectedStatus(status) {
      const selectedTeachers = this.teachers.filter((teacher) =>
        this.selectedTeacherIds.includes(teacher.id),
      );
      const statusText = status === "active" ? "mengaktifkan" : "menonaktifkan";
      if (!selectedTeachers.length) return;
      if (
        !window.confirm(
          `Yakin ingin ${statusText} ${selectedTeachers.length} guru terpilih?`,
        )
      ) {
        return;
      }

      this.bulkUpdating = true;
      this.successMessage = "";
      this.errorMessage = "";
      try {
        await updateManagedTeachersStatus(
          selectedTeachers.map((teacher) => teacher.id),
          status,
        );
        this.selectedTeacherIds = [];
        await this.fetchTeachers();
        this.successMessage = `${selectedTeachers.length} status guru berhasil diperbarui menjadi ${status === "active" ? "aktif" : "tidak aktif"}.`;
      } catch (error) {
        this.errorMessage = `Gagal memperbarui status guru: ${error.message}`;
      } finally {
        this.bulkUpdating = false;
      }
    },
    cancelForm() {
      this.showForm = false;
      this.editingTeacher = null;
      this.form = emptyForm();
      this.errorMessage = "";
      this.successMessage = "";
    },
  },
};
</script>

<style scoped>
.bulk-toolbar {
  padding: 0.85rem 1rem;
  color: #344054;
  background: #f0f7ff;
  border: 1px solid #d8e9ff;
  border-radius: 12px;
}

.selection-column {
  width: 44px;
}

.form-check-input {
  width: 1.05rem;
  height: 1.05rem;
  margin: 0;
  vertical-align: middle;
  cursor: pointer;
}

.form-check-input:disabled {
  cursor: not-allowed;
}
</style>
