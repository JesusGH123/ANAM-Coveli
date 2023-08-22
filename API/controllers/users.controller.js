let mysql = require('mysql');
let config = require('../helpers/config');
let conection = mysql.createConnection(config);

//Get all registered users
module.exports.get_users = async (req, res) => {
    let sql = "";

    conection.query(sql, (error, results, fields) => {
        if(error) {
            res.send(error);
        }
        res.json(results);
    })
}

//Get a single user
module.exports.get_user = (req, res) => {
    
}

//Add a new user
module.exports.add_user = async (req, res) => {

}

//Delete a user
module.exports.delete_user = async (req, res) => {
    
}

//Validate a user
module.exports.validate_user = async (req, res) => {
    
}