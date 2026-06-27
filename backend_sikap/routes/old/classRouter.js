const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ClassController = require('../controllers/classController');

router.use(authMiddleware);
router.get('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid']), ClassController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid']), ClassController.getById);
router.post('/', roleMiddleware(['super_admin', 'kepala_sekolah']), ClassController.create);
router.put('/:id', roleMiddleware(['super_admin', 'kepala_sekolah']), ClassController.update);
router.delete('/:id', roleMiddleware(['super_admin']), ClassController.delete);

module.exports = router;
