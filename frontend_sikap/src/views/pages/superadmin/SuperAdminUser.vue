<template>
  <section class="superadmin-user mt-3 text-start">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h2 class="mb-1">Manajemen Pengguna</h2>
        <p class="text-muted mb-0">Atur akun, peran, dan akses ke dalam sistem.</p>
      </div>
      <button v-if="!showForm" class="btn btn-success" @click="openAddForm">
        <i class="bi bi-person-plus me-2"></i>Tambah Pengguna
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="showForm" class="card shadow-sm mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingUser ? "Edit Pengguna" : "Tambah Pengguna" }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveUser">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nama Lengkap *</label>
              <input v-model.trim="form.name" class="form-control" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Username *</label>
              <input v-model.trim="form.username" class="form-control" required />
            </div>
            <div v-if="!editingUser" class="col-md-6 mb-3">
              <label class="form-label">Password * (minimal 8 karakter)</label>
              <input v-model="form.password" class="form-control" type="password" minlength="8" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Role *</label>
              <select v-model="form.role" class="form-select" required>
                <option value="">Pilih role</option>
                <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
              </select>
            </div>
            <div v-if="form.role === 'teacher'" class="col-md-6 mb-3">
              <label class="form-label">Hubungkan ke Data Guru *</label>
              <select
                v-model="form.teacher_id"
                class="form-select"
                required
                :disabled="loading || availableTeachers.length === 0"
              >
                <option value="" disabled>
                  {{ loading ? "Memuat data guru..." : "Pilih profil guru" }}
                </option>
                <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }}{{ teacher.nip ? ` (${teacher.nip})` : "" }}
                </option>
              </select>
              <small class="form-text text-muted">
                Akun guru harus ditautkan ke profil pada Manajemen Data Guru.
                <template v-if="!loading && availableTeachers.length === 0">
                  Tidak ada profil guru aktif yang belum memiliki akun.
                  <router-link to="/super-admin/teacher">Tambah atau periksa data guru</router-link>.
                </template>
              </small>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Kontak</label>
              <input v-model.trim="form.contact" class="form-control" />
            </div>
            <div v-if="editingUser" class="col-md-6 mb-3">
              <label class="form-label">Status Akun</label>
              <select v-model="form.is_active" class="form-select" :disabled="isCurrentUser(editingUser)">
                <option :value="true">Aktif</option>
                <option :value="false">Tidak aktif</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary me-2" type="submit" :disabled="saving">
            {{ saving ? "Menyimpan..." : editingUser ? "Simpan Perubahan" : "Simpan" }}
          </button>
          <button class="btn btn-secondary" type="button" @click="cancelForm">Batal</button>
        </form>
      </div>
    </div>

    <template v-else>
      <div class="row mb-3 g-2">
        <div class="col-md-5">
          <input v-model="searchQuery" class="form-control" type="search" placeholder="Cari nama atau username..." />
        </div>
        <div class="col-md-3">
          <select v-model="filterRole" class="form-select">
            <option value="">Semua role</option>
            <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filterStatus" class="form-select">
            <option value="">Semua status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak aktif</option>
          </select>
        </div>
      </div>
      <div class="card shadow-sm">
        <div class="card-body table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr><th>Nama</th><th>Username</th><th>Role</th><th>Guru</th><th>Status</th><th>Dibuat</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              <tr v-if="!loading && filteredUsers.length === 0">
                <td colspan="7" class="text-center text-muted py-4">Tidak ada data pengguna</td>
              </tr>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.username }}</td>
                <td>{{ roleLabel(user.role) }}</td>
                <td>{{ teacherName(user.teacher_id) }}</td>
                <td>
                  <span class="badge" :class="user.is_active ? 'bg-success' : 'bg-secondary'">
                    {{ user.is_active ? "Aktif" : "Tidak aktif" }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="text-nowrap">
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editUser(user)" aria-label="Edit pengguna">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    :class="user.is_active ? 'btn-outline-danger' : 'btn-outline-success'"
                    :disabled="isCurrentUser(user)"
                    @click="toggleUserStatus(user)"
                  >
                    {{ user.is_active ? "Nonaktifkan" : "Aktifkan" }}
                  </button>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="7" class="text-center py-4">
                  <span class="spinner-border spinner-border-sm me-2"></span>Memuat pengguna...
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
  createManagedUser,
  getManagedTeachers,
  getManagedUsers,
  updateManagedUser,
} from "@/services/api.js";

const roles = [
  { value: "student", label: "Siswa / Ketua Murid" },
  { value: "teacher", label: "Guru" },
  { value: "responsible", label: "Penanggung Jawab" },
  { value: "headmaster", label: "Kepala Sekolah" },
  { value: "admin", label: "Administrator" },
];
const emptyForm = () => ({
  name: "",
  username: "",
  password: "",
  role: "",
  teacher_id: "",
  contact: "",
  is_active: true,
});

export default {
  name: "SuperAdminUser",
  data() {
    return {
      users: [],
      teachers: [],
      roles,
      searchQuery: "",
      filterRole: "",
      filterStatus: "",
      showForm: false,
      loading: false,
      saving: false,
      editingUser: null,
      errorMessage: "",
      currentUserId: null,
      form: emptyForm(),
    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.trim().toLowerCase();
      return this.users.filter((user) => {
        const matchesSearch = [user.name, user.username]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
        const matchesRole = !this.filterRole || user.role === this.filterRole;
        const matchesStatus =
          !this.filterStatus ||
          (user.is_active ? "active" : "inactive") === this.filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
      });
    },
    availableTeachers() {
      return this.teachers.filter((teacher) => {
        const assignedUser = this.users.find(
          (user) => Number(user.teacher_id) === Number(teacher.id),
        );
        return (
          (!assignedUser || assignedUser.id === this.editingUser?.id) &&
          (teacher.status === "active" ||
            Number(teacher.id) === Number(this.form.teacher_id))
        );
      });
    },
  },
  mounted() {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      this.currentUserId = Number(currentUser.id) || null;
    } catch (error) {
      this.errorMessage = `Data sesi tidak dapat dibaca: ${error.message}`;
    }
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const [users, teachers] = await Promise.all([
          getManagedUsers(),
          getManagedTeachers(),
        ]);
        if (!Array.isArray(users) || !Array.isArray(teachers)) {
          throw new Error("Format data pengguna atau guru tidak valid");
        }
        this.users = users;
        this.teachers = teachers;
      } catch (error) {
        this.errorMessage = `Gagal memuat data pengguna: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    openAddForm() {
      this.editingUser = null;
      this.form = emptyForm();
      this.errorMessage = "";
      this.showForm = true;
    },
    editUser(user) {
      this.editingUser = user;
      this.form = {
        name: user.name || "",
        username: user.username || "",
        password: "",
        role: user.role || "",
        teacher_id: user.teacher_id || "",
        contact: user.contact || "",
        is_active: Boolean(user.is_active),
      };
      this.errorMessage = "";
      this.showForm = true;
    },
    async saveUser() {
      if (this.form.role === "teacher" && !this.form.teacher_id) {
        this.errorMessage = "Pilih data guru untuk akun dengan role Guru.";
        return;
      }
      const payload = {
        name: this.form.name,
        username: this.form.username,
        role: this.form.role,
        teacher_id: this.form.role === "teacher" ? Number(this.form.teacher_id) : null,
        contact: this.form.contact || null,
      };
      if (this.editingUser) {
        payload.is_active = this.form.is_active;
      } else {
        if (this.form.password.length < 8) {
          this.errorMessage = "Password harus memiliki minimal 8 karakter.";
          return;
        }
        payload.password = this.form.password;
      }

      this.saving = true;
      this.errorMessage = "";
      try {
        if (this.editingUser) {
          await updateManagedUser(this.editingUser.id, payload);
        } else {
          await createManagedUser(payload);
        }
        this.showForm = false;
        this.editingUser = null;
        await this.fetchData();
      } catch (error) {
        this.errorMessage = `Gagal menyimpan pengguna: ${error.message}`;
      } finally {
        this.saving = false;
      }
    },
    async toggleUserStatus(user) {
      const status = user.is_active ? "menonaktifkan" : "mengaktifkan";
      if (!window.confirm(`Yakin ingin ${status} akun ${user.username}?`)) return;
      this.errorMessage = "";
      try {
        await updateManagedUser(user.id, { is_active: !user.is_active });
        await this.fetchData();
      } catch (error) {
        this.errorMessage = `Gagal mengubah status pengguna: ${error.message}`;
      }
    },
    isCurrentUser(user) {
      return this.currentUserId === Number(user.id);
    },
    roleLabel(role) {
      return this.roles.find((item) => item.value === role)?.label || role;
    },
    teacherName(teacherId) {
      return this.teachers.find((teacher) => Number(teacher.id) === Number(teacherId))?.name || "-";
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString("id-ID") : "-";
    },
    cancelForm() {
      this.showForm = false;
      this.editingUser = null;
      this.form = emptyForm();
      this.errorMessage = "";
    },
  },
};
</script>
