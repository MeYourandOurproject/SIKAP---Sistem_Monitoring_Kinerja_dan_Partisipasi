<template>
  <div class="row d-md-none mb-3"><SuperAdminMobileNavbar /></div>
  <div class="superadmin-dashboard mt-3">
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6 col-xl-4">
        <div class="card stat-card shadow-sm">
          <div class="card-body bg-img">
            <div class="row text-start px-2">
              <div class="col-8">
                <p class="text-1 mb-2 text-success fw-bold">
                  Selamat datang kembali, <br />
                  <span class="text-white text-2">{{ adminName }} 👋</span>
                  <br /><span class="text-muted text-3"
                    >Super Administrator SIKAP<br />
                    {{ currentDate }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-blue text-white">
                  <i class="bi bi-person-fill fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Total Guru
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">{{ totalTeachers }}</div>
              <div class="status-sub text-success">
                Guru Aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-green text-white">
                  <i class="bi bi-calendar-check-fill fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Total Jadwal
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">{{ totalSchedules }}</div>
              <div class="status-sub">Jadwal Aktif</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card stat-card shadow-sm">
          <div class="card-body gap-0 px-3">
            <div
              class="row d-flex align-items-center justify-content-center mb-3"
            >
              <div class="col-4">
                <div class="stat-icon bg-yellow text-white">
                  <i class="bi bi-people-fill fs-5"></i>
                </div>
              </div>
              <div class="col-8">
                <p class="col stat-label mb-2 fw-bold text-start">
                  Total Pengguna
                </p>
              </div>
            </div>
            <div class="stat-value text-start">
              <div class="status-main">{{ totalUsers }}</div>
              <div class="status-sub">Semua Role</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row g-3 mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">Aksi Cepat</h5>
          </div>
          <div class="card-body">
            <div class="row g-2">
              <div class="col-6 col-md-3">
                <router-link
                  to="/super-admin/guru"
                  class="btn btn-outline-primary w-100"
                >
                  <i class="bi bi-person-plus-fill me-2"></i>
                  Kelola Guru
                </router-link>
              </div>
              <div class="col-6 col-md-3">
                <router-link
                  to="/super-admin/jadwal"
                  class="btn btn-outline-info w-100"
                >
                  <i class="bi bi-calendar-plus-fill me-2"></i>
                  Kelola Jadwal
                </router-link>
              </div>
              <div class="col-6 col-md-3">
                <router-link
                  to="/super-admin/pengguna"
                  class="btn btn-outline-warning w-100"
                >
                  <i class="bi bi-person-check-fill me-2"></i>
                  Kelola Pengguna
                </router-link>
              </div>
              <div class="col-6 col-md-3">
                <router-link
                  to="/super-admin/pengaturan"
                  class="btn btn-outline-secondary w-100"
                >
                  <i class="bi bi-gear-fill me-2"></i>
                  Pengaturan
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="row g-3">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">Informasi Sistem</h5>
          </div>
          <div class="card-body">
            <table class="table table-sm table-hover mb-0">
              <thead>
                <tr>
                  <th>Fitur</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><i class="bi bi-database me-2"></i>Database</td>
                  <td><span class="badge bg-success">Aktif</span></td>
                  <td>Sistem database berjalan dengan baik</td>
                </tr>
                <tr>
                  <td><i class="bi bi-server me-2"></i>API Server</td>
                  <td><span class="badge bg-success">Aktif</span></td>
                  <td>Server API siap melayani request</td>
                </tr>
                <tr>
                  <td><i class="bi bi-cloud me-2"></i>Penyimpanan</td>
                  <td><span class="badge bg-success">Aktif</span></td>
                  <td>Folder uploads berfungsi dengan normal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuperAdminMobileNavbar from "@/components/superadmin/SuperAdminMobileNavbar.vue";
// import { api } from "@/utils/api";

export default {
  name: "SuperAdminDashboard",
  components: {
    SuperAdminMobileNavbar,
  },
  data() {
    return {
      adminName: "Super Admin",
      totalTeachers: 0,
      totalSchedules: 0,
      totalUsers: 0,
      currentDate: "",
    };
  },
  mounted() {
    this.loadUserName();
    this.loadStatistics();
    this.setCurrentDate();
  },
  methods: {
    loadUserName() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.adminName = user.fullname || "Super Admin";
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    },
    async loadStatistics() {
      try {
        const token = localStorage.getItem("token");
        
        // Get teachers count
        const teachersRes = await api.get("/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.totalTeachers = teachersRes.data?.length || 0;

        // Get schedules count
        const schedulesRes = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.totalSchedules = schedulesRes.data?.length || 0;

        // Get users count
        const usersRes = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.totalUsers = usersRes.data?.length || 0;
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    },
    setCurrentDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      this.currentDate = new Date().toLocaleDateString("id-ID", options);
    },
  },
};
</script>

<style scoped>
.superadmin-dashboard {
  color: #e5e7eb;
}

/* Card Styles */
.stat-card {
  background-color: #111827;
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.35) !important;
}

.stat-card .card-body {
  padding: 1.5rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.bg-blue {
  background-color: #2563eb;
}

.stat-icon.bg-green {
  background-color: #16a34a;
}

.stat-icon.bg-yellow {
  background-color: #d97706;
}

.stat-label {
  font-size: 0.9rem;
  color: #cbd5e1;
}

.stat-value {
  margin-top: 1rem;
}

.status-main {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f8fafc;
}

.status-sub {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.text-1 {
  font-size: 1rem;
}

.text-2 {
  font-size: 1.5rem;
}

.text-3 {
  font-size: 0.9rem;
  color: #94a3b8;
}

.bg-img {
  background: linear-gradient(135deg, #1e293b 0%, #111827 100%);
}

/* Button Styles */
.btn-outline-primary,
.btn-outline-info,
.btn-outline-warning,
.btn-outline-secondary {
  border-color: rgba(209, 213, 219, 0.3);
  color: #f8fafc;
  background-color: transparent;
  font-weight: 500;
}

.btn-outline-primary:hover,
.btn-outline-info:hover,
.btn-outline-warning:hover,
.btn-outline-secondary:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.08);
}

/* Table Styles */
.table {
  margin-bottom: 0;
  color: #e5e7eb;
}

.table thead th {
  background-color: #0f172a;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 600;
  color: #cbd5e1;
}

.table tbody tr {
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}

.table tbody tr:hover {
  background-color: rgba(148, 163, 184, 0.08);
}

.table td,
.table th {
  border-color: rgba(148, 163, 184, 0.08);
}

.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}

/* Card Header */
.card-header {
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  padding: 1rem 1.5rem;
  background-color: #0f172a !important;
}

.card-header h5 {
  color: #f8fafc;
  font-weight: 600;
}
</style>
