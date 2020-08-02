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
    if (req.body.match_username) {
        connection.query('UPDATE connections SET accepted = 1 WHERE username = ? AND connected_to = ?', [req.body.match_username, req.session.user], (err) => {
            if (err) console.log(err)
            else
            {
                console.log(req.body.match_room_id);
                console.log('Updated connections');
                req.session.message = "Connection succesfuly accepted";
                connection.query('INSERT INTO connections  (`username`, `connected_to`, `accepted`, `room_id`) VALUES (?, ?, 1, ?)', [req.session.user, req.body.match_username, req.body.match_room_id], (err1) => {
                    if (err1) console.log(err1)
                    else
                    {
                        console.log('Inserted into connections');
                        req.session.message = "User added to connections";
                        connection.query('SELECT COUNT(*) AS likes FROM connections WHERE connected_to = ? AND accepted = 1', [req.session.user], (err, result) => {
                            if (err) console.log(err)
                            else
                            {
                                connection.query('UPDATE users SET fame_rating = ? WHERE username = ?', [result[0].likes, req.session.user], (err) => {
                                    if (err) console.log(err)
                                    else
                                        console.log("fame_rating updated");
                                })
                                connection.query('UPDATE users SET fame_rating = ? WHERE username = ?', [result[0].likes, req.body.match_username], (err) => {
                                    if (err) console.log(err)
                                    else
                                        console.log("match fame_rating updated");
                                })
                            }
                        })
                        
                        res.redirect('/connection_requests');
                    }
                })  
            }
        })  
    }
    else
        res.redirect('/connection_requests')
})
module.exports = router;