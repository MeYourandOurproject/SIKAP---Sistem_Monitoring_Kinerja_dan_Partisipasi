const express = require("express");
const router = express.Router();
const ClassscheduleController = require("../controllers/classscheduleController");
const authen = require("../middlewares/authenticationHandler");

router.get("/", ClassscheduleController.getAll);
router.get("/today", authen, ClassscheduleController.getTodaySchedules);
router.get("/current", authen, ClassscheduleController.getCurrent);
router.get("/:id", ClassscheduleController.getById);
router.post("/", authen, ClassscheduleController.create);
router.put("/:id", authen, ClassscheduleController.update);
router.delete("/:id", authen, ClassscheduleController.remove);

module.exports = router;
