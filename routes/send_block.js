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
    if (req.body.reason) {
        connection.query('INSERT INTO blocks  (`username`, `block_who`,`reason`,`accepted`) VALUES (?, ?, ?, 0)', [req.session.user, req.body.blocked_user, req.body.reason], (err) => {
            if (err) console.log(err)
            else
            {
                console.log("Entered block user loop");
                console.log('Inserted into blocked users');
                req.session.message = "Block request sent";
                
                res.redirect('/');
            }
        })  
    }
    else
        res.redirect('/match_full_info')
})
module.exports = router;