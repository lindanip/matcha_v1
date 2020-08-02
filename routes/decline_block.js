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
    if (req.body.blocker_username) {
        connection.query('DELETE FROM blocks WHERE username = ? AND block_who = ?', [req.body.blocker_username, req.body.blockee_username], (err) => {
            if (err) console.log(err)
            else
            {
                console.log('deleted from connections');
                req.session.message = "User deleted from connections";
                res.redirect('/block_requests');
            }
        })  
    }
    else
        res.redirect('/block_requests')
})
module.exports = router;