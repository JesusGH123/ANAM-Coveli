let mysql = require('mysql');
let config = require('../helpers/config');
const { query } = require('express');
let connection = mysql.createConnection(config);

module.exports.get_monitorist_home = async(req, res)=>{
    connection.query(
        "CALL get_tickets_by_status('4',0);",                
        (error, recent_tickets, fields) => {                        
            if(error)
                res.send(error);
            connection.query(
                "CALL get_tickets_by_status('8',0);",                
                (error, reassigned_tickets, fields) => {                    
                    if(error)                    
                        res.send(error);
                    connection.query(
                        "CALL get_priorities();",                
                        (error, priorities, fields) => {                    
                            if(error)
                                res.send(error);
                            connection.query(
                                "CALL get_users_by_rol(3);",                
                                (error, technicals, fields) => {                    
                                    if(error)
                                        res.send(error);                
                                    try {
                                        res.json({
                                            'recent_tickets': recent_tickets[0],
                                            'reassigned_tickets': reassigned_tickets[0],
                                            'priorities': priorities[0],
                                            'technicals': technicals[0]
                                        });
                                    } catch(error) {
                                        console.log(error);
                                    }
                                }                
                            )
                        }                
                    )
                }                
            )            
        }
    )
}

module.exports.get_priorities_home = async(req, res) => {
    connection.query(
        "CALL get_priorities();",
        (error, priorities, fields) => {
            if(error)
                res.send(error);

            try {
                res.json({                     
                    'priorities': priorities[0]
                });
            } catch(error) {
                console.log(error);
            }
        }                                
    )    
}

module.exports.get_techinicals_home = async(req, res) => {
    connection.query(
        "CALL get_users_by_rol(3);",
        (error, technicals, fields) => {
            if(error)
                res.send(error);

            try {
                res.json({                
                    'technicals': technicals[0]
                });
            } catch(error) {
                console.log(error);
            }
        }                                
    )                            
}


module.exports.get_dasboard_home = async(req, res)=> {
    connection.query(
        "CALL get_all_tickets_count_by_status('5',0);",
        (error, assigned, fields) => {                        
            if(error)
                res.send(error);
            connection.query(
                "CALL get_all_tickets_count_by_status('7',0);",
                req.params.id,
                (error, revision, fields) => {
                    if(error)
                        res.send(error);   
                    connection.query(
                        "CALL get_all_tickets_count_by_status('8',0);",
                        (error, reassigned, fields) => {
                            if(error)
                                res.send(error);   
                            connection.query(
                                "CALL get_all_tickets_count_by_status('4',0);",
                                (error, open, fields) => {
                                    if(error)
                                        res.send(error);   
                                    connection.query(
                                        "CALL get_all_tickets_count_by_status('6',0);",
                                        (error, paused, fields) => {
                                            if(error)
                                                res.send(error);   
                                            connection.query(
                                                "CALL get_all_tickets_count_by_status('9',0);",
                                                (error, closed, fields) => {
                                                    if(error)
                                                        res.send(error);   
                                                    
                                                    try {
                                                        res.json({
                                                            'assigned': assigned[0][0]["count"],
                                                            'revision': revision[0][0]["count"],
                                                            'reassigned': reassigned[0][0]["count"],
                                                            'open': open[0][0]["count"],
                                                            'paused': paused[0][0]["count"],
                                                            'closed': closed[0][0]["count"],
                                                            });
                                                    } catch(error) {
                                                        console.log(error);
                                                    }
                                                }
                                            )
                                        }
                                    )
                                }
                            )
                        }
                    )                                                                         
                 
                        
                }                    
                
            )
            
        }
    )
}

module.exports.update_ticket = async (req, res) => {    
    console.log(req.body);
    connection.query(
        'call update_ticket(?, ?, ?, "", ?, ?, @p_ticketHistoyID, @p_result, @p_message); select @p_ticketHistoyID, @p_result, @p_message;',
        [
            req.body.p_userId,
            req.body.p_ticketId,
            req.body.p_statusId,            
            req.body.p_technicalId,
            req.body.p_priorityId
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