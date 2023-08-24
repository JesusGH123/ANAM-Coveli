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
        res.send(results[0]);
    });
}

//Get a single user
module.exports.get_user = (req, res) => {
    connection.query(
        "call get_user(?);",
        req.body.email,
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }
        res.send(results[0]);
    });
}

//Add a new user
module.exports.add_user = async (req, res, rows) => {
    connection.query(
        "call add_user(?, ?, ?, ?, @p_result, @p_message); select @p_message, @p_result;",
        [
            req.body.p_fullname,
            req.body.p_email,
            req.body.p_password,
            req.body.p_roleid
        ],
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }

        res.send(results[1][0]);
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
        res.send(results[1][0]);
    });
}

//Validate a user
module.exports.validate_user = async (req, res) => {
    connection.query(
        `set @p_email = ?;
        call validate_user(@p_email, ?, @p_roleid, @p_fullname, @p_userid, @p_result, @p_message);
        select @p_roleid, @p_fullname, @p_userid, @p_result, @p_message;`,
        [
            req.body.email,
            req.body.password
        ],
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }
        console.log(results[2][0]);
        res.send(results[2][0]);
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
            res.send(results[0]);
        }
    )
}