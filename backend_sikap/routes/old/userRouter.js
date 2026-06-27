const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const UserController = require('../controllers/userController');

router.use(authMiddleware);
router.get('/roles/list', roleMiddleware(['super_admin']), UserController.listRoles);
router.get('/', roleMiddleware(['super_admin']), UserController.getAll);
// router.get('/', UserController.getAll);
router.get('/:id', roleMiddleware(['super_admin']), UserController.getById);
router.post('/', roleMiddleware(['super_admin']), UserController.create);
router.put('/:id', roleMiddleware(['super_admin']), UserController.update);
router.delete('/:id', roleMiddleware(['super_admin']), UserController.delete);

module.exports = router;
