const express = require("express");
const router = express.Router();
const ActivityateacherattendanceController = require("../controllers/activityateacherattendanceController");

router.get("/", ActivityateacherattendanceController.getAll);
router.get("/:id", ActivityateacherattendanceController.getById);
router.post("/", ActivityateacherattendanceController.create);
router.put("/:id", ActivityateacherattendanceController.update);
router.delete("/:id", ActivityateacherattendanceController.delete);

module.exports = router;
