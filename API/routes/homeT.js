let express = require('express');
let router = express.Router();

let technicalController = require('../controllers/technicals.controller.js');

router.put('/update_ticket', technicalController.update_ticket);
router.post('/add_evidences', technicalController.add_evidences);
router.get('/getTechnicalHome/:userId', technicalController.get_technical_home);

module.exports = router;