<template>
  <div class="row d-md-none mb-3"><SuperAdminMobileNavbar /></div>
  <div class="superadmin-teacher mt-3">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="mb-0">Manajemen Data Guru</h2>
          <button
            class="btn btn-success"
            @click="openAddModal"
            v-if="!showForm"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Guru
          </button>
        </div>
      </div>
    </div>

    <!-- Form Add/Edit -->
    <div class="row mb-4" v-if="showForm">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              {{ editingTeacher ? "Edit Data Guru" : "Tambah Data Guru Baru" }}
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveTeacher">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.fullname"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">NIP/NIK *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.nip"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">No. Telepon</label>
                  <input
                    type="tel"
                    class="form-control"
                    v-model="formData.phone"
                  />
                </div>
                <div class="col-md-12 mb-3">
                  <label class="form-label">Alamat</label>
                  <textarea
                    class="form-control"
                    v-model="formData.address"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                  {{ editingTeacher ? "Update" : "Simpan" }}
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="cancelForm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="row mb-3" v-if="!showForm">
      <div class="col-md-4">
        <div class="input-group">
          <span class="input-group-text"
            ><i class="bi bi-search"></i
          ></span>
          <input
            type="text"
            class="form-control"
            placeholder="Cari guru..."
            v-model="searchQuery"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="row" v-if="!showForm">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Lengkap</th>
                    <th>Email</th>
                    <th>NIP/NIK</th>
                    <th>No. Telepon</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredTeachers.length === 0">
                    <td colspan="7" class="text-center text-muted py-4">
                      Tidak ada data guru
                    </td>
                  </tr>
                  <tr v-for="(teacher, index) in filteredTeachers" :key="teacher.id">
                    <td>{{ index + 1 }}</td>
                    <td><strong>{{ teacher.fullname }}</strong></td>
                    <td>{{ teacher.email }}</td>
                    <td>{{ teacher.nip || "-" }}</td>
                    <td>{{ teacher.phone || "-" }}</td>
                    <td>{{ teacher.address ? teacher.address.substring(0, 20) + "..." : "-" }}</td>
                    <td>
                      <div class="btn-group btn-group-sm" role="group">
                        <button
                          class="btn btn-outline-info"
                          @click="editTeacher(teacher)"
                          title="Edit"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger"
                          @click="deleteTeacher(teacher.id)"
                          title="Hapus"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="text-center py-5" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import SuperAdminMobileNavbar from "@/components/superadmin/SuperAdminMobileNavbar.vue";
// import { api } from "@/utils/api";

export default {
  name: "SuperAdminTeacher",
  components: {
    SuperAdminMobileNavbar,
  },
  data() {
    return {
      teachers: [],
      searchQuery: "",
      showForm: false,
      loading: false,
      editingTeacher: null,
      formData: {
        fullname: "",
        email: "",
        nip: "",
        phone: "",
        address: "",
      },
    };
  },
  computed: {
    filteredTeachers() {
      return this.teachers.filter(
        (teacher) =>
          teacher.fullname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (teacher.nip && teacher.nip.includes(this.searchQuery))
      );
    },
  },
  mounted() {
    this.fetchTeachers();
  },
  methods: {
    async fetchTeachers() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.teachers = response.data || [];
      } catch (error) {
        console.error("Error fetching teachers:", error);
        alert("Gagal memuat data guru");
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.showForm = true;
      this.editingTeacher = null;
      this.resetForm();
    },
    editTeacher(teacher) {
      this.editingTeacher = teacher;
      this.formData = {
        fullname: teacher.fullname || "",
        email: teacher.email || "",
        nip: teacher.nip || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
      };
      this.showForm = true;
    },
    async saveTeacher() {
      try {
        const token = localStorage.getItem("token");
        
        if (this.editingTeacher) {
          // Update existing teacher
          await api.put(`/teachers/${this.editingTeacher.id}`, this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Data guru berhasil diperbarui");
        } else {
          // Create new teacher
          await api.post("/teachers", this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Data guru berhasil ditambahkan");
        }
        
        this.fetchTeachers();
        this.cancelForm();
      } catch (error) {
        console.error("Error saving teacher:", error);
        alert("Gagal menyimpan data guru: " + (error.response?.data?.message || error.message));
      }
    },
    async deleteTeacher(id) {
      if (confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
        try {
          const token = localStorage.getItem("token");
          await api.delete(`/teachers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Data guru berhasil dihapus");
          this.fetchTeachers();
        } catch (error) {
          console.error("Error deleting teacher:", error);
          alert("Gagal menghapus data guru");
        }
      }
    },
    cancelForm() {
      this.showForm = false;
      this.editingTeacher = null;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        fullname: "",
        email: "",
        nip: "",
        phone: "",
        address: "",
      };
    },
  },
};
</script>

<style scoped>
.superadmin-teacher {
  color: #333;
}

.table-responsive {
  margin-bottom: 0;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-group-text {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
}
</style>
