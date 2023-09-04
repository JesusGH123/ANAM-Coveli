let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors')

let port = 3001;

let constants = require('./constants.js');
let login = require('./routes/login');
let home = require('./routes/home');
let users = require('./routes/user');
let clients = require('./routes/homeC');
let monitorist = require('./routes/homeM');

app.use(cors());
app.use(bodyParser.json({limit:'1gb'}));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, 	X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-	Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})

//Routes
app.use('/', login);
app.use('/home', home);
app.use('/users', users);
app.use('/homeC', clients);
app.use('/homeM', monitorist);