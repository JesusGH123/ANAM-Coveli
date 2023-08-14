let express = require('express');
let router = express.Router();

let ticketController = require('../controllers/tickets.controller');

router.get('/', ticketController.all_tickets);

module.exports = router;