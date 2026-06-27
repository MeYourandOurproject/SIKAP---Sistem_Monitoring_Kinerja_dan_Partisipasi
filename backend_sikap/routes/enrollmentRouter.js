const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');

router.get('/', EnrollmentController.getAll);
router.get('/:id', EnrollmentController.getById);
router.post('/', EnrollmentController.create);
router.put('/:id', EnrollmentController.update);
router.delete('/:id', EnrollmentController.remove);

module.exports = router;
