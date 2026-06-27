const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const SubjectController = require('../controllers/subjectController');

router.use(authMiddleware);
router.get('/', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid']), SubjectController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru', 'ketua_murid']), SubjectController.getById);
router.post('/', roleMiddleware(['super_admin', 'kepala_sekolah']), SubjectController.create);
router.put('/:id', roleMiddleware(['super_admin', 'kepala_sekolah']), SubjectController.update);
router.delete('/:id', roleMiddleware(['super_admin']), SubjectController.delete);

module.exports = router;
