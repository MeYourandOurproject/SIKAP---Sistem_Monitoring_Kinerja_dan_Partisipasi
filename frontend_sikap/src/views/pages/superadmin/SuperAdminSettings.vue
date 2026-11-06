<template>
  <div class="superadmin-settings mt-3">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div>
          <h2 class="mb-1">Pengaturan Sistem</h2>
          <p class="text-muted mb-0">Atur informasi institusi dan preferensi sistem.</p>
        </div>
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

    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="bi bi-calendar-range me-2"></i>Periode Akademik Aktif
            </h5>
          </div>
          <div class="card-body">
            <p class="text-muted">
              Periode ini digunakan bersama untuk memfilter penugasan kegiatan
              dan data absensi guru.
            </p>
            <div class="row align-items-end">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="active-academic-year">Tahun ajaran</label>
                <input
                  id="active-academic-year"
                  v-model.trim="academicPeriod.academic_year"
                  type="text"
                  class="form-control"
                  placeholder="2026/2027"
                  pattern="\d{4}/\d{4}"
                  :disabled="loadingAcademicPeriod || savingAcademicPeriod"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label" for="active-semester">Semester</label>
                <select
                  id="active-semester"
                  v-model="academicPeriod.semester"
                  class="form-select"
                  :disabled="loadingAcademicPeriod || savingAcademicPeriod"
                >
                  <option value="odd">Ganjil</option>
                  <option value="even">Genap</option>
                </select>
              </div>
              <div class="col-md-2 mb-3">
                <button
                  type="button"
                  class="btn btn-success w-100"
                  :disabled="loadingAcademicPeriod || savingAcademicPeriod"
                  @click="saveAcademicPeriod"
                >
                  <span v-if="savingAcademicPeriod" class="spinner-border spinner-border-sm me-1"></span>
                  {{ savingAcademicPeriod ? "Menyimpan..." : "Simpan" }}
                </button>
              </div>
            </div>
            <div v-if="academicPeriodError" class="alert alert-danger mb-0" role="alert">
              {{ academicPeriodError }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="bi bi-clock-history me-2"></i>Jam Aplikasi
            </h5>
          </div>
          <div class="card-body">
            <p class="text-muted">
              Atur waktu untuk demonstrasi. Mode simulasi berlaku untuk semua
              pengguna dan waktu jadwal/absensi mengikuti tanggal serta jam ini.
              Waktu simulasi akan terus berjalan normal.
            </p>
            <div class="row align-items-end">
              <div class="col-md-4 mb-3">
                <label class="form-label" for="application-clock-mode">Mode waktu</label>
                <select
                  id="application-clock-mode"
                  v-model="applicationClockSettings.mode"
                  class="form-select"
                  :disabled="loadingApplicationClock || savingApplicationClock"
                >
                  <option value="realtime">Waktu sebenarnya</option>
                  <option value="simulation">Waktu simulasi</option>
                </select>
              </div>
              <div v-if="applicationClockSettings.mode === 'simulation'" class="col-md-5 mb-3">
                <label class="form-label" for="application-clock-start">
                  Mulai dari tanggal dan jam (WIB)
                </label>
                <input
                  id="application-clock-start"
                  v-model="applicationClockSettings.simulatedAt"
                  type="datetime-local"
                  class="form-control"
                  :disabled="loadingApplicationClock || savingApplicationClock"
                  required
                />
              </div>
              <div class="col-md-3 mb-3">
                <button
                  type="button"
                  class="btn btn-success w-100"
                  :disabled="loadingApplicationClock || savingApplicationClock"
                  @click="saveApplicationClock"
                >
                  <span v-if="savingApplicationClock" class="spinner-border spinner-border-sm me-1"></span>
                  {{ savingApplicationClock ? "Menyimpan..." : "Simpan Jam" }}
                </button>
              </div>
            </div>
            <div v-if="applicationClockError" class="alert alert-danger mb-0" role="alert">
              {{ applicationClockError }}
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
        <div class="d-flex flex-wrap gap-2">
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
import {
  getAcademicPeriod,
  getApplicationClock,
  updateAcademicPeriod,
  updateApplicationClock,
} from "@/services/api";
import { applyApplicationClock } from "@/services/applicationClock";

export default {
  name: "SuperAdminSettings",
  data() {
    return {
      academicPeriod: {
        academic_year: "",
        semester: "odd",
      },
      loadingAcademicPeriod: false,
      savingAcademicPeriod: false,
      academicPeriodError: "",
      applicationClockSettings: {
        mode: "realtime",
        simulatedAt: "",
      },
      loadingApplicationClock: false,
      savingApplicationClock: false,
      applicationClockError: "",
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
    this.loadAcademicPeriod();
    this.loadApplicationClock();
  },
  methods: {
    async loadApplicationClock() {
      this.loadingApplicationClock = true;
      this.applicationClockError = "";
      try {
        const clock = await getApplicationClock();
        this.applicationClockSettings = {
          mode: clock.mode,
          simulatedAt: clock.simulated_at
            ? this.formatJakartaDateTime(clock.simulated_at)
            : "",
        };
        applyApplicationClock(clock);
      } catch (error) {
        console.error("Gagal memuat jam aplikasi:", error);
        this.applicationClockError = error.message || "Gagal memuat jam aplikasi.";
      } finally {
        this.loadingApplicationClock = false;
      }
    },
    formatJakartaDateTime(value) {
      return new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .format(new Date(value))
        .replace(" ", "T");
    },
    async saveApplicationClock() {
      this.savingApplicationClock = true;
      this.applicationClockError = "";
      try {
        let simulatedAt = null;
        if (this.applicationClockSettings.mode === "simulation") {
          if (!this.applicationClockSettings.simulatedAt) {
            throw new Error("Tanggal dan jam simulasi harus diisi.");
          }

          simulatedAt = new Date(
            `${this.applicationClockSettings.simulatedAt}:00+07:00`,
          );
          if (Number.isNaN(simulatedAt.getTime())) {
            throw new Error("Tanggal dan jam simulasi tidak valid.");
          }
        }

        const clock = await updateApplicationClock({
          mode: this.applicationClockSettings.mode,
          simulated_at: simulatedAt?.toISOString() || null,
        });
        this.applicationClockSettings.simulatedAt = clock.simulated_at
          ? this.formatJakartaDateTime(clock.simulated_at)
          : "";
        applyApplicationClock(clock);
        alert(
          clock.mode === "simulation"
            ? "Jam simulasi berhasil diaktifkan untuk seluruh aplikasi."
            : "Jam aplikasi kembali menggunakan waktu sebenarnya.",
        );
      } catch (error) {
        console.error("Gagal menyimpan jam aplikasi:", error);
        this.applicationClockError = error.message || "Gagal menyimpan jam aplikasi.";
      } finally {
        this.savingApplicationClock = false;
      }
    },
    async loadAcademicPeriod() {
      this.loadingAcademicPeriod = true;
      this.academicPeriodError = "";
      try {
        const period = await getAcademicPeriod();
        this.academicPeriod = {
          academic_year: period.academic_year,
          semester: period.semester,
        };
      } catch (error) {
        console.error("Gagal memuat periode akademik:", error);
        this.academicPeriodError = error.message || "Gagal memuat periode akademik.";
      } finally {
        this.loadingAcademicPeriod = false;
      }
    },
    async saveAcademicPeriod() {
      this.savingAcademicPeriod = true;
      this.academicPeriodError = "";
      try {
        const period = await updateAcademicPeriod(this.academicPeriod);
        this.academicPeriod = {
          academic_year: period.academic_year,
          semester: period.semester,
        };
        alert("Periode akademik aktif berhasil disimpan.");
      } catch (error) {
        console.error("Gagal menyimpan periode akademik:", error);
        this.academicPeriodError = error.message || "Gagal menyimpan periode akademik.";
      } finally {
        this.savingAcademicPeriod = false;
      }
    },
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
