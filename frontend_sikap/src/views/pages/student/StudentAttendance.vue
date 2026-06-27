<template>
  <div class="attendance-page">
    <div class="page-header">
      <h3 class="page-title">Validasi Kehadiran Guru</h3>

      <p class="page-subtitle">
        Laporkan kondisi pembelajaran yang sedang berlangsung.
      </p>
    </div>

    <!-- TIDAK ADA GURU -->

    <div
      v-if="!currentTeacher"
      class="glass-card text-center"
    >
      Tidak ada jadwal mengajar saat ini
    </div>

    <!-- SUDAH DIVALIDASI -->

    <div
      v-else-if="alreadyValidated"
      class="validated-card"
    >
      <i class="bi bi-check-circle-fill"></i>
      Guru sudah divalidasi hari ini
    </div>

    <!-- FORM VALIDASI -->

    <template v-else>

      <div class="glass-card mb-4">
        <div class="teacher-info">

          <div class="teacher-avatar">
            <i class="bi bi-person-workspace"></i>
          </div>

          <div>
            <h4>{{ currentTeacher.teacher_name }}</h4>

            <p>
              {{ currentTeacher.subject_name }}
            </p>

            <small>
              Ruang {{ currentTeacher.ruang }}
              • JP {{ currentTeacher.jp_mulai }}
              - {{ currentTeacher.jp_selesai }}
            </small>
          </div>

        </div>
      </div>

      <div class="glass-card">

        <div class="input-group-custom">
          <label>Status Kehadiran Guru</label>

          <select v-model="form.status_hadir">
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
          </select>
        </div>

        <div class="input-group-custom">
          <label>Status Pembelajaran</label>

          <select v-model="form.status_pembelajaran">
            <option value="mengajar">Mengajar</option>
            <option value="praktik">Praktik</option>
            <option value="diskusi">Diskusi</option>
            <option value="tugas">Memberi Tugas</option>
            <option value="kelas_kosong">Kelas Kosong</option>
          </select>
        </div>

        <div class="input-group-custom">
          <label>Keterlambatan</label>

          <select v-model="form.terlambat">
            <option value="tidak">Tidak</option>
            <option value="ya">Ya</option>
          </select>
        </div>

        <div class="input-group-custom">
          <label>Catatan</label>

          <textarea
            rows="4"
            v-model="form.catatan"
            placeholder="Catatan tambahan..."
          />
        </div>

        <button
          class="submit-btn"
          @click="saveAttendance"
          :disabled="loading"
        >
          {{ loading ? "Menyimpan..." : "Simpan Validasi" }}
        </button>

      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import {
  saveAttendanceKBM,
  getCurrentTeacher,
  checkValidation,
} from "@/services/api.js";

// ======================
// STATE
// ======================

const currentTeacher = ref(null);
const alreadyValidated = ref(false);
const loading = ref(false);

const form = ref({
  status_hadir: "hadir",
  status_pembelajaran: "mengajar",
  terlambat: "tidak",
  validator: "Ketua Murid",
  catatan: "",
});

// ======================
// USER LOGIN
// ======================

const user = JSON.parse(localStorage.getItem("user"));

const classId = user?.class_id || 1;

// ======================
// CEK VALIDASI
// ======================

async function loadValidationStatus() {
  try {
    if (!currentTeacher.value) return;

    const response = await checkValidation(
      currentTeacher.value.teacher_id,
      classId
    );

    if (response.success) {
      alreadyValidated.value = response.already_validated;
    }
  } catch (error) {
    console.log(error);
  }
}

// ======================
// LOAD GURU SAAT INI
// ======================

async function loadCurrentTeacher() {
  try {
    const response = await getCurrentTeacher(classId);

    if (response.success) {
      currentTeacher.value = response;

      await loadValidationStatus();
    } else {
      currentTeacher.value = null;
    }
  } catch (error) {
    console.log(error);
  }
}

// ======================
// SAVE VALIDASI
// ======================

async function saveAttendance() {
  if (!currentTeacher.value) {
    alert("Tidak ada guru yang sedang mengajar");
    return;
  }

  if (alreadyValidated.value) {
    alert("Guru sudah divalidasi hari ini");
    return;
  }

  try {
    loading.value = true;

    await saveAttendanceKBM({
      teacher_id: currentTeacher.value.teacher_id,
      class_id: classId,
      status_hadir: form.value.status_hadir,
      status_pembelajaran: form.value.status_pembelajaran,
      terlambat: form.value.terlambat,
      validator: form.value.validator,
      catatan: form.value.catatan,
    });

    alreadyValidated.value = true;

    alert("Validasi berhasil disimpan");
  } catch (error) {
    console.log(error);
    alert("Gagal menyimpan validasi");
  } finally {
    loading.value = false;
  }
}

// ======================
// INIT
// ======================

onMounted(() => {
  loadCurrentTeacher();
});
</script>

<style scoped>
.attendance-page {
  color: white;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.7rem;
}

.page-subtitle {
  color: #94a3b8;
}

.glass-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.teacher-avatar {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: rgba(16, 185, 129, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
}

.teacher-info h4 {
  margin: 0;
}

.teacher-info p {
  margin: 0;
  color: #cbd5e1;
}

.teacher-info small {
  color: #94a3b8;
}

.input-group-custom {
  margin-bottom: 16px;
}

.input-group-custom label {
  display: block;
  margin-bottom: 8px;
}

select,
textarea {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.submit-btn {
  width: 100%;
  border: none;
  padding: 14px;
  border-radius: 18px;
  background: #10b981;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.validated-card {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  font-weight: 600;
}

.validated-card i {
  margin-right: 10px;
}
</style>