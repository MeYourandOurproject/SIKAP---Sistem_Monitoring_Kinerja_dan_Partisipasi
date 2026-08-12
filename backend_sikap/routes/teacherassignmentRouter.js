const express = require("express");
const router = express.Router();
const TeacherassignmentController = require("../controllers/teacherassignmentController");

router.get("/", TeacherassignmentController.getAll);
router.get("/:id", TeacherassignmentController.getById);
router.post("/", TeacherassignmentController.create);
router.put("/:id", TeacherassignmentController.update);
router.delete("/:id", TeacherassignmentController.delete);

module.exports = router;
