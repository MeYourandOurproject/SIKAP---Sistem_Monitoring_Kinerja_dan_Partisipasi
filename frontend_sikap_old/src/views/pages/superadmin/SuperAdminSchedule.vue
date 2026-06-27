<template>
  <div class="row d-md-none mb-3"><SuperAdminMobileNavbar /></div>
  <div class="superadmin-schedule mt-3">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="mb-0">Manajemen Jadwal Pelajaran</h2>
          <button
            class="btn btn-success"
            @click="openAddModal"
            v-if="!showForm"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Jadwal
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
              {{ editingSchedule ? "Edit Jadwal Pelajaran" : "Tambah Jadwal Pelajaran Baru" }}
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveSchedule">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nama Kelas *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.className"
                    placeholder="Contoh: XI A"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Mata Pelajaran *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.subject"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Guru Pengajar *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.teacher"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Hari *</label>
                  <select class="form-select" v-model="formData.day" required>
                    <option value="">-- Pilih Hari --</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Waktu Mulai *</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="formData.startTime"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Waktu Selesai *</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="formData.endTime"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Ruang Kelas</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.room"
                    placeholder="Contoh: Ruang 101"
                  />
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
                  {{ editingSchedule ? "Update" : "Simpan" }}
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
            placeholder="Cari jadwal..."
            v-model="searchQuery"
          />
        </div>
      </div>
      <div class="col-md-4">
        <select class="form-select" v-model="filterDay">
          <option value="">Semua Hari</option>
          <option value="Senin">Senin</option>
          <option value="Selasa">Selasa</option>
          <option value="Rabu">Rabu</option>
          <option value="Kamis">Kamis</option>
          <option value="Jumat">Jumat</option>
          <option value="Sabtu">Sabtu</option>
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
                    <th>Kelas</th>
                    <th>Mata Pelajaran</th>
                    <th>Guru Pengajar</th>
                    <th>Hari</th>
                    <th>Waktu</th>
                    <th>Ruang</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredSchedules.length === 0">
                    <td colspan="9" class="text-center text-muted py-4">
                      Tidak ada data jadwal
                    </td>
                  </tr>
                  <tr v-for="(schedule, index) in filteredSchedules" :key="schedule.id">
                    <td>{{ index + 1 }}</td>
                    <td><strong>{{ schedule.className }}</strong></td>
                    <td>{{ schedule.subject }}</td>
                    <td>{{ schedule.teacher }}</td>
                    <td>
                      <span class="badge bg-info">{{ schedule.day }}</span>
                    </td>
                    <td>{{ schedule.startTime }} - {{ schedule.endTime }}</td>
                    <td>{{ schedule.room || "-" }}</td>
                    <td>
                      <span
                        :class="{
                          'badge bg-success': schedule.status === 'active',
                          'badge bg-danger': schedule.status === 'inactive',
                        }"
                      >
                        {{ schedule.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm" role="group">
                        <button
                          class="btn btn-outline-info"
                          @click="editSchedule(schedule)"
                          title="Edit"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger"
                          @click="deleteSchedule(schedule.id)"
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
  name: "SuperAdminSchedule",
  components: {
    SuperAdminMobileNavbar,
  },
  data() {
    return {
      schedules: [],
      searchQuery: "",
      filterDay: "",
      showForm: false,
      loading: false,
      editingSchedule: null,
      formData: {
        className: "",
        subject: "",
        teacher: "",
        day: "",
        startTime: "",
        endTime: "",
        room: "",
        status: "active",
      },
    };
  },
  computed: {
    filteredSchedules() {
      return this.schedules.filter((schedule) => {
        const matchesSearch =
          schedule.className.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          schedule.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          schedule.teacher.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesDay = !this.filterDay || schedule.day === this.filterDay;
        
        return matchesSearch && matchesDay;
      });
    },
  },
  mounted() {
    this.fetchSchedules();
  },
  methods: {
    async fetchSchedules() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.schedules = response.data || [];
      } catch (error) {
        console.error("Error fetching schedules:", error);
        alert("Gagal memuat data jadwal");
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.showForm = true;
      this.editingSchedule = null;
      this.resetForm();
    },
    editSchedule(schedule) {
      this.editingSchedule = schedule;
      this.formData = {
        className: schedule.className || "",
        subject: schedule.subject || "",
        teacher: schedule.teacher || "",
        day: schedule.day || "",
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        room: schedule.room || "",
        status: schedule.status || "active",
      };
      this.showForm = true;
    },
    async saveSchedule() {
      try {
        const token = localStorage.getItem("token");
        
        if (this.editingSchedule) {
          // Update existing schedule
          await api.put(`/schedules/${this.editingSchedule.id}`, this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Jadwal berhasil diperbarui");
        } else {
          // Create new schedule
          await api.post("/schedules", this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Jadwal berhasil ditambahkan");
        }
        
        this.fetchSchedules();
        this.cancelForm();
      } catch (error) {
        console.error("Error saving schedule:", error);
        alert("Gagal menyimpan jadwal: " + (error.response?.data?.message || error.message));
      }
    },
    async deleteSchedule(id) {
      if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
        try {
          const token = localStorage.getItem("token");
          await api.delete(`/schedules/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Jadwal berhasil dihapus");
          this.fetchSchedules();
        } catch (error) {
          console.error("Error deleting schedule:", error);
          alert("Gagal menghapus jadwal");
        }
      }
    },
    cancelForm() {
      this.showForm = false;
      this.editingSchedule = null;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        className: "",
        subject: "",
        teacher: "",
        day: "",
        startTime: "",
        endTime: "",
        room: "",
        status: "active",
      };
    },
  },
};
</script>

<style scoped>
.superadmin-schedule {
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
