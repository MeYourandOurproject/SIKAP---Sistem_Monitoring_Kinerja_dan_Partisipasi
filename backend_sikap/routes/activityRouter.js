const express = require("express");
const router = express.Router();
const ActivityController = require("../controllers/activityController.js");

router.get("/", ActivityController.getAll);
router.get("/:id", ActivityController.getById);
router.post("/tentative", ActivityController.createTentative);
router.post("/routine", ActivityController.createRoutine);
router.put("/:id", ActivityController.update);
router.delete("/:id", ActivityController.delete);

module.exports = router;
