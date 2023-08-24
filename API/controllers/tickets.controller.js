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
                      'CALL get_tickets_by_status(?); CALL get_tickets_by_status(?);',
                      ['7', '6,8,9'],
                      (error, tickets, fields) => {
                        if(error)
                          res.send(error);
                        res.json({
                          'all_tickets': all_tickets[0][0]["count"],
                          'todays_tickets': todays_tickets[0][0]["count"],
                          'out_of_time_tickets': out_of_time_tickets[0][0]['count'],
                          'avg_time_for_high_prior_ticket': tickets_stats[0],
                          'graphic_data': {
                            'monthly': graph_data[0],
                            'weekly': graph_data[2]
                            },
                          'tickets': {
                            'first_section': tickets[0],
                            'second_section': tickets[2],
                          }
                        });
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

module.exports.get_technical_home = async (req, res) => {}

module.exports.get_client_home = async (req, res) => {}

module.exports.get_admin_home = async (req, res) => {}

module.exports.get_monitor_home = async (req, res) => {}

//Get a single ticket
module.exports.get_ticket = async (req, res) => {}

//Add a ticket
module.exports.add_ticket = async (req, res) => {}

//Change status of a ticket
module.exports.update_ticket = (req, res) => {
}