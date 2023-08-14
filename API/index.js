const express = require('express');
const app = express();
const port = 3000;

let login = require('./routes/login');
let home = require('./routes/home');

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})

//Routes
app.use('/', login);
app.use('/home', home)