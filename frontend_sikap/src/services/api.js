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
