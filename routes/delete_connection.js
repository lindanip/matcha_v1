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
        connection.query('DELETE FROM connections WHERE username = ? AND connected_to = ?', [req.session.user, req.body.match_username], (err) => {
            if (err) console.log(err)
            else
            {
                console.log('deleted from connections');
                req.session.message = "User deleted from connections";
                connection.query('DELETE FROM connections WHERE username = ? AND connected_to = ?', [req.body.match_username, req.session.user], (err) => {
                    if (err) console.log(err)
                })
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
                res.redirect('/match_full_info');
            }
        })  
    }
    else
        res.redirect('/match_full_info')
})
module.exports = router;