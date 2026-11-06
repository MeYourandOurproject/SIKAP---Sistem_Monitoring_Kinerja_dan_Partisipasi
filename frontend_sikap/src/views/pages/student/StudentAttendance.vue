<template>
  <!-- Add your attendance content here -->
  <div class="attendance-pages">
    <div class="container-fluid">
      <!-- HEADER -->
      <div class="row d-flex align-items-center d-md-none">
        <div class="col-1">
          <router-link
            to="/ketua-murid/dashboard"
            class="btn text-white p-0 m-0"
            ><i class="bi back bi-arrow-left-short me-2"></i>
          </router-link>
        </div>
        <div class="col-8 text-start pt-2 ms-2">
          <h4><i class="bi bi-back"></i></h4>
        </div>
      </div>

      <div class="attendance-page mt-4 mt-md-0">
        <!-- HEADER -->
        <div class="page-header text-start mb-4">
          <div>
            <h3 class="page-title">Input Kehadiran Siswa dan Guru</h3>

            <p class="page-subtitle">
              Monitoring kehadiran siswa dan guru beserta aktivitas pembelajaran
              secara real-time
            </p>
          </div>
          <div class="gap-3 d-flex flex-column flex-md-row">
            <button class="student-btn bg-primary">
              <i class="bi bi-person-plus me-2"></i>
              Input Absensi Siswa
            </button>
            <button class="teacher-btn bg-success">
              <i class="bi bi-person-plus me-2"></i>
              Input Absensi Guru
            </button>
          </div>
        </div>

        <div class="row g-4 text-start">
          <div class="col-12 col-md-6">
            <div class="glass-card">
              <div class="section-header mb-2">
                <h5>Tabel Kehadiran Siswa</h5>
                <!-- <small>Input kehadiran siswa secara real-time</small> -->
              </div>
              <p class="page-subtitle mb-3">
                Silakan pilih nama siswa dan keterangan kehadiran untuk
                menginput data kehadiran siswa secara real-time.
              </p>

              <div class="row d-flex align-items-center">
                <div class="col-12 col-md-6 mb-3">
                  <select class="p-2 rounded-2" placeholder="Nama Siswa">
                    <option value="">Nama Siswa</option>
                    <option value="Ruly">Ruly</option>
                    <option value="Andi">Andi</option>
                    <option value="Budi">Budi</option>
                    <option value="Citra">Citra</option>
                  </select>
                </div>
                <div class="col col-md-4 mb-3">
                  <select class="p-2 rounded-2" placeholder="Keterangan">
                    <option value="">Keterangan</option>
                    <option value="hadir">Hadir</option>
                    <option value="terlambat">Terlambat</option>
                    <option value="tidak-hadir">Tidak Hadir</option>
                  </select>
                </div>
                <div class="col-auto col-md-2 mb-3">
                  <button class="btn btn-primary w-100">
                    <i class="bi bi-send"></i>
                  </button>
                </div>
              </div>
              <div class="row d-flex align-items-center mt-3">
                <p class="page-subtitle mb-3">
                  Tabel di bawah ini menampilkan daftar kehadiran siswa yang
                  telah diinput secara real-time. Silakan periksa data kehadiran
                  siswa untuk memastikan keakuratan informasi.
                </p>
                <!-- TABEL -->
                <div class="table-responsive">
                  <table
                    class="table table-hover table-striped table-bordered align-middle"
                  >
                    <thead>
                      <tr>
                        <th>Nama Siswa</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ruly</td>
                        <td class="fw-bold">Hadir</td>
                      </tr>
                      <tr>
                        <td>Andi</td>
                        <td class="fw-bold">Terlambat</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- <button class="submit-btn">Input Kehadiran Siswa</button> -->
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="glass-card">
              <div class="section-header mb-3">
                <div>
                  <h5 class="section-header mb-2">Validasi Kehadiran Guru</h5>

                  <p class="page-subtitle">
                    Pantau jadwal guru yang sedang berlangsung dan status
                    validasi.
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="current-validation" v-if="dashboard.current">
                    <div class="col-12">
                      <div class="current-tag bg-success text-white">
                        <i class="bi bi-play-circle-fill me-2"></i>Sedang
                        Berlangsung
                      </div>
                    </div>
                    <div class="current-row">
                      <div>
                        <h6 class="current-subject">
                          {{ dashboard.current.subject_name }}
                        </h6>

                        <p class="teacher-name mb-1">
                          <i class="bi bi-person"></i>
                          {{ dashboard.current.teacher_name }}
                        </p>

                        <div class="compact-info">
                          <i class="bi bi-clock"></i>
                          {{ dashboard.current.start }} -
                          {{ dashboard.current.end }}
                        </div>

                        <div class="compact-info">
                          <i class="bi bi-geo-alt"></i>
                          {{ dashboard.current.classroom_name }}
                        </div>
                      </div>
                    </div>
                    <div class="validation-line mt-3" v-if="dashboard.current">
                      <div class="row">
                        <div class="col-auto">
                          <span
                            class="validation-badge"
                            :class="dashboard.current.validated ? 'validated' : 'not-validated'"
                          >
                            {{ dashboard.current.validated ? 'Sudah divalidasi' : 'Belum divalidasi' }}
                          </span>
                        </div>
                        <div class="col-auto">
                          <button type="button" class="btn btn-primary btn-sm" @click="openInlineForm(dashboard.current)">{{ dashboard.current.validated ? 'Edit' : 'Tambah' }}</button>
                        </div>
                      </div>
                    </div>

                    <div class="validation-form mt-3" v-if="dashboard.current && showInlineForms[dashboard.current.id]">
                      <div class="row g-3">
                        <div class="col-12 col-md-6">
                          <label class="form-label">Kehadiran Guru</label>
                          <select v-model="validationForm.attendance_status" class="form-select">
                            <option value="present">Hadir</option>
                            <option value="permission">Izin</option>
                            <option value="absent">Tidak Hadir</option>
                          </select>
                        </div>
                        <div class="col-12 col-md-6">
                          <label class="form-label">Status Aktivitas</label>
                          <select v-model="validationForm.activity_status" class="form-select">
                            <option value="teaching">Mengajar</option>
                            <option value="empty">Kosong</option>
                            <option value="assignment">Tugas</option>
                          </select>
                        </div>
                        <div class="col-12 col-md-6">
                          <label class="form-label">Keterlambatan (menit)</label>
                          <input type="number" min="0" v-model.number="validationForm.lateness" class="form-control" />
                        </div>
                        <div class="col-12">
                          <label class="form-label">Catatan</label>
                          <textarea v-model="validationForm.notes" class="form-control" rows="2" placeholder="Catatan opsional"></textarea>
                        </div>
                        <div class="col-12 d-flex flex-wrap gap-2">
                          <button type="button" class="btn btn-success" :disabled="isSubmitting" @click="submitValidationForm">{{ isSubmitting ? 'Menyimpan...' : (dashboard.current.validated ? 'Simpan Perubahan' : 'Submit Validasi') }}</button>
                          <button type="button" class="btn btn-secondary" @click="showInlineForms[dashboard.current.id] = false">Batal</button>
                        </div>
                        <div class="col-12" v-if="validationError"><p class="text-danger small mb-0">{{ validationError }}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--  -->
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-12">
            <div class="glass-card">
              <div class="section-header mb-3">
                <h5>Jadwal Guru Hari Ini</h5>
              </div>
              <div class="timeline">
                <div class="timeline-item" v-for="(item, index) in scheduleList" :key="index">
                  <div class="timeline-connector">
                    <span class="timeline-dot" :class="{ current: item.status === 'current', finished: item.status === 'finished' }"></span>
                    <span class="timeline-time fw-bold">{{ item.start }}</span>
                  </div>

                  <div class="timeline-content text-start">
                    <div class="timeline-card">
                      <div class="timeline-card-header">
                        <span class="status-badge" :class="item.status === 'finished' ? 'badge-success' : 'badge-blue'">
                          {{ item.status === 'finished' ? 'Selesai' : 'Berikutnya' }}
                        </span>
                        <!-- show add/edit only for finished or current; scheduleList excludes current, so this covers finished only -->
                        <div v-if="item.status === 'finished'" style="margin-left:8px">
                          <button class="btn btn-sm btn-outline-primary" @click.prevent="openInlineForm(item)">{{ item.validated ? 'Edit' : 'Tambah' }}</button>
                        </div>
                      </div>

                      <div class="row gap-1">
                        <h6 class="timeline-subject">{{ item.subject_name }}</h6>
                        <p class="timeline-teacher"><i class="bi bi-person me-2"></i>{{ item.teacher_name }}</p>
                        <p class="timeline-room"><i class="bi bi-geo-alt me-2"></i>{{ item.classroom_name }}</p>
                        <span class="validation-badge mt-2" :class="item.validated ? 'validated' : 'not-validated'">{{ item.validated ? 'Sudah divalidasi' : 'Belum divalidasi' }}</span>

                        <div class="mt-3" v-if="showInlineForms[item.id]">
                          <div class="row g-3">
                            <div class="col-12 col-md-6">
                              <label class="form-label">Kehadiran Guru</label>
                              <select v-model="validationForm.attendance_status" class="form-select">
                                <option value="present">Hadir</option>
                                <option value="permission">Izin</option>
                                <option value="absent">Tidak Hadir</option>
                              </select>
                            </div>
                            <div class="col-12 col-md-6">
                              <label class="form-label">Status Aktivitas</label>
                              <select v-model="validationForm.activity_status" class="form-select">
                                <option value="teaching">Mengajar</option>
                                <option value="empty">Kosong</option>
                                <option value="assignment">Tugas</option>
                              </select>
                            </div>
                            <div class="col-12 col-md-6">
                              <label class="form-label">Keterlambatan (menit)</label>
                              <input type="number" min="0" v-model.number="validationForm.lateness" class="form-control" />
                            </div>
                            <div class="col-12">
                              <label class="form-label">Catatan</label>
                              <textarea v-model="validationForm.notes" class="form-control" rows="2" placeholder="Catatan opsional"></textarea>
                            </div>
                            <div class="col-12 d-flex gap-2">
                              <button type="button" class="btn btn-success" :disabled="isSubmitting" @click="submitValidationForm">{{ isSubmitting ? 'Menyimpan...' : (item.validated ? 'Simpan Perubahan' : 'Submit Validasi') }}</button>
                              <button type="button" class="btn btn-secondary" @click="showInlineForms[item.id] = false">Batal</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="timeline-empty" v-if="scheduleList.length === 0">Tidak ada jadwal hari ini.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { applicationClock } from "@/services/applicationClock";
import {
  getClassSchedules,
  createClassTeacherAttendance,
} from "@/services/api";

const dashboard = ref({
  class: "",
  current: null,
  data: [],
});

const scheduleList = computed(() => {
  if (!dashboard.value.data) return [];
  return dashboard.value.data.filter((i) => i.status !== "current");
});

const showValidationForm = ref(false);
const validationForm = ref({
  attendance_status: "present",
  activity_status: "teaching",
  lateness: 0,
  notes: "",
});
const validationError = ref("");
const isSubmitting = ref(false);
const showInlineForms = ref({});
const selectedInline = ref(null);

async function fetchSchedules() {
  dashboard.value = await getClassSchedules();
}

function prefillValidationFormFrom(item) {
  if (!item) return;
  validationForm.value.attendance_status = item.attendance_status || item.status_hadir || item.statusHadir || item.status || "present";
  validationForm.value.activity_status = item.activity_status || item.status_pembelajaran || item.statusPembelajaran || item.activity || "teaching";
  validationForm.value.lateness = Number(item.lateness || 0);
  validationForm.value.notes = item.notes || item.catatan || "";
}

function openInlineForm(item) {
  if (!item) return;
  // close all others
  showInlineForms.value = {};
  // do NOT change dashboard.current when opening inline for finished items
  selectedInline.value = item;
  prefillValidationFormFrom(item);
  showInlineForms.value[item.id] = true;
}

function closeInlineForm(item) {
  if (!item) return;
  showInlineForms.value[item.id] = false;
  if (selectedInline.value && selectedInline.value.id === item.id) selectedInline.value = null;
}

function openValidationForm() {
  if (!dashboard.value.current) return;
  // prefill from current
  selectedInline.value = dashboard.value.current;
  validationForm.value.attendance_status = dashboard.value.current.attendance_status || dashboard.value.current.status_hadir || dashboard.value.current.statusHadir || dashboard.value.current.status || "present";
  validationForm.value.activity_status = dashboard.value.current.activity_status || dashboard.value.current.status_pembelajaran || dashboard.value.current.statusPembelajaran || dashboard.value.current.activity || "teaching";
  validationForm.value.lateness = Number(dashboard.value.current.lateness || 0);
  validationForm.value.notes = dashboard.value.current.notes || dashboard.value.current.catatan || "";

  validationError.value = "";
  showValidationForm.value = true;
}

async function submitValidationForm() {
  if (!dashboard.value.current) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const payload = {
    date: applicationClock.currentTime.toISOString(),
    classschedule_id: (selectedInline.value || dashboard.value.current).id,
    attendance_status: validationForm.value.attendance_status,
    activity_status: validationForm.value.activity_status,
    validator_id: user.id || null,
    validated_at: applicationClock.currentTime.toISOString(),
    lateness: Number(validationForm.value.lateness) || 0,
    notes: validationForm.value.notes,
  };

  try {
    isSubmitting.value = true;
    await createClassTeacherAttendance(payload);
    // refresh schedules so `validated` flags come from backend
    await fetchSchedules();
    showValidationForm.value = false;
    // close inline if open for this item
    const target = selectedInline.value || dashboard.value.current;
    if (target && showInlineForms.value[target.id]) showInlineForms.value[target.id] = false;
    selectedInline.value = null;
    validationForm.value = {
      attendance_status: "present",
      activity_status: "teaching",
      lateness: 0,
      notes: "",
    };
  } catch (error) {
    console.error(error);
    validationError.value = "Gagal menyimpan validasi. Coba lagi.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  fetchSchedules();
});
</script>

<style scoped>
.current-validation {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px;
}

.current-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.current-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(13, 81, 38, 0.15);
  color: #4ade80;
  font-weight: 700;
  font-size: 13px;
}

.current-subject {
  margin-top: 12px;
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.validation-line {
  margin-top: 14px;
}

.validation-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.validation-badge.validated {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.validation-badge.not-validated {
  background: rgba(248, 113, 113, 0.12);
  color: #f87171;
}

.timeline {
  position: relative;
  display: grid;
  gap: 24px;
  padding: 20px 0;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  left: 30px;
  width: 2px;
  height: 100%;
  /* background: rgba(148, 163, 184, 0.2); */
}

.timeline-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: flex-start;
  gap: 18px;
  position: relative;
}

.timeline-connector {
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.timeline-content {
  grid-column: 2 / 3;
  width: 100%;
}

.timeline-card {
  width: 100%;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.22);
}

.timeline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.timeline-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #38bdf8;
  background: rgba(56, 189, 248, 0.15);
}

.timeline-dot.current {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.2);
}

.timeline-dot.finished {
  border-color: #64748b;
  background: rgba(100, 116, 139, 0.2);
}

.timeline-time {
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
  max-width: 90px;
}

.timeline-subject {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: white;
}

.timeline-teacher,
.timeline-room {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.timeline-empty {
  color: #94a3b8;
  padding: 24px 0;
  text-align: center;
}

@media (max-width: 900px) {
  .timeline {
    padding: 10px 0;
  }

  .timeline::before {
    left: 26px;
  }

  .timeline-item {
    grid-template-columns: 40px 1fr;
  }

  .timeline-connector {
    grid-column: 1 / 2;
    align-items: center;
  }

  .timeline-card {
    max-width: none;
  }
}

.attendance-pages {
  /* margin: 1rem 0; */
  /* padding: 1rem 0; */
  /* margin: 0; */
  /* background-color: #1e293b; */
  color: white;
}
.back {
  font-size: 25px;
}

.attendance-page {
  color: white;
  padding-bottom: 100px;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  /* margin-bottom: 1.5rem; */
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.page-subtitle {
  color: #94a3b8;
  margin: 0;
  font-size: 14px;
}

.student-btn {
  border: none;
  /* background: linear-gradient(135deg, #2563eb, #1d4ed8); */
  color: white;
  padding: 12px 18px;
  border-radius: 16px;
  font-weight: 600;
}

.teacher-btn {
  border: none;
  /* background: linear-gradient(135deg, #39eb25, #34d011); */
  color: white;
  padding: 12px 18px;
  border-radius: 16px;
  font-weight: 600;
}

/* STATS */
.stats-card {
  border-radius: 24px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.stats-card h3 {
  font-size: 32px;
  margin: 6px 0 0;
}

.stats-card i {
  font-size: 34px;
}

.blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.green {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.orange {
  background: linear-gradient(135deg, #ea580c, #c2410c);
}

.red {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* CARD */
.glass-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  padding: 24px;
  backdrop-filter: blur(16px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h5 {
  margin: 0;
  font-weight: 700;
}

.section-header small {
  color: #94a3b8;
}

select,
textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 14px;
  color: white;
  outline: none;
}

select option {
  background: #0f172a;
}

textarea::placeholder,
input::placeholder {
  color: #64748b;
}

/* BUTTON */
.submit-btn {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 15px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 700;
  margin-top: 10px;
}

/* HISTORY */
.history-total {
  background: rgba(59, 130, 246, 0.16);
  color: #60a5fa;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.attendance-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attendance-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.attendance-avatar {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.attendance-avatar.hadir {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
}

.attendance-avatar.izin {
  background: rgba(59, 130, 246, 0.16);
  color: #60a5fa;
}

.attendance-avatar.sakit {
  background: rgba(168, 85, 247, 0.16);
  color: #c084fc;
}

.attendance-avatar.absen {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
}

.attendance-left h6 {
  margin: 0;
  font-weight: 600;
}

.attendance-left small {
  color: #94a3b8;
}

.attendance-right {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
  margin-bottom: 6px;
}

.status-badge.hadir {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
}

.status-badge.izin {
  background: rgba(59, 130, 246, 0.16);
  color: #60a5fa;
}

.status-badge.sakit {
  background: rgba(168, 85, 247, 0.16);
  color: #c084fc;
}

.status-badge.absen {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
}

.empty-state {
  text-align: center;
  padding: 70px 20px;
}

.empty-state i {
  font-size: 60px;
  color: #475569;
  margin-bottom: 18px;
}

.empty-state p {
  color: #94a3b8;
}

/* MOBILE */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .scan-btn {
    width: 100%;
  }

  .attendance-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .attendance-right {
    text-align: left;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== DARK TABLE ===== */
.table {
  --bs-table-bg: transparent;
  --bs-table-color: #e2e8f0;
  --bs-table-border-color: rgba(255, 255, 255, 0.08);
  --bs-table-striped-bg: rgba(255, 255, 255, 0.03);
  --bs-table-hover-bg: rgba(59, 130, 246, 0.12);
  --bs-table-hover-color: #ffffff;

  background: transparent;
  color: #e2e8f0;
  margin-bottom: 0;
  border-radius: 200px;
}

.table thead th {
  background: #1e293b;
  color: #f8fafc;
  border-color: rgba(255, 255, 255, 0.08);
  font-weight: 600;
}

.table tbody td {
  background: transparent;
  color: #e2e8f0;
  border-color: rgba(255, 255, 255, 0.08);
  vertical-align: middle;
}

.table tbody tr:hover td {
  background: rgba(59, 130, 246, 0.12);
}

.table-striped > tbody > tr:nth-of-type(odd) > * {
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
}

.table-bordered {
  border-color: rgba(255, 255, 255, 0.08);
}

/* CURRENT */

.current-card {
  background: #1b2338;

  border-radius: 24px;

  padding: 35px;

  margin-bottom: 45px;

  border: 1px solid rgba(255, 255, 255, 0.05);

  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
}

.current-tag {
  display: inline-block;

  padding: 8px 18px;

  border-radius: 10px;

  background: #22c55e;

  font-size: 13px;

  font-weight: 600;
}

.current-card h2 {
  font-weight: 700;
}

.teacher {
  /* font-size: 20px; */

  color: #dbeafe;
}

.current-card small {
  color: #94a3b8;
}

.current-card h5 {
  margin-top: 6px;

  font-weight: 600;
}

/* SECTION */

.section-title {
  margin-bottom: 20px;

  font-weight: 700;
}

/* SCHEDULE */

.schedule-item {
  display: flex;

  align-items: center;

  background: #1b2338;

  border-radius: 18px;

  margin-bottom: 18px;

  padding: 22px;

  transition: 0.25s;

  border: 1px solid rgba(255, 255, 255, 0.04);
}

.schedule-item:hover {
  transform: translateY(-4px);

  border-color: #3b82f6;
}

.schedule-left {
  width: 120px;
}

.schedule-time {
  font-size: 22px;

  font-weight: bold;
}

.schedule-time small {
  display: block;

  color: #94a3b8;

  font-size: 14px;
}

.schedule-body {
  flex: 1;
}

.schedule-body h5 {
  margin-bottom: 12px;

  font-weight: 700;
}

.teacher-name {
  color: #dbeafe;

  margin-bottom: 8px;
}

.room {
  color: #94a3b8;
}

.schedule-right {
  width: 140px;

  text-align: right;
}

.status {
  display: inline-block;

  padding: 10px 18px;

  border-radius: 30px;

  font-size: 13px;

  font-weight: 600;
}

.finished {
  background: #374151;
}

.upcoming {
  background: #2563eb;
}
</style>
