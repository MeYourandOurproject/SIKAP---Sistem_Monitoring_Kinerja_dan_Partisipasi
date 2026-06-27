const express = require('express');
const router = express.Router();
const TimeslotController = require('../controllers/timeslotController');

router.get('/', TimeslotController.getAll);
router.get('/:id', TimeslotController.getById);
router.post('/', TimeslotController.create);
router.put('/:id', TimeslotController.update);
router.delete('/:id', TimeslotController.remove);

module.exports = router;
