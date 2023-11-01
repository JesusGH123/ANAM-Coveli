let express = require('express');
let router = express.Router();

let ticketController = require('../controllers/tickets.controller');

router.put('/ticket', ticketController.update_ticket);
router.get('/getTicketEvidences/:id', ticketController.get_ticket_evidences);
router.get('/getMaintenanceReport/:id', ticketController.get_maintenance_report);
router.post('/getreportMaintenaceSumary/', ticketController.post_report_maintenance_sumary);

router.get('/getSupervisorHome/:userId', ticketController.get_supervisor_home);
router.get('/getTechnicalHome/:userId', ticketController.get_technical_home);
router.get('/getAdminHome/:userId', ticketController.get_admin_home);

router.post('/sendEmail', ticketController.send_confirmation_email);

module.exports = router;