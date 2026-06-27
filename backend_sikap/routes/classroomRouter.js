const express = require('express');
const router = express.Router();
const ClassroomController = require('../controllers/classroomController');

router.get('/', ClassroomController.getAll);
router.get('/:id', ClassroomController.getById);
router.post('/', ClassroomController.create);
router.put('/:id', ClassroomController.update);
router.delete('/:id', ClassroomController.remove);

module.exports = router;
