let express = require('express');
let router = express.Router();

let clientController = require('../controllers/clients.controller.js');

router.get('/getClientHome/:id', clientController.get_client_home);
router.get('/getTicketHistoryHome/:id', clientController.get_ticketHistory_home);
router.get('/get_equipmentsLocations_home/', clientController.get_equipmentsLocations_home);
router.get('/get_equipments_by_Location_home/:id', clientController.get_equipments_by_Location_home);
router.get('/get_serials_by_Location_by_Location_home/:id/:equipmentId', clientController.get_serials_by_Location_home);
router.post('/add_ticket', clientController.add_ticket);
router.post('/add_evidences', clientController.add_evidences);
router.put('/update_ticket', clientController.update_ticket);




module.exports = router;