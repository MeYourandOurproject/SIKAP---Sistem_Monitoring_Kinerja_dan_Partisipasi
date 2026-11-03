const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController");
const authen = require("../middlewares/authenticationHandler");
const authorize = require("../middlewares/authorizationHandler");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (/\.xlsx$/i.test(file.originalname)) return callback(null, true);
    callback(new Error("Format file harus .xlsx"));
  },
});

function handleFileUpload(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();
    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Ukuran file maksimal 5 MB"
        : error.message;
    res.status(400).json({ message });
  });
}

router.use(authen, authorize("admin"));
router.get("/import-template", StudentController.downloadImportTemplate);
router.post("/import", handleFileUpload, StudentController.import);
router.get("/", StudentController.getAll);
router.get("/:id", StudentController.getById);
router.post("/", StudentController.create);
router.put("/:id", StudentController.update);
router.delete("/:id", StudentController.remove);

module.exports = router;
