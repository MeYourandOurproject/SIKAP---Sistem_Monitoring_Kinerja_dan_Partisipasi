import { createRouter, createWebHistory } from "vue-router";

import LandingpageLayout from "@/views/layouts/landingpage/LandingpageLayout.vue";
import LandingPage from "@/views/pages/landingpage/LandingPage.vue";

import LoginPage from "@/components/authentiation/LoginPage.vue";
import DataTest from "@/views/DataTest.vue";

// HEADMASTER

import HeadmasterLayout from "@/views/layouts/headmaster/HeadmasterLayout.vue";
import HeadmasterDashboard from "@/views/pages/headmaster/HeadmasterDashboard.vue";
import HeadmasterKbm from "@/views/pages/headmaster/HeadmasterKbm.vue";
import HeadmasterTeacherParticipan from "@/views/pages/headmaster/HeadmasterTeacherParticipian.vue";
import headmasterTeacherScore from "@/views/pages/headmaster/HeadmasterTeacherScores.vue";
import HeadmasterReport from "@/views/pages/headmaster/HeadmasterReport.vue";
import HeadmasterAnnouncement from "@/views/pages/headmaster/HeadmasterAnnouncement.vue";

// STUDENT
import StudentLayout from "@/views/layouts/student/StudentLayout.vue";
import StudentDashboard from "@/views/pages/student/StudentDashboard.vue";
import StudentAttendance from "@/views/pages/student/StudentAttendance.vue";
import StudentReport from "@/views/pages/student/StudentReport.vue";

// PENANGGUNG JAWAB
import ResponsibleLayout from "@/views/layouts/responsible/ResponsibleLayout.vue";
import ResponsibleDashboard from "@/views/pages/responsible/ResponsibleDashboard.vue";
import ResponsibleKbm from "@/views/pages/responsible/ResponsibleKbm.vue";
import ResponsibleActivity from "@/views/pages/responsible/ResponsibleActivities.vue";
import ResponsibleAttendance from "@/views/pages/responsible/ResponsibleAttendance.vue";
import ResponsibleAttendanceHistory from "@/views/pages/responsible/ResponsibleAttendanceHistory.vue";

// TEACHER
import TeacherLayout from "@/views/layouts/teacher/TeacherLayout.vue";
import TeacherDashboard from "@/views/pages/teacher/TeacherDashboard.vue";
import TeacherSchedule from "@/views/pages/teacher/TeacherSchedule.vue";
import TeacherActivities from "@/views/pages/teacher/TeacherActivities.vue";

// SUPER ADMIN
import SuperAdminLayout from "@/views/layouts/superadmin/SuperAdminLayout.vue"; 
import SuperAdminDashboard from "@/views/pages/superadmin/SuperAdminDashboard.vue";
import SuperAdminSchedule from "@/views/pages/superadmin/SuperAdminSchedule.vue";
import SuperAdminSettings from "@/views/pages/superadmin/SuperAdminSettings.vue";
import SuperAdminteacher from "@/views/pages/superadmin/SuperAdminTeacher.vue";
import SuperAdminUser from "@/views/pages/superadmin/SuperAdminUser.vue";
import SuperAdminClasses from "@/views/pages/superadmin/SuperAdminClasses.vue";
import SuperAdminHomeroom from "@/views/pages/superadmin/SuperAdminHomeroom.vue";

const routes = [
  {
    path: "/data-test",
    name: "DataTest",
    component: DataTest,
  },
  {
    path: "/",
    component: LandingpageLayout,
    children: [{ path: "", name: "Landingpage", component: LandingPage }],
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/super-admin",
    component: SuperAdminLayout,
    children: [
      {
        path: "dashboard",
        name: "SuperAdminDashboard",
        component: SuperAdminDashboard,
      },
      {
        path: "schedule",
        name: "SuperAdminSchedule",
        component: SuperAdminSchedule,
      },
      {
        path: "settings",
        name: "SuperAdminSettings",
        component: SuperAdminSettings,
      },
      {
        path: "teacher",
        name: "SuperAdminteacher",
        component: SuperAdminteacher,
      },
      {
        path: "user",
        name: "SuperAdminUser",
        component: SuperAdminUser,
      },
      {
        path: "classes",
        redirect: { name: "SuperAdminStudents" },
      },
      {
        path: "classes/students",
        name: "SuperAdminStudents",
        component: SuperAdminClasses,
      },
      {
        path: "classes/homeroom",
        name: "SuperAdminHomeroom",
        component: SuperAdminHomeroom,
      },
      { path: "students", redirect: { name: "SuperAdminStudents" } },
    ],
    meta: {
      requiresAuth: true,
      role: "admin",
    },
  },
  {
    path: "/kepala-sekolah",
    component: HeadmasterLayout,
    children: [
      {
        path: "dashboard",
        name: "HeadmasterDashboard",
        component: HeadmasterDashboard,
      },
      {
        path: "kbm",
        name: "HeadmasterKbm",
        redirect: { name: "HeadmasterKbmRealtime" },
      },
      {
        path: "kbm/realtime",
        name: "HeadmasterKbmRealtime",
        component: HeadmasterKbm,
        props: { mode: "realtime" },
      },
      {
        path: "kbm/riwayat",
        name: "HeadmasterKbmHistory",
        component: HeadmasterKbm,
        props: { mode: "history" },
      },
      {
        path: "partisipasi-guru",
        name: "HeadmasterTeacherParticipan",
        component: HeadmasterTeacherParticipan,
      },
      {
        path: "penilaian",
        name: "HeadmasterTeacherScore",
        component: headmasterTeacherScore,
      },
      {
        path: "laporan",
        name: "HeadmasterReport",
        component: HeadmasterReport,
      },
      {
        path: "pengumuman",
        name: "HeadmasterAnnouncement",
        component: HeadmasterAnnouncement,
      },
    ],
    meta: {
      requiresAuth: true,
      role: "headmaster",
    },
  },
  {
    path: "/ketua-murid",
    component: StudentLayout,
    children: [
      {
        path: "dashboard",
        name: "StudentDashboard",
        component: StudentDashboard,
      },
      {
        path: "validasi",
        name: "StudentAttendance",
        component: StudentAttendance,
      },
      {
        path: "laporan",
        name: "StudentReport",
        component: StudentReport,
      },
    ],
    meta: {
      requiresAuth: true,
      role: "student",
    },
  },
  {
    path: "/penanggung-jawab",
    component: ResponsibleLayout,
    children: [
      {
        path: "dashboard",
        name: "ResponsibleDashboard",
        component: ResponsibleDashboard,
      },
      {
        path: "kbm",
        name: "ResponsibleKbm",
        redirect: { name: "ResponsibleKbmRealtime" },
      },
      {
        path: "kbm/realtime",
        name: "ResponsibleKbmRealtime",
        component: ResponsibleKbm,
        props: { mode: "realtime" },
      },
      {
        path: "kbm/riwayat",
        name: "ResponsibleKbmHistory",
        component: ResponsibleKbm,
        props: { mode: "history" },
      },
      {
        path : "kegiatan",
        name : "ResponsibleActivity",
        component : ResponsibleActivity,
      },
      {
        path : "absensi",
        name : "ResponsibleAttendance",
        component : ResponsibleAttendance,
      },
      {
        path: "kegiatan/riwayat-kehadiran",
        name: "ResponsibleAttendanceHistory",
        component: ResponsibleAttendanceHistory,
      },
    ],
    meta: {
      requiresAuth: true,
      role: "responsible",
    },
  },
  {
    path: "/guru",
    component: TeacherLayout,
    children: [
      {
        path: "dashboard",
        name: "TeacherDashboard",
        component: TeacherDashboard,
      },
      {
        path: "jadwal",
        name: "TeacherSchedule",
        component: TeacherSchedule,
      },
      {
        path: "kegiatan",
        name: "TeacherActivities",
        component: TeacherActivities,
      },
    ],
    meta: {
      requiresAuth: true,
      role: "teacher",
    },
  },

  //   {
  //     path: "/kegiatan",
  //     component: KegiatanDashboard,

  //     meta: {
  //       requiresAuth: true,
  //       role: "pj_kegiatan",
  //     },
  //   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// =========================
// ROUTE GUARD
// =========================

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("session_expires_at");
}

function isSessionExpired() {
  const expiresAt = Number(localStorage.getItem("session_expires_at"));
  return !expiresAt || Date.now() > expiresAt;
}

router.beforeEach((to) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    clearSession();
  }
  const token = localStorage.getItem("token");

  if (!to.meta.requiresAuth) return true;

  if (!user || !token || isSessionExpired()) {
    clearSession();
    alert("Sesi Anda telah habis. Silakan login kembali.");
    return "/login";
  }

  if (to.meta.role && to.meta.role !== user.role) {
    alert("Akses ditolak");
    const roleHome = {
      student: "/ketua-murid/dashboard",
      headmaster: "/kepala-sekolah/dashboard",
      responsible: "/penanggung-jawab/dashboard",
      admin: "/super-admin/dashboard",
      teacher: "/guru/dashboard",
    };
    return roleHome[user.role] || true;
  }

  return true;
});

export default router;
