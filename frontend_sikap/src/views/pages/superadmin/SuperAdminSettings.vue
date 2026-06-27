<template>
  <div class="row d-md-none mb-3"><SuperAdminMobileNavbar /></div>
  <div class="superadmin-settings mt-3">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="mb-0">Pengaturan Sistem</h2>
      </div>
    </div>

    <!-- General Settings -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="bi bi-sliders me-2"></i>Pengaturan Umum
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Institusi</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="settings.schoolName"
                  placeholder="Masukkan nama sekolah"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Alamat Institusi</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="settings.schoolAddress"
                  placeholder="Masukkan alamat sekolah"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Telepon Institusi</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="settings.schoolPhone"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email Institusi</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="settings.schoolEmail"
                  placeholder="Masukkan email sekolah"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Email Configuration -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="bi bi-envelope me-2"></i>Konfigurasi Email
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">SMTP Server</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="settings.smtpServer"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">SMTP Port</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="settings.smtpPort"
                  placeholder="587"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email Pengirim</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="settings.senderEmail"
                  placeholder="noreply@sekolah.com"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Password Email</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="settings.senderPassword"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="bi bi-database me-2"></i>Status Sistem
            </h5>
          </div>
          <div class="card-body">
            <table class="table table-sm mb-0">
              <tbody>
                <tr>
                  <td><strong>Versi Aplikasi</strong></td>
                  <td>v1.0.0</td>
                </tr>
                <tr>
                  <td><strong>Database</strong></td>
                  <td><span class="badge bg-success">Connected</span></td>
                </tr>
                <tr>
                  <td><strong>API Server</strong></td>
                  <td><span class="badge bg-success">Active</span></td>
                </tr>
                <tr>
                  <td><strong>Last Backup</strong></td>
                  <td>2026-05-21 10:30:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row">
      <div class="col-12">
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="saveSettings">
            <i class="bi bi-check-circle me-2"></i>Simpan Pengaturan
          </button>
          <button class="btn btn-danger" @click="resetSettings">
            <i class="bi bi-arrow-counterclockwise me-2"></i>Reset
          </button>
          <button class="btn btn-warning" @click="backupDatabase">
            <i class="bi bi-cloud-download me-2"></i>Backup Database
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuperAdminMobileNavbar from "@/components/superadmin/SuperAdminMobileNavbar.vue";

export default {
  name: "SuperAdminSettings",
  components: {
    SuperAdminMobileNavbar,
  },
  data() {
    return {
      settings: {
        schoolName: "SMK Negeri 4 Bandung",
        schoolAddress: "Jl. Soekarno Hatta No. 556, Bandung",
        schoolPhone: "(022) 7278880",
        schoolEmail: "smkn4bdg@gmail.com",
        smtpServer: "smtp.gmail.com",
        smtpPort: 587,
        senderEmail: "noreply@smkn4bdg.sch.id",
        senderPassword: "",
      },
    };
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    loadSettings() {
      try {
        const savedSettings = localStorage.getItem("systemSettings");
        if (savedSettings) {
          this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    },
    saveSettings() {
      try {
        localStorage.setItem("systemSettings", JSON.stringify(this.settings));
        alert("Pengaturan berhasil disimpan");
      } catch (error) {
        console.error("Error saving settings:", error);
        alert("Gagal menyimpan pengaturan");
      }
    },
    resetSettings() {
      if (confirm("Apakah Anda yakin ingin mereset pengaturan ke default?")) {
        this.settings = {
          schoolName: "SMK Negeri 4 Bandung",
          schoolAddress: "Jl. Soekarno Hatta No. 556, Bandung",
          schoolPhone: "(022) 7278880",
          schoolEmail: "smkn4bdg@gmail.com",
          smtpServer: "smtp.gmail.com",
          smtpPort: 587,
          senderEmail: "noreply@smkn4bdg.sch.id",
          senderPassword: "",
        };
        this.saveSettings();
      }
    },
    backupDatabase() {
      alert("Fitur backup database akan segera tersedia. Silakan hubungi administrator sistem.");
    },
  },
};
</script>

<style scoped>
.superadmin-settings {
  color: #333;
}

.card-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
}

.card-header h5 {
  color: #1f2937;
  font-weight: 600;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.badge {
  padding: 0.35rem 0.65rem;
  font-size: 0.85rem;
}

.table {
  margin-bottom: 0;
}

.table th,
.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.d-flex {
  gap: 1rem;
}

.btn {
  font-weight: 500;
}
</style>
