"use strict";

const express = require("express");
const router = express.Router();
const ApplicationClockController = require("../controllers/applicationClockController");
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");

router.get("/", ApplicationClockController.getCurrent);
router.put("/", authen, authorize("admin"), ApplicationClockController.updateCurrent);

module.exports = router;
