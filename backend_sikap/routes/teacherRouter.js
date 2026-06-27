const express = require("express");
const router = express.Router();
const TeacherController = require("../controllers/teacherController");
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");

router.get("/", TeacherController.getAll);
router.get("/count", TeacherController.count);
router.get("/:id", TeacherController.getById);
router.post("/", authen, authorize("admin"), TeacherController.create);
router.put("/:id", authen, authorize("admin"), TeacherController.update);
router.delete("/:id", authen, authorize("admin"), TeacherController.delete);

module.exports = router;
