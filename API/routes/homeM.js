let express = require('express');
let router = express.Router();

let monitoristController = require('../controllers/monitorists.controller.js');

router.get('/getMonitoristHome', monitoristController.get_monitorist_home);
router.get('/getPrioritiesHome', monitoristController.get_priorities_home);
router.get('/getTechinicalsHome', monitoristController.get_techinicals_home);
router.get('/getDasboardHome', monitoristController.get_dasboard_home);
router.put('/updateTicket', monitoristController.update_ticket);



module.exports = router;