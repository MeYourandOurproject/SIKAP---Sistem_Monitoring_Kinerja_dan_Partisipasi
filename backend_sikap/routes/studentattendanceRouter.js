"use strict";

const express = require("express");
const router = express.Router();
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");
const StudentattendanceController = require("../controllers/studentattendanceController");

router.use(authen, authorize("teacher"));
router.get("/schedules/:scheduleId", StudentattendanceController.getForSchedule);
router.put("/schedules/:scheduleId", StudentattendanceController.saveForSchedule);

module.exports = router;
