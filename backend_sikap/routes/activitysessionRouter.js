const express = require("express");
const router = express.Router();
const ActivitysessionController = require("../controllers/activitysessionController");

router.get("/", ActivitysessionController.getAll);
router.get("/:id", ActivitysessionController.getById);
router.post("/", ActivitysessionController.create);
router.put("/:id", ActivitysessionController.update);
router.delete("/:id", ActivitysessionController.delete);

module.exports = router;
