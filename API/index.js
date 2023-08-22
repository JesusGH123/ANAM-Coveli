let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors')

let port = 3001;

let login = require('./routes/login');
let home = require('./routes/home');
let users = require('./routes/user');

app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})

//Routes
app.use('/', login);
app.use('/home', home);
app.use('/users', users);