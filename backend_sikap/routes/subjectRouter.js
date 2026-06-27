const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/subjectController');

router.get('/', SubjectController.getAll);
router.get('/:id', SubjectController.getById);
router.post('/', SubjectController.create);
router.put('/:id', SubjectController.update);
router.delete('/:id', SubjectController.remove);

module.exports = router;
