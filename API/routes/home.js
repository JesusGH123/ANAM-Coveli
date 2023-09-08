let express = require('express');
let router = express.Router();

let ticketController = require('../controllers/tickets.controller');

router.get('/ticket/:id', ticketController.get_ticket);
router.post('/ticket', ticketController.add_ticket);
router.put('/ticket', ticketController.update_ticket);
router.get('/getTicketEvidences/:id', ticketController.get_ticket_evidences);

router.get('/getSupervisorHome/:userId', ticketController.get_supervisor_home);
router.get('/getTechnicalHome/:userId', ticketController.get_technical_home);
router.get('/getAdminHome/:userId', ticketController.get_admin_home);

module.exports = router;