<template>
  <div style="padding: 20px" class="text-white text-start p-5">
    <h1>Validasi KBM</h1>

    <!-- =========================
    FORM
    ========================== -->

    <div style="margin-bottom: 10px">
      <label>Guru</label>

      <br />

      <select v-model="form.teacher_id">
        <option value="">Pilih Guru</option>

        <option
          v-for="teacher in teachers"
          :key="teacher.id"
          :value="teacher.id"
        >
          {{ teacher.name }}
        </option>
      </select>
    </div>

    <div style="margin-bottom: 10px">
      <label>Kelas</label>

      <br />

      <select v-model="form.class_id">
        <option value="">Pilih Kelas</option>

        <option v-for="kelas in classes" :key="kelas.id" :value="kelas.id">
          {{ kelas.nama_kelas }}
        </option>
      </select>
    </div>

    <div style="margin-bottom: 10px">
      <label>Status Hadir</label>

      <br />

      <select v-model="form.status_hadir">
        <option value="hadir">Hadir</option>
        <option value="tidak_hadir">Tidak Hadir</option>
      </select>
    </div>

    <div style="margin-bottom: 10px">
      <label>Status Pembelajaran</label>

      <br />

      <select v-model="form.status_pembelajaran">
        <option value="mengajar">Mengajar</option>
        <option value="praktik">Praktik</option>
        <option value="diskusi">Diskusi</option>
        <option value="tugas">Memberi Tugas</option>
        <option value="kelas_kosong">Kelas Kosong</option>
      </select>
    </div>

    <button @click="saveAttendance">Simpan Attendance</button>

    <hr />

    <!-- =========================
    DEBUG
    ========================== -->

    <p>Total Attendance: {{ attendanceList.length }}</p>
    <p>Attendance Hari Ini: {{ todayAttendance.length }}</p>

    <hr />

    <hr />

    <h2>Statistik Hari Ini</h2>

    <div style="display: flex; gap: 20px; margin-bottom: 20px">
      <div
        style="
          border: 1px solid #ccc;
          padding: 15px;
          width: 200px;
          border-radius: 10px;
        "
      >
        <h3>Total Hadir</h3>

        <h1>{{ totalHadir }}</h1>
      </div>

      <div
        style="
          border: 1px solid #ccc;
          padding: 15px;
          width: 200px;
          border-radius: 10px;
        "
      >
        <h3>Kelas Kosong</h3>

        <h1>{{ totalKelasKosong }}</h1>
      </div>

      <div
        style="
          border: 1px solid #ccc;
          padding: 15px;
          width: 200px;
          border-radius: 10px;
        "
      >
        <h3>Terlambat</h3>

        <h1>{{ totalTerlambat }}</h1>
      </div>
    </div>

    <!-- =========================
    TABLE
    ========================== -->

    <h2>Data Attendance KBM Hari Ini</h2>

    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>Guru</th>
          <th>Kelas</th>
          <th>Status</th>
          <th>Pembelajaran</th>
          <th>Validator</th>
          <th>Jam</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in todayAttendance" :key="item.id">
          <td>{{ index + 1 }}</td>

          <td>
            {{ formatTanggal(item.tanggal) }}
          </td>

          <td>
            {{ getTeacherName(item.teacher_id) }}
          </td>

          <td>
            {{ getClassName(item.class_id) }}
          </td>

          <td>{{ item.status_hadir }}</td>

          <td>
            {{ item.status_pembelajaran }}
          </td>

          <td>{{ item.validator }}</td>

          <td>
            {{ formatJam(item.timestamp) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// import {
//   getTeachers,
//   getClasses,
//   getAttendanceKBM,
//   saveAttendanceKBM,
// } from "@/services/api.js";

// =========================
// STATE
// =========================

const attendanceList = ref([]);
const classes = ref([]);
const teachers = ref([]);

// =========================
// FORM
// =========================

const form = ref({
  teacher_id: "",
  class_id: "",
  status_hadir: "hadir",
  status_pembelajaran: "mengajar",
  terlambat: "tidak",
  validator: "Budi",
  catatan: "",
});

// =========================
// PARSE DATE INDONESIA
// dd/MM/yyyy HH:mm:ss
// =========================

function parseDateIndonesia(dateString) {
  if (!dateString) return null;

  const [datePart, timePart] = dateString.split(" ");

  if (!datePart) return null;

  const [day, month, year] = datePart.split("/");

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (timePart) {
    const timeSplit = timePart.split(":");

    hours = Number(timeSplit[0]);
    minutes = Number(timeSplit[1]);
    seconds = Number(timeSplit[2]);
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hours,
    minutes,
    seconds
  );
}

// =========================
// FILTER HARI INI
// =========================

const todayAttendance = computed(() => {
  return attendanceList.value.filter((item) => {
    if (!item.timestamp) return false;

    const itemDate = parseDateIndonesia(item.timestamp);

    if (!itemDate) return false;

    const today = new Date();

    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  });
});

// =========================
// STATISTIK
// =========================

const totalHadir = computed(() => {
  return todayAttendance.value.filter(
    (item) => item.status_hadir === "hadir"
  ).length;
});

const totalKelasKosong = computed(() => {
  return todayAttendance.value.filter(
    (item) => item.status_pembelajaran === "kelas_kosong"
  ).length;
});

const totalTerlambat = computed(() => {
  return todayAttendance.value.filter(
    (item) => item.terlambat === "ya"
  ).length;
});

// =========================
// LOAD DATA
// =========================

async function loadAttendance() {
  try {
    const data = await getAttendanceKBM();

    console.log("ATTENDANCE:", data);

    attendanceList.value = data;
  } catch (error) {
    console.log(error);
  }
}

async function loadClasses() {
  try {
    const data = await getClasses();

    classes.value = data;
  } catch (error) {
    console.log(error);
  }
}

async function loadTeachers() {
  try {
    const data = await getTeachers();

    teachers.value = data;
  } catch (error) {
    console.log(error);
  }
}

// =========================
// SAVE
// =========================

async function saveAttendance() {
  try {
    await saveAttendanceKBM(form.value);

    alert("Attendance berhasil disimpan");

    loadAttendance();
  } catch (error) {
    console.log(error);

    alert("Gagal menyimpan");
  }
}

// =========================
// HELPER
// =========================

function getTeacherName(id) {
  const teacher = teachers.value.find((item) => item.id == id);

  return teacher ? teacher.name : "Unknown";
}

function getClassName(id) {
  const kelas = classes.value.find((item) => item.id == id);

  return kelas ? kelas.nama_kelas : "Unknown";
}

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const date = parseDateIndonesia(tanggal);

  return date
    ? date.toLocaleDateString("id-ID")
    : tanggal;
}

function formatJam(timestamp) {
  if (!timestamp) return "-";

  const date = parseDateIndonesia(timestamp);

  return date
    ? date.toLocaleTimeString("id-ID")
    : timestamp;
}

// =========================
// INIT
// =========================

onMounted(() => {
  loadTeachers();

  loadClasses();

  loadAttendance();
});
</script>
