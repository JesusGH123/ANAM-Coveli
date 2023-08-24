let express = require('express');
let router = express.Router();

let userController = require('../controllers/users.controller.js');

router.get('/', userController.get_users);
router.post('/addUser', userController.add_user);
router.put('/user', userController.update_status_user);
router.post('/user/', userController.get_user);
router.post('/user/validate', userController.validate_user);

module.exports = router;