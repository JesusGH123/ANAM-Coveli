let express = require('express');
let router = express.Router();

let userController = require('../controllers/users.controller.js');

router.get('/', userController.get_users);
router.post('/user', userController.add_user);
router.delete('/user/:id', userController.delete_user);
router.get('/user/:email', userController.get_user);

module.exports = router;