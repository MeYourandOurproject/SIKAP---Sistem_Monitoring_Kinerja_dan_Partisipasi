const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ActivityController = require('../controllers/activityController');

router.use(authMiddleware);
router.get('/', ActivityController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid', 'penanggung_jawab']), ActivityController.getById);
router.post('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'penanggung_jawab']), ActivityController.create);
router.put('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'penanggung_jawab']), ActivityController.update);
router.delete('/:id', roleMiddleware(['super_admin']), ActivityController.delete);

module.exports = router;
