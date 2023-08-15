const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

let login = require('./routes/login');
let home = require('./routes/home');
let users = require('./routes/user');

app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})

//Routes
app.use('/', login);
app.use('/home', home);
app.use('/users', users);