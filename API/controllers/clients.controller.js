let mysql = require('mysql');
let config = require('../helpers/config');
let connection = mysql.createConnection(config);


module.exports.get_client_home = async(req, res)=>{
    connection.query(
        "CALL get_all_tickets_count_by_status('4,5,6,7,8,9,10',?);",        
        req.params.id,
        (error, all_tickets, fields) => {                        
            if(error)
                res.send(error);
            connection.query(
                "CALL get_tickets_by_status('4,5,6,7,8,9,10', ?);",
                req.params.id,
                (error, tickets, fields) => {                    
                    if(error)
                        res.send(error);                                                                            
                 
                        res.json({
                            'all_tickets': all_tickets[0][0]["count"],                        
                            'tickets': tickets[0]
                            });
                }                    
                
            )
            
        }
    )
}

module.exports.get_ticketHistory_home = async(req, res) => {
    connection.query("CALL get_ticketHistory(?);",
        req.params.id,
        (error, ticketsHistory, fields) => {
            if(error)
                res.send(error);
            res.json({'ticketsHistory' : ticketsHistory[0]});
        }
    )
}


module.exports.get_equipmentsLocations_home = async(req, res) => {
    connection.query("CALL get_equipmentsLocations();",        
        (error, locations, fields) => {
            if(error)
                res.send(error);
            res.json({'locations' : locations[0]});
        }
    )
}

module.exports.get_equipments_by_Location_home = async(req, res) => {
    connection.query("CALL get_equipments_by_Location(?);",
        req.params.id,
        (error, equipments, fields) => {
            if(error)
                res.send(error);
            res.json({'equipments' : equipments[0]});
        }
    )
}

module.exports.get_serials_by_Location_home = async(req, res) => {
    connection.query("CALL get_serials_by_Location(?,?);",
        [req.params.id,req.params.equipmentId],
        (error, serials, fields) => {            
            if(error)
                res.send(error);
            res.json({'serials' : serials[0]});
        }
    )
}

module.exports.add_ticket = async (req, res, rows) => {
    connection.query(
        "call add_ticket(?, ?, ?, ?, ?, ?, ?,@p_ticketHistoyID, @p_result, @p_message); select @p_ticketHistoyID, @p_message, @p_result;",
        [
            req.body.p_categoryId,
            req.body.p_equipmentLocationId,
            req.body.p_equipmentModelId,
            req.body.p_equipmentSerialId,            
            req.body.p_situation,
            req.body.p_comment,
            req.body.p_userid
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


module.exports.add_evidences = async (req, res, rows) => {
    connection.query(
        "call add_evidences(?, ?);",
        [
            req.body.p_ticketHistoryId,
            req.body.p_evidencia
        ],
        (error, results, fields) => {
        if(error) {
            res.send(error);
        }        
    });
}


module.exports.update_ticket = async (req, res) => {    
    connection.query(
        "call update_ticket2(?, ?, ?, ?, ?, 0, @p_ticketHistoyID, @p_result, @p_message); select @p_ticketHistoyID, @p_result, @p_message;",
        [
            req.body.p_userId,
            req.body.p_ticketId,
            req.body.p_statusId,
            req.body.p_comment,
            req.body.p_technicalId
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




