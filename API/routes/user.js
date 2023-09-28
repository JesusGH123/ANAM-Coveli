let express = require('express');
let router = express.Router();

let userController = require('../controllers/users.controller.js');

router.get('/', userController.get_users);
router.post('/addUser', userController.add_user);
router.put('/updateUser', userController.update_status_user);
router.get('/user/:id', userController.get_user);
router.post('/userValidate', userController.validate_user);
router.post('/user/getViews', userController.get_accesible_views);

router.post('/checkPermissions', userController.check_privilege);
router.post('/forgotPassword', userController.forgot_password);
router.get('/validateToken/:token', userController.check_token);
router.put('/updatePassword', userController.reset_password);

router.get('/roles', userController.get_roles);

router.post('/event', userController.write_log);

module.exports = router;