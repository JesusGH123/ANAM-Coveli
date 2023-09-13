let mysql = require('mysql');
let config = require('../helpers/config');
let connection = mysql.createConnection(config);

module.exports.get_technical_home = async (req, res) => {
    connection.query(
      'CALL get_all_tickets_count_by_status(?, ?)',
      ["5", req.params.userId],
      (error, non_attended_tickets, fields) => {
        if(error)
          res.send(error);
        connection.query(
          'CALL get_all_tickets_count_by_status(?, ?)',        
          ["6", req.params.userId],
          (error, paused_tickets, fields) => {
            if(error)
              res.send(error);
            connection.query(
              'CALL get_all_tickets_count_by_status(?, ?)',
              ["9", req.params.userId],            
              (error, closed_tickets, fields) => {
                if(error)
                  res.send(error)
                connection.query(
                  'CALL get_all_tickets_count_by_status(?, ?)',
                  ["7", req.params.userId],                
                  (error, on_revision_tickets, fields) => {
                    if(error)
                      res.send(error);
                    connection.query(
                      'CALL get_tickets_by_status(?,?)',
                      ["5,6,7,9", req.params.userId],
                      (error, my_tickets, fields) => {
                        if(error)
                          res.send(error);
  
                        try {
                          res.json({
                            'tickets_without_attendance': non_attended_tickets[0][0]["count"],
                            'paused_tickets': paused_tickets[0][0]["count"],
                            'closed_tickets': closed_tickets[0][0]["count"],
                            'on_revision_tickets': on_revision_tickets[0][0]["count"],
                            'my_tickets': my_tickets[0]
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


module.exports.update_ticket = async (req, res) => {        
    connection.query(
        "call update_ticket(?, ?, ?, ?, ?, 0, @p_ticketHistoryID, @p_result, @p_message); select @p_ticketHistoryID, @p_result, @p_message;",
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

            res.status(1);
        }     
    });
}