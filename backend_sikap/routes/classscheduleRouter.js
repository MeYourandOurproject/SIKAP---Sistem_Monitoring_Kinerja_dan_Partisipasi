const express = require('express');
const router = express.Router();
const ClassscheduleController = require('../controllers/classscheduleController');

router.get('/', ClassscheduleController.getAll);
router.get('/current', ClassscheduleController.getCurrent);
router.get('/:id', ClassscheduleController.getById);
router.post('/', ClassscheduleController.create);
router.put('/:id', ClassscheduleController.update);
router.delete('/:id', ClassscheduleController.remove);

module.exports = router;
