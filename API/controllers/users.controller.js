let crypto = require('node:crypto')
let mysql = require('mysql');
let config = require('../helpers/config');

let connection = mysql.createConnection(config);

//Get all registered users
module.exports.get_users = async (req, res) => {
    connection.query(
        "call get_users;",
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }

        try {
            res.send(results[0]);
        } catch (error) {
            console.log(error);
        }
    });
}

//Get a single user
module.exports.get_user = (req, res) => {
    connection.query(
        "call get_user(?);",
        req.params.id,
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }

        try {
            res.send(results[0][0]);
        } catch(error) {
            console.log(error);
        }
    });
}

//Add a new user
module.exports.add_user = async (req, res, rows) => {
    let hashedPassword = crypto.createHash('sha256').update(req.body.p_password).digest('hex').toString()

    connection.query(
        "call add_user(?, ?, ?, ?, @p_result, @p_message); select @p_message, @p_result;",
        [
            req.body.p_fullname,
            req.body.p_email,
            hashedPassword,
            req.body.p_roleid
        ],
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }

        try {
            res.send(results[1][0]);
        } catch (error) {
            console.log(error);
        }
    });
}

//Delete a user
module.exports.update_status_user = async (req, res) => {
    //Status 1: Activate
    //Status 2: Deactivate
    //Status 3: Remove
    connection.query(
        "call update_status_user(?, ?, @p_result, @p_message); select @p_result, @p_message",
        [
            req.body.p_userid,
            req.body.p_statusid
        ],
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }

        try {
            res.send(results[1][0]);
        } catch(error) {
            console.log(error);
        }
    });
}

//Validate a user
module.exports.validate_user = async (req, res) => {
    let hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex').toString()
    connection.query(
        `set @p_email = ?;
        call validate_user(@p_email, ?, @p_roleid, @p_fullname, @p_userid, @p_result, @p_message);
        select @p_roleid, @p_fullname, @p_userid, @p_result, @p_message;`,
        [
            req.body.email,
            hashedPassword
        ],
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }

        try {
            res.send(results[2][0]);
        } catch (error) {
            console.log(error);
        }
    });
}

//Get my accesible paths
module.exports.get_accesible_views = async (req, res) => {
    connection.query(
        "call get_accesible_views(?);",
        req.body.role,
        (error, results, fields) => {
            if(error)
                res.send(error)
            
            try {
                res.send(results[0]);
            } catch (error) {
                console.log(error);
            }
        }
    )
}

//Get user roles
module.exports.get_roles = async (req, res) => {    
    connection.query(
        "call get_roles();",
        (error, results, fields) => {
            if(error)
                res.send(error);
            
            try {
                res.send(results[0]);
            } catch(error) {
                console.log(error);
            }
        }
    )
}