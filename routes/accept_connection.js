var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.body.match_username)
        res.redirect('/login');
    else{
        let { session } = req;
        
        let sql = 'UPDATE connections SET accepted = 1 WHERE username = ? AND connected_to = ?';
        connection.query(sql, [req.body.match_username, session.user], (err) => 
        {
            if (err) console.log(err)
            else
            {
                sql = 'SELECT COUNT(*) AS likes FROM connections WHERE connected_to = ? AND accepted = 1';
                
                connection.query(sql, [session.user], (err, result) => {
                    if (err) console.log(err)
                    else
                    {
                        sql = 'UPDATE users SET fame_rating = ? WHERE username = ?';
                        
                        connection.query(sql, [result[0].likes, session.user], (err) => {
                            if (err) console.log(err)
                        });

                        sql = 'UPDATE users SET fame_rating = ? WHERE username = ?';
                        
                        connection.query(sql, [result[0].likes, req.body.match_username], (err) => {
                            if (err) console.log(err)
                            else  res.redirect('/connection_requests');
                        })
                    }
                })
            }
        });
    }
});

module.exports = router;