const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

router.get('/', ClassController.getAll);
router.get('/:id', ClassController.getById);
router.post('/', ClassController.create);
router.put('/:id', ClassController.update);
router.delete('/:id', ClassController.remove);

module.exports = router;
