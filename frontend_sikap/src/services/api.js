const API_URL = import.meta.env.VITE_API_BASE_URL;

// ======================
// LOGIN
// ======================

export async function login(payload) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

// ======================
// GET TEACHERS
// ======================

export async function getTeachers() {
  const res = await fetch(`${API_URL}/api/teachers`);
  return await res.json();
}

export async function getTeachersCount() {
  const res = await fetch(`${API_URL}/api/teachers/count`);

  return await res.json();
}

// ======================
// GET CLASSES
// ======================

export async function getClasses() {
  const res = await fetch(`${API_URL}/api/classschedules/current`);

  return await res.json();
}

// ======================
// GET ATTENDANCE KBM
// ======================

export async function getAttendanceKBM() {
  const res = await fetch(`${API_URL}/api/attendance/kbm`);

  return await res.json();
}

// ======================
// SAVE ATTENDANCE KBM
// ======================

export async function saveAttendanceKBM(payload) {
  await fetch(`${API_URL}/api/attendance/kbm`, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({
      action: "save_kbm",
      ...payload,
    }),
  });

  return {
    success: true,
  };
}

// ======================
// GET SCHEDULES KMB TODAY
// ======================

export async function getScheduleToday(classId) {
  const response = await fetch(
    `${API_URL}?action=schedule_today&class_id=${classId}`,
  );

  return await response.json();
}

// ======================
// GET CURRENT TEACHER
// ======================

export async function getCurrentTeacher(classId) {
  const response = await fetch(
    `${API_URL}?action=current_teacher&class_id=${classId}`,
  );

  return await response.json();
}

// ======================
// CHECK VALIDATION
// ======================

export async function checkValidation(teacherId, classId) {
  const response = await fetch(
    `${API_URL}?action=check_validation&teacher_id=${teacherId}&class_id=${classId}`,
  );

  return await response.json();
}

// ======================
// GET MONITORING KELAS
// ======================

export async function getMonitoringKelas() {
  const response = await fetch(`${API_URL}?action=monitoring_kelas`);

  return await response.json();
}
