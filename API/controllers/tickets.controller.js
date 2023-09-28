let mysql = require('mysql');
let config = require('../helpers/config');
let connection = mysql.createConnection(config);

module.exports.get_supervisor_home = async(req, res) => {  
  connection.query(
    'CALL get_all_tickets_count',
    (error, all_tickets, fields) => {
    if(error)
      res.send(error);
    connection.query(
      'CALL todays_tickets',
      (error, todays_tickets, fields) => {
      if(error)
        res.send(error);
      connection.query(
        'CALL out_of_time_tickets',
        (error, out_of_time_tickets, fields) => {
        if(error)
          res.send(error);
          connection.query(
            'CALL get_tickets_stats',
            (error, tickets_stats, fields) => {
                if(error)
                  res.send(error)
                connection.query(
                  'CALL get_graph(?); CALL get_graph(?);',
                  ['Monthly', 'Weekly'],
                  (error, graph_data, fields) => {
                    if(error)
                      res.send(error);
                    connection.query(
                      'CALL get_tickets_by_status(?, ?); CALL get_tickets_by_status(?, ?);',
                      ['7', 0, '4,5,6,8,9,11', 0],
                      (error, tickets, fields) => {
                        if(error)
                          res.send(error);

                        try {
                          res.json({
                            'all_tickets': all_tickets[0][0]["count"],
                            'todays_tickets': todays_tickets[0][0]["count"],
                            'out_of_time_tickets': out_of_time_tickets[0][0]['count'],
                            'avg_time_for_tickets': {
                              'high_prior': tickets_stats[0][0] == null ? "0h 0m" :tickets_stats[0][0],
                              "medium_prior": tickets_stats[0][1] == null ? "0h 0m" :tickets_stats[0][1],
                              "low_prior": tickets_stats[0][2] == null ? "0h 0m" :tickets_stats[0][2]
                            },
                            'graphic_data': {
                              'monthly': graph_data[0],
                              'weekly': graph_data[2]
                              },
                            'tickets': {
                              'first_section': tickets[0],
                              'second_section': tickets[2],
                            }
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
      })
  });
}

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

module.exports.get_client_home = async (req, res) => {}

module.exports.get_admin_home = async (req, res) => {
  connection.query(
    'CALL get_all_tickets_count();',
    (error, all_tickets_count, fields) => {
      if(error)
        res.send(error);
      connection.query(
        'CALL get_all_tickets_count_by_status(4,0);',
        (error, not_assigned_tickets, fields) => {
          if(error)
            res.send(error);
          connection.query(
            'CALL get_all_tickets_count_by_status(5,0);',
            (error, assigned_tickets, fields) => {
              if(error)
                res.send(error);
              connection.query(
                'CALL get_all_tickets_count_by_status(6,0);',
                (error, paused_tickets, fields) => {
                  if(error)
                    res.send(error);
                    connection.query(
                      'CALL get_all_tickets_count_by_status(9,0);',
                      (error, closed_tickets, fields) => {
                        if(error)
                          res.send(error);
                          connection.query(
                            "CALL get_tickets_by_status('4,5,6,7,8,9,10', 0);",
                            (error, all_tickets, fields) => {
                              if(error)
                                res.send(error);
                              
                              try {
                                res.json({
                                  'all_tickets_count': all_tickets_count[0][0]["count"],
                                  'not_assigned_tickets_count': not_assigned_tickets[0][0]["count"],
                                  'assigned_tickets_count': assigned_tickets[0][0]["count"],
                                  'paused_tickets_count': paused_tickets[0][0]["count"],
                                  'closed_tickets_count': closed_tickets[0][0]["count"],
                                  'all_tickets': all_tickets[0]
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

module.exports.get_monitor_home = async (req, res) => {}

//Get a single ticket
module.exports.get_ticket = async (req, res) => {}

//Add a ticket
module.exports.add_ticket = async (req, res) => {}

//Change status of a ticket
module.exports.update_ticket = (req, res) => {
  
  connection.query(
    "call update_ticket(?, ?, ?, ?, ?, 0, 0, @p_ticketHistoryID, @p_result, @p_message); select @p_ticketHistoryID, @p_result, @p_message;",
    [
      req.body.userId,
      req.body.ticketId,
      req.body.statusId,
      req.body.comment,
      req.body.technicalId,
    ],
    (error, results, fields) => {
      if(error){
        res.send(error);        
      }        

      try {        
        res.send(results[1][0]);
    } catch (error) {
        console.log(error);
    }
    }
  );
}



module.exports.get_ticket_evidences = async(req, res)=>{
connection.query(    
    'call db_coveli.get_evindeces(?);',        
    req.params.id,
    (error, evidences, fields) => {                        
      
      if(error)
        res.send(error);                                                                             
      try {
          res.json({              
              'evidences': evidences[0]
          });
      } catch (error) {        
          console.log(error);
      } 
    }
  )
}


module.exports.get_maintenance_report = async(req, res)=>{
  connection.query(    
      'call db_coveli.get_maintenance_report(?);',        
      req.params.id,
      (error, reporte, fields) => {
        if(error)
          res.send(error);                                                                             
        try {
            res.json({              
                'reporte_mantenimiento': reporte[0]
            });
        } catch (error) {        
            console.log(error);
        } 
      }
    )
  }

  module.exports.post_report_maintenance_sumary = async(req, res)=>{    
    connection.query(    
        'call db_coveli.get_tickets_by_date(?,?,?);',
        [
          req.body.status,
          req.body.startDate,
          req.body.finishDate
        ],                
        (error, reporte, fields) => {
          if(error)
            res.send(error);                                                                             
          try {              
              res.json({              
                  'resumen_reporte_mantenimiento': reporte[0]
              });
          } catch (error) {        
              console.log(error);
          } 
        }
      )
    }