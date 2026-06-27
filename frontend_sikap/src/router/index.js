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
import ResponsibleActivity from "@/views/pages/responsible/ResponsibleActivities.vue";
import ResponsibleAttendance from "@/views/pages/responsible/ResponsibleAttendance.vue";

// SUPER ADMIN
import SuperAdminLayout from "@/views/layouts/superadmin/SuperAdminLayout.vue"; 
import SuperAdminDashboard from "@/views/pages/superadmin/SuperAdminDashboard.vue";
import SuperAdminSchedule from "@/views/pages/superadmin/SuperAdminSchedule.vue";
import SuperAdminSettings from "@/views/pages/superadmin/SuperAdminSettings.vue";
import SuperAdminteacher from "@/views/pages/superadmin/SuperAdminTeacher.vue";
import SuperAdminUser from "@/views/pages/superadmin/SuperAdminUser.vue";

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
        component: HeadmasterKbm,
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
        path : "kegiatan",
        name : "ResponsibleActivity",
        component : ResponsibleActivity,
      },
      {
        path : "absensi",
        name : "ResponsibleAttendance",
        component : ResponsibleAttendance,
      },
    ],
    meta: {
      requiresAuth: true,
      role: "responsible",
    },
  }

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

router.beforeEach((to, from, next) => {
  // ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // cek apakah route butuh login
  if (to.meta.requiresAuth) {
    // =========================
    // BELUM LOGIN
    // =========================

    if (!user) {
      alert("Silakan login terlebih dahulu");

      return next("/");
    }

    // =========================
    // ROLE TIDAK SESUAI
    // =========================

    if (to.meta.role && to.meta.role !== user.role) {
      alert("Akses ditolak");

      // redirect sesuai role user

      if (user.role === "student") {
        return next("/ketua-murid/dashboard");
      } else if (user.role === "headmaster") {
        return next("/kepala-sekolah/dashboard");
      } else if (user.role === "responsible") {
        return next("/penanggung-jawab/dashboard");
      } else if (user.role === "admin") {
        return next("/super-admin/dashboard");
      }
    }
  }

  next();
});

export default router;
