const express = require("express");
const router = express.Router();
const ClassscheduleController = require("../controllers/classscheduleController");
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");

router.get("/", ClassscheduleController.getAll);
router.get(
  "/teacher",
  authen,
  authorize("teacher"),
  ClassscheduleController.getForCurrentTeacher,
);
router.get("/today", authen, ClassscheduleController.getTodaySchedules);
router.get("/current", authen, ClassscheduleController.getCurrent);
router.get(
  "/history",
  authen,
  authorize("headmaster", "responsible"),
  ClassscheduleController.getHistory,
);
router.get("/:id", ClassscheduleController.getById);
router.post("/", authen, authorize("admin"), ClassscheduleController.create);
router.put("/:id", authen, authorize("admin"), ClassscheduleController.update);
router.delete("/:id", authen, authorize("admin"), ClassscheduleController.remove);

module.exports = router;
