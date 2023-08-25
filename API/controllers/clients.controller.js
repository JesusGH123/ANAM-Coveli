let mysql = require('mysql');
let config = require('../helpers/config');
let connection = mysql.createConnection(config);

module.exports.get_client_home = async(req, res)=>{
    connection.query(
        'CALL get_all_tickets_count_by_status(?);',
        [4],
        (error, all_tickets, fields) => {
            if(error)
                res.send(error);
            connection.query(
                'CALL get_tickets_by_status(?, ?);',
                ['4',req.params.id],
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