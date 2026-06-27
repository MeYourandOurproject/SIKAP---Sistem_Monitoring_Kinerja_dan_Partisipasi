const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const StudentController = require('../controllers/studentController');

router.use(authMiddleware);
router.get('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek']), StudentController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'ketua_murid']), StudentController.getById);
router.post('/', roleMiddleware(['super_admin', 'kepala_sekolah']), StudentController.create);
router.put('/:id', roleMiddleware(['super_admin', 'kepala_sekolah']), StudentController.update);
router.delete('/:id', roleMiddleware(['super_admin']), StudentController.delete);

module.exports = router;
