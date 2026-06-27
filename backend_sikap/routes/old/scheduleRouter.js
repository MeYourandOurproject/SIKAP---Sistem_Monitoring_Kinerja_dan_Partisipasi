const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ScheduleController = require('../controllers/scheduleController');

router.use(authMiddleware);
router.get('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid']), ScheduleController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid']), ScheduleController.getById);
router.post('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek']), ScheduleController.create);
router.put('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek']), ScheduleController.update);
router.delete('/:id', roleMiddleware(['super_admin']), ScheduleController.delete);

module.exports = router;
