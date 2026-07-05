const express = require('express');
const router = express.Router();
const authen = require('../middlewares/authenticationHandler');
const Controller = require('../controllers/classteacherattendanceController');

router.get('/', Controller.getAll);
router.get('/:id', Controller.getById);
router.post('/', authen, Controller.create);
router.put('/:id', authen, Controller.update);
router.delete('/:id', authen, Controller.remove);

module.exports = router;
