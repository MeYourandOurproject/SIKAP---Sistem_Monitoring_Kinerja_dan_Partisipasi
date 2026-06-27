const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const AttendanceController = require('../controllers/attendanceController');

router.use(authMiddleware);
router.get('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid', 'penanggung_jawab']), AttendanceController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid', 'penanggung_jawab']), AttendanceController.getById);
router.post('/', roleMiddleware(['ketua_murid', 'penanggung_jawab']), AttendanceController.create);

module.exports = router;
