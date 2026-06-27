const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");

const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");

router.get("/", UserController.getAll);
router.get("/:id", authen, authorize("admin"), UserController.getById);
router.put("/:id", authen, authorize("admin"), UserController.update);
router.delete("/:id", authen, authorize("admin"), UserController.delete);

module.exports = router;
