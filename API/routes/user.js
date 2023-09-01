let express = require('express');
let router = express.Router();

let userController = require('../controllers/users.controller.js');

router.get('/', userController.get_users);
router.post('/addUser', userController.add_user);
router.put('/user', userController.update_status_user);
router.get('/user/:id', userController.get_user);
router.post('/userValidate', userController.validate_user);
router.post('/user/getViews', userController.get_accesible_views);

router.get('/roles', userController.get_roles);

module.exports = router;