const express = require("express");
const router = express.Router();
const ActivitysessionController = require("../controllers/activitysessionController");
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");

// Sesi Aktif Hari Ini (untuk dropdown/pilihan di FE)
router.get("/active", ActivitysessionController.getActiveSessions);
router.get(
  "/teacher",
  authen,
  authorize("teacher"),
  ActivitysessionController.getForCurrentTeacher,
);
router.post("/open", ActivitysessionController.openOrCreateTodaySession);
router.get(
  "/attendance-history",
  authen,
  authorize("responsible"),
  ActivitysessionController.getAttendanceHistory,
);
router.get(
  "/cancellations/today",
  authen,
  authorize("responsible"),
  ActivitysessionController.getTodayCancellations,
);
router.post(
  "/cancellations",
  authen,
  authorize("responsible"),
  ActivitysessionController.cancelRoutineActivity,
);
router.delete(
  "/cancellations/:id",
  authen,
  authorize("responsible"),
  ActivitysessionController.restoreRoutineActivity,
);

// Endpoint Absensi Sesi
// Ambil lembar absensi
router.get("/:id/attendances", ActivitysessionController.getAttendances);

// Simpan absensi
router.post("/:id/attendances", ActivitysessionController.saveAttendances);

// CRUD Standard
router.get("/", ActivitysessionController.getAll);
router.get("/:id", ActivitysessionController.getById);
router.post("/", ActivitysessionController.create);
router.put("/:id", ActivitysessionController.update);
router.delete("/:id", ActivitysessionController.delete);

module.exports = router;
