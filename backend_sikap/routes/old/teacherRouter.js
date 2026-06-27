const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const TeacherController = require('../controllers/teacherController');

// router.use(authMiddleware);
// router.get('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek']), TeacherController.getAll);
router.get('/', TeacherController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru']), TeacherController.getById);
router.post('/', roleMiddleware(['super_admin', 'kepala_sekolah']), TeacherController.create);
router.put('/:id', roleMiddleware(['super_admin', 'kepala_sekolah']), TeacherController.update);
router.delete('/:id', roleMiddleware(['super_admin']), TeacherController.delete);

module.exports = router;
