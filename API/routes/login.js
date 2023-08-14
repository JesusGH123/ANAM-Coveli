let express = require('express');
let router = express.Router();

router.get('/', (req, res) => { res.send('Login'); });

module.exports = router;