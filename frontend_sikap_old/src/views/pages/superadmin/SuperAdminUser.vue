<template>
  <div class="row d-md-none mb-3"><SuperAdminMobileNavbar /></div>
  <div class="superadmin-user mt-3">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="mb-0">Manajemen Pengguna</h2>
          <button
            class="btn btn-success"
            @click="openAddModal"
            v-if="!showForm"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Pengguna
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
              {{ editingUser ? "Edit Data Pengguna" : "Tambah Pengguna Baru" }}
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveUser">
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
                    :readonly="editingUser"
                  />
                </div>
                <div class="col-md-6 mb-3" v-if="!editingUser">
                  <label class="form-label">Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="formData.password"
                    required
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <div class="col-md-6 mb-3" v-if="!editingUser">
                  <label class="form-label">Konfirmasi Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="formData.passwordConfirm"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Role *</label>
                  <select class="form-select" v-model="formData.roleId" required>
                    <option value="">-- Pilih Role --</option>
                    <option
                      v-for="role in roles"
                      :key="role.id"
                      :value="role.id"
                    >
                      {{ formatRoleName(role.name) }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" v-model="formData.status">
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                  {{ editingUser ? "Update" : "Simpan" }}
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
            placeholder="Cari pengguna..."
            v-model="searchQuery"
          />
        </div>
      </div>
      <div class="col-md-4">
        <select class="form-select" v-model="filterRole">
          <option value="">Semua Role</option>
          <option
            v-for="role in roles"
            :key="role.id"
            :value="role.id"
          >
            {{ formatRoleName(role.name) }}
          </option>
        </select>
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
                    <th>Role</th>
                    <th>Status</th>
                    <th>Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="7" class="text-center text-muted py-4">
                      Tidak ada data pengguna
                    </td>
                  </tr>
                  <tr v-for="(user, index) in filteredUsers" :key="user.id">
                    <td>{{ index + 1 }}</td>
                    <td><strong>{{ user.fullname }}</strong></td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge" :class="getRoleBadgeClass(user.roleId)">
                        {{ formatRoleName(getRoleName(user.roleId)) }}
                      </span>
                    </td>
                    <td>
                      <span
                        :class="{
                          'badge bg-success': user.status === 'active',
                          'badge bg-danger': user.status === 'inactive',
                        }"
                      >
                        {{ user.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                      </span>
                    </td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                      <div class="btn-group btn-group-sm" role="group">
                        <button
                          class="btn btn-outline-info"
                          @click="editUser(user)"
                          title="Edit"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger"
                          @click="deleteUser(user.id)"
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
  name: "SuperAdminUser",
  components: {
    SuperAdminMobileNavbar,
  },
  data() {
    return {
      users: [],
      roles: [],
      searchQuery: "",
      filterRole: "",
      showForm: false,
      loading: false,
      editingUser: null,
      formData: {
        fullname: "",
        email: "",
        password: "",
        passwordConfirm: "",
        roleId: "",
        status: "active",
      },
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const matchesSearch =
          user.fullname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesRole = !this.filterRole || user.roleId === parseInt(this.filterRole);
        
        return matchesSearch && matchesRole;
      });
    },
  },
  mounted() {
    this.fetchRoles();
    this.fetchUsers();
  },
  methods: {
    async fetchRoles() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users/roles/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.roles = response.data || [];
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    async fetchUsers() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.users = response.data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Gagal memuat data pengguna");
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.showForm = true;
      this.editingUser = null;
      this.resetForm();
    },
    editUser(user) {
      this.editingUser = user;
      this.formData = {
        fullname: user.fullname || "",
        email: user.email || "",
        password: "",
        passwordConfirm: "",
        roleId: user.roleId || "",
        status: user.status || "active",
      };
      this.showForm = true;
    },
    async saveUser() {
      // Validation
      if (!this.editingUser) {
        if (this.formData.password !== this.formData.passwordConfirm) {
          alert("Password dan konfirmasi password tidak sesuai");
          return;
        }
        if (this.formData.password.length < 8) {
          alert("Password minimal 8 karakter");
          return;
        }
      }

      try {
        const token = localStorage.getItem("token");
        const data = {
          fullname: this.formData.fullname,
          email: this.formData.email,
          roleId: parseInt(this.formData.roleId),
          status: this.formData.status,
        };

        if (!this.editingUser) {
          data.password = this.formData.password;
        }
        
        if (this.editingUser) {
          // Update existing user
          await api.put(`/users/${this.editingUser.id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Data pengguna berhasil diperbarui");
        } else {
          // Create new user
          await api.post("/users", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Pengguna berhasil ditambahkan");
        }
        
        this.fetchUsers();
        this.cancelForm();
      } catch (error) {
        console.error("Error saving user:", error);
        alert("Gagal menyimpan data pengguna: " + (error.response?.data?.message || error.message));
      }
    },
    async deleteUser(id) {
      if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        try {
          const token = localStorage.getItem("token");
          await api.delete(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Pengguna berhasil dihapus");
          this.fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Gagal menghapus pengguna");
        }
      }
    },
    cancelForm() {
      this.showForm = false;
      this.editingUser = null;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        fullname: "",
        email: "",
        password: "",
        passwordConfirm: "",
        roleId: "",
        status: "active",
      };
    },
    getRoleName(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      return role ? role.name : "Unknown";
    },
    getRoleBadgeClass(roleId) {
      const roleName = this.getRoleName(roleId);
      const classMap = {
        super_admin: "bg-danger",
        kepala_sekolah: "bg-primary",
        wakasek: "bg-info",
        guru: "bg-success",
        ketua_murid: "bg-warning",
        penanggung_jawab: "bg-secondary",
      };
      return classMap[roleName] || "bg-secondary";
    },
    formatRoleName(roleName) {
      const nameMap = {
        super_admin: "Super Admin",
        kepala_sekolah: "Kepala Sekolah",
        wakasek: "Wakasek",
        guru: "Guru",
        ketua_murid: "Ketua Murid",
        penanggung_jawab: "Penanggung Jawab",
      };
      return nameMap[roleName] || roleName;
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID");
    },
  },
};
</script>

<style scoped>
.superadmin-user {
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

.badge {
  padding: 0.35rem 0.65rem;
  font-size: 0.85rem;
}
</style>
