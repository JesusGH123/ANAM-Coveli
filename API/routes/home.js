let express = require('express');
let router = express.Router();

let ticketController = require('../controllers/tickets.controller');

router.get('/', ticketController.get_tickets);
router.get('/ticket/:id', ticketController.get_ticket);
router.post('/ticket', ticketController.add_ticket);
router.delete('/ticket/:id', ticketController.delete_ticket);

router.get('/getSupervisorHome', ticketController.get_supervisor_home);

module.exports = router;