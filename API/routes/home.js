let express = require('express');
let router = express.Router();

let ticketController = require('../controllers/tickets.controller');

router.get('/ticket/:id', ticketController.get_ticket);
router.post('/ticket', ticketController.add_ticket);
router.put('/ticket/:id', ticketController.update_ticket);

router.get('/getSupervisorHome', ticketController.get_supervisor_home);

module.exports = router;