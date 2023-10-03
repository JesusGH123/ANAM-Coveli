let crypto = require('node:crypto')
let mysql = require('mysql');
let config = require('../helpers/config');
const { FRONTEND_URL } = require('../constants');
const nodemailer = require('nodemailer');

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

        const token = crypto.randomBytes(20).toString('hex');

        connection.query(
            'CALL create_forgot_password_token(?, ?)',
            [req.body.email, token],
            (error, results, fields) => {
                if(error)
                    res.send(error);
                else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 587,
                        secureConnection: false,
                        auth: {
                            user: 'soporteanam@gmail.com',
                            pass: 'qbhp txbp ejsi vxzr',
                        }
                    })

                    const mailOptions = {
                        from: 'soporteanam@gmail.com',
                        to: `${req.body.p_email}`,
                        subject: 'Generación de nuevo usuario',
                        text:  'Se ha creado su cuenta de manera exitosa\n'
                        + 'De click en el siguiente enlace para establecer su contraseña y poder iniciar sesión: \n\n'
                        + `\n\n`,
                        html: `
                        <img src='https://cdn.axxonsoft.com/storage/technology/ltp_global_software/hsmGUN1CrWBaFSdJBvNpauo5NeMnuyhgEKxOmtrP.png' alt='Ltp logo' width="150px">
                        
                        <h2>Generación de nuevo usuario</h2>
                        <p>Se ha creado su cuenta de manera exitosa</p>
                        <p>De click en el siguiente enlace para establecer su nueva contraseña para iniciar sesión </p> <a href="${FRONTEND_URL}/reset/${token}">Cambiar contraseña</a>
                        `
                    }

                    transporter.sendMail(mailOptions, (err, response) => {
                        if(err)
                            console.error("There was an errror: " + err);
                        else
                            res.send("Email sent");
                    })
                }
            }
        )
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
            if(error){                
                res.send(error);
            }                
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

//Forgot password
module.exports.forgot_password = async(req, res) => {
    connection.query(
        "CALL get_user_by_email(?);",
        req.body.email,
        (error, results, fields) => {
            if(error)
                res.send(error);
            if(results[0].length == 0)
                res.json(-1);
            else {
                const token = crypto.randomBytes(20).toString('hex');

                connection.query(
                    'CALL create_forgot_password_token(?, ?)',
                    [req.body.email, token],
                    (error, results, fields) => {
                        if(error)
                            res.send(error);
                        else {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                port: 587,
                                secureConnection: false,
                                auth: {
                                    user: 'soporteanam@gmail.com',
                                    pass: 'qbhp txbp ejsi vxzr',
                                }
                            })

                            const mailOptions = {
                                from: 'soporteanam@gmail.com',
                                to: `${req.body.email}`,
                                subject: 'Reestablecimiento de contraseña',
                                html: `
                                <img src='https://cdn.axxonsoft.com/storage/technology/ltp_global_software/hsmGUN1CrWBaFSdJBvNpauo5NeMnuyhgEKxOmtrP.png' alt='Ltp logo' width="150px">
                                
                                <h2>Reestablecimiento de contraseña</h2>
                                <p>Esta recibiendo este correo porque alguien ha solicitado el reestablecimiento de su contraseña.</p>
                                <p>De click en el siguiente enlace para completar el proceso: </p> <a href="${FRONTEND_URL}/reset/${token}">Reestablecer contraseña</a>

                                <p><i>Si usted no ha solicitado el cambio de contraseña, haga caso omiso a este correo</i></p>
                                `
                            }

                            transporter.sendMail(mailOptions, (err, response) => {
                                if(err)
                                    console.error("There was an errror: " + err);
                                else
                                    res.json(1);
                            })
                        }
                    }
                )
            }
        }
    )
}

//Check if a token is valid
module.exports.check_token = async(req, res) => {
    connection.query(
        "CALL validate_forgot_token(?)",
        req.params.token,
        (error, results, fields) => {
            if(error)
                res.send(error);
            else {

                res.json(results[0][0]['keyExists']);
            }
        }
    )
}

//Reset password
module.exports.reset_password = async (req, res) => {
    let hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex').toString();
    connection.query(
        "CALL update_user_password(?, ?);",
        [req.body.token, hashedPassword],
        (error, results, fields) => {
            if(error)
                res.send(error);
        }
    )
}

//Check privileges
module.exports.check_privilege = async (req, res) => {
    connection.query(
        "CALL access_by_user(?, ?)",
        [req.body.userId, req.body.nextPath],
        (error, results, fields) => {
            if(error)
                console.log(error);

            if(results == null)
                res.json(results[0][0]["result"]);
            else
                res.json("null")
        }
    )
}

//Write event in log
module.exports.write_log = async (req, res) => {
    connection.query(
        "CALL write_event(?, ?)",
        [req.body.userId, req.body.message],
        (error, results, fields) => {            
            if(error)
                console.log(error);
            res.json("ok");
        }
    )
}
