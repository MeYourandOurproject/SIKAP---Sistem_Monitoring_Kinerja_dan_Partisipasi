const express = require('express');
const router = express.Router();
const Controller = require('../controllers/classteacherattendanceController');

router.get('/', Controller.getAll);
router.get('/:id', Controller.getById);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.remove);

module.exports = router;
