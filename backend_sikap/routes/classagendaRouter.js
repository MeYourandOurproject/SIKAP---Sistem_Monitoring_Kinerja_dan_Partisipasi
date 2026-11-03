"use strict";

const express = require("express");
const router = express.Router();
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");
const ClassagendaController = require("../controllers/classagendaController");

router.use(authen, authorize("teacher"));
router.get("/schedules/:scheduleId", ClassagendaController.getForSchedule);
router.put("/schedules/:scheduleId", ClassagendaController.saveForSchedule);

module.exports = router;
