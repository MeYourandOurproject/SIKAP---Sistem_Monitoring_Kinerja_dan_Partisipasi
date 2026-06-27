import { createRouter, createWebHistory } from "vue-router";

import LandingPageLayout from "@/views/layouts/landingpage/LandingPageLayout.vue";
import LandingPage from "@/views/pages/landingpage/LandingPage.vue";
import LoginPage from "@/components/authentication/LoginPage.vue";

// SUPER ADMIN
import SuperAdminLayout from "@/views/layouts/superadmin/SuperAdminLayout.vue";
import SuperAdminDashboard from "@/views/pages/superadmin/SuperAdminDashboard.vue";
import SuperAdminTeacher from "@/views/pages/superadmin/SuperAdminTeacher.vue";
import SuperAdminSchedule from "@/views/pages/superadmin/SuperAdminSchedule.vue";
import SuperAdminUser from "@/views/pages/superadmin/SuperAdminUser.vue";
import SuperAdminSettings from "@/views/pages/superadmin/SuperAdminSettings.vue";

// HEADMASTER
import HeadMasterLayout from "@/views/layouts/headmaster/HeadMasterLayout.vue";
import HeadMasterDashboard from "@/views/pages/headmaster/HeadmasterDashboard.vue";
import HeadmasterKbm from "@/views/pages/headmaster/HeadmasterKbm.vue";
import HeadmasterTeacherParticipian from "@/views/pages/headmaster/HeadmasterTeacherParticipian.vue";
import HeadmasterTeacherScore from "@/views/pages/headmaster/HeadmasterTeacherScores.vue";
import HeadmasterReport from "@/views/pages/headmaster/HeadmasterReport.vue";
import HeadmasterAnnouncement from "@/views/pages/headmaster/HeadmasterAnnouncement.vue";

import PersonResponsibleLayout from "@/views/layouts/person_responsible/PersonResponsibleLayout.vue";
import PersonResponsibleDashboard from "@/views/pages/person_responsible/PersonResponsibleDashboard.vue";
import PersonResponsibleActivities from "@/views/pages/person_responsible/PersonResponsibleActivities.vue";
import PersonResponsibleAttendance from "@/views/pages/person_responsible/PersonResponsibleAttendance.vue";

import StudentLayout from "@/views/layouts/student/StudentLayout.vue";
import StudentDashboard from "@/views/pages/student/StudentDashboard.vue";
import StudentAttendance from "@/views/pages/student/StudentAttendance.vue";
import StudentReport from "@/views/pages/student/StudentReport.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LandingPageLayout,
      children: [
        {
          path: "",
          name: "LandingPage",
          component: LandingPage,
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    // {
    //   path: "/super-admin",
    //   component: SuperAdminLayout,
    //   meta: { requiresAuth: true, role: "super_admin" },
    //   children: [
    //     {
    //       path: "dashboard",
    //       name: "SuperAdminDashboard",
    //       component: SuperAdminDashboard,
    //     },
    //     {
    //       path: "guru",
    //       name: "SuperAdminTeacher",
    //       component: SuperAdminTeacher,
    //     },
    //     {
    //       path: "jadwal",
    //       name: "SuperAdminSchedule",
    //       component: SuperAdminSchedule,
    //     },
    //     {
    //       path: "pengguna",
    //       name: "SuperAdminUser",
    //       component: SuperAdminUser,
    //     },
    //     {
    //       path: "pengaturan",
    //       name: "SuperAdminSettings",
    //       component: SuperAdminSettings,
    //     },
    //   ],
    // },
    // {
    //   path: "/kepala-sekolah",
    //   component: HeadMasterLayout,
    //   meta: { requiresAuth: true, role: "kepala_sekolah" },
    //   children: [
    //     {
    //       path: "dashboard",
    //       name: "Dashboard",
    //       component: HeadMasterDashboard,
    //     },
    //     {
    //       path: "kbm",
    //       name: "KBM",
    //       component: HeadmasterKbm,
    //     },
    //     {
    //       path: "partisipasi-guru",
    //       name: "PartisipasiGuru",
    //       component: HeadmasterTeacherParticipian,
    //     },
    //     {
    //       path: "penilaian",
    //       name: "Penilaian",
    //       component: HeadmasterTeacherScore,
    //     },
    //     {
    //       path: "laporan",
    //       name: "Laporan",
    //       component: HeadmasterReport,
    //     },
    //     {
    //       path: "pengumuman",
    //       name: "Pengumuman",
    //       component: HeadmasterAnnouncement,
    //     },
    //   ],
    // },
    // {
    //   path: "/penanggung-jawab",
    //   component: PersonResponsibleLayout,
    //   meta: { requiresAuth: true, role: "penanggung_jawab" },
    //   children: [
    //     {
    //       path: "dashboard",
    //       name: "PenanggungJawabDashboard",
    //       component: PersonResponsibleDashboard,
    //     },
    //     {
    //       path: "kegiatan",
    //       name: "PenanggungJawabActivities",
    //       component: PersonResponsibleActivities,
    //     },
    //     {
    //       path: "absensi",
    //       name: "PenanggungJawabAttendance",
    //       component: PersonResponsibleAttendance,
    //     },
    //   ],
    // },
    // {
    //   path: "/ketua-murid",
    //   component: StudentLayout,
    //   meta: { requiresAuth: true, role: "ketua_murid" },
    //   children: [
    //     {
    //       path: "dashboard",
    //       name: "StudentDashboard",
    //       component: StudentDashboard,
    //     },
    //     {
    //       path: "validasi",
    //       name: "StudentAttendance",
    //       component: StudentAttendance,
    //     },
    //     {
    //       path: "laporan",
    //       name: "StudentReport",
    //       component: StudentReport,
    //     },
    //   ],
    // },
  ],
});

// Route Guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = {};

  try {
    user = userStr ? JSON.parse(userStr) : {};
  } catch (e) {
    // Invalid user data in localStorage, clear it
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // Check if user role matches route requirement
  if (to.meta.role && token && user.role !== to.meta.role) {
    next("/");
    return;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !token) {
    next("/login");
    return;
  }

  // If trying to access login/register page and has valid token, allow access
  // (user can manually logout or go to login page even if already logged in)
  if ((to.path === "/login" || to.path === "/register") && token) {
    // Allow access to login/register pages even if logged in
    next();
    return;
  }

  next();
});

export default router;
