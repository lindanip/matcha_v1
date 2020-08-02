var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var nodemailer = require('nodemailer')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


router.post('/', (req, res) => {
    if (req.body.match_username) {
        var room_id = Math.floor((Math.random() * 10000) + 1);
        connection.query('INSERT INTO connections  (`username`, `connected_to`, `room_id`) VALUES (?, ?, ?)', [req.session.user, req.body.match_username, room_id], (err) => {
            if (err) console.log(err)
            else
            {
                console.log('Inserted into connections');
                req.session.message = "User added to connections";
                
                res.redirect('/match_full_info');
            }
        })  
    }
    else
        res.redirect('/match_full_info')
})
module.exports = router;