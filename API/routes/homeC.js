let express = require('express');
let router = express.Router();

let clientController = require('../controllers/clients.controller');

router.post('/getClientHome', clientController.get_client_home);


module.exports = router;