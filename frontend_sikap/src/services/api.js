const API_URL = import.meta.env.VITE_API_BASE_URL;

function clearSessionAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  if (res.status === 401) {
    clearSessionAndRedirect();
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ======================
// LOGIN
// ======================

export async function login(payload) {
  return fetchJson(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getAcademicPeriod() {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/academic-period`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function updateAcademicPeriod(payload) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/academic-period`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// ======================
// GET TEACHERS
// ======================

export async function getTeachers() {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/teachers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getTeachersCount() {
  const res = await fetch(`${API_URL}/api/teachers/count`);

  return await res.json();
}

// ======================
// ACTIVITY
// ======================

export async function getActivities() {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activities`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createActivity(payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createTentativeActivity(payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activities/tentative`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createRoutineActivity(payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activities/routine`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteActivity(id) {
  const token = localStorage.getItem("token");
  try {
    await fetchJson(`${API_URL}/api/activities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateActivity(id, payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activities/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ======================
// ACTIVITY SESSION
// ======================

export async function getActivitySessions() {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activitysessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getActivityAttendanceHistory(filters) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value !== "" && value != null),
  );
  return fetchJson(
    `${API_URL}/api/activitysessions/attendance-history?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getTeacherActivitySessions() {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/activitysessions/teacher`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function createActivitySession(payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activitysessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getActiveActivitySessions() {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activitysessions/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function openActivitySession(payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/activitysessions/open`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getTodayActivityCancellations() {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/activitysessions/cancellations/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function cancelRoutineActivity(payload) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/activitysessions/cancellations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function restoreRoutineActivity(cancellationId) {
  const token = localStorage.getItem("token");
  return fetchJson(
    `${API_URL}/api/activitysessions/cancellations/${cancellationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

// ======================
// TEACHER ASSIGNMENT
// ======================

export async function getTeacherAssignments() {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/teacherassignments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createTeacherAssignment(payload) {
  const token = localStorage.getItem("token");
  try {
    const data = await fetchJson(`${API_URL}/api/teacherassignments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ======================
// GET CLASSES
// ======================

export async function getClasses() {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/classschedules/current`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getClassScheduleHistory(filters = {}) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "" && value != null),
    ),
  );
  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return fetchJson(`${API_URL}/api/classschedules/history${suffix}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

// ======================
// GET CLASS SCHEDULES
// ======================

export async function getClassSchedules() {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/classschedules/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getTeacherSchedules() {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/classschedules/teacher`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getTeacherScheduleAttendance(scheduleId) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/studentattendances/schedules/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function saveTeacherScheduleAttendance(scheduleId, attendance) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/studentattendances/schedules/${scheduleId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ attendance }),
  });
}

export async function getTeacherScheduleAgenda(scheduleId, date) {
  const token = localStorage.getItem("token");
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return fetchJson(`${API_URL}/api/classagendas/schedules/${scheduleId}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function saveTeacherScheduleAgenda(scheduleId, agenda) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/classagendas/schedules/${scheduleId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agenda),
  });
}

// ======================
// CREATE CLASS TEACHER ATTENDANCE
// ======================

export async function createClassTeacherAttendance(payload) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api/classteacherattendances`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// ======================
// GET ATTENDANCE KBM
// ======================

export async function getAttendanceKBM() {
  return fetchJson(`${API_URL}/api/attendance/kbm`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
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

async function adminRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export function getManagedTeachers() {
  return adminRequest("/teachers");
}

export function createManagedTeacher(payload) {
  return adminRequest("/teachers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateManagedTeacher(id, payload) {
  return adminRequest(`/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateManagedTeachersStatus(ids, status) {
  return adminRequest("/teachers/bulk-status", {
    method: "PATCH",
    body: JSON.stringify({ ids, status }),
  });
}

export function deleteManagedTeacher(id) {
  return adminRequest(`/teachers/${id}`, { method: "DELETE" });
}

export async function getScheduleManagementData() {
  const [schedules, classes, teachers, subjects, classrooms, timeslots] =
    await Promise.all([
      adminRequest("/classschedules"),
      adminRequest("/classes"),
      adminRequest("/teachers"),
      adminRequest("/subjects"),
      adminRequest("/classrooms"),
      adminRequest("/timeslots"),
    ]);

  return { schedules, classes, teachers, subjects, classrooms, timeslots };
}

export function createManagedSchedule(payload) {
  return adminRequest("/classschedules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateManagedSchedule(id, payload) {
  return adminRequest(`/classschedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteManagedSchedule(id) {
  return adminRequest(`/classschedules/${id}`, { method: "DELETE" });
}

export function getManagedUsers() {
  return adminRequest("/users");
}

export function createManagedUser(payload) {
  return adminRequest("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateManagedUser(id, payload) {
  return adminRequest(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteManagedUser(id) {
  return adminRequest(`/users/${id}`, { method: "DELETE" });
}

export function getManagedClasses() {
  return adminRequest("/classes");
}

export function updateManagedClass(id, payload) {
  return adminRequest(`/classes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getManagedStudents(filters = {}) {
  const query = new URLSearchParams(filters);
  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return adminRequest(`/students${suffix}`);
}

export function createManagedStudent(payload) {
  return adminRequest("/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateManagedStudent(id, payload) {
  return adminRequest(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function downloadStudentImportTemplate(level) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams({ level });
  const response = await fetch(`${API_URL}/api/students/import-template?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    clearSessionAndRedirect();
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Gagal mengunduh template siswa");
  }
  return response.blob();
}

export function importStudentsFromFile(file, level) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("level", level);

  return fetchJson(`${API_URL}/api/students/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}
