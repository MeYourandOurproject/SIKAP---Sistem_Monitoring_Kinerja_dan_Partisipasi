const express = require("express");
const router = express.Router();
const AcademicperiodController = require("../controllers/academicperiodController");
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");

router.get("/", authen, AcademicperiodController.getCurrent);
router.put(
  "/",
  authen,
  authorize("admin"),
  AcademicperiodController.updateCurrent,
);

module.exports = router;
