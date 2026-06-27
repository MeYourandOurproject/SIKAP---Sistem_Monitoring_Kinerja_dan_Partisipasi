const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const ParticipationController = require('../controllers/participationController');

// router.use(authMiddleware);
router.get('/', ParticipationController.getAll);
router.get('/:id', roleMiddleware(['super_admin', 'kepala_sekolah', 'wakasek', 'guru']), ParticipationController.getById);
router.post('/', roleMiddleware(['kepala_sekolah', 'wakasek']), ParticipationController.create);

module.exports = router;
