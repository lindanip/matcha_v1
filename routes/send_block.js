const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const session = require('express-session');
//const nodemailer = require('nodemailer');
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.body.reason)
        res.redirect('/match_full_info')
    if (req.body.reason) {
        connection.query('INSERT INTO blocks  (`username`, `block_who`,`reason`,`accepted`) VALUES (?, ?, ?, 0)', [req.session.user, req.body.blocked_user, req.body.reason], (err) => {
            if (err) console.log(err)
            else res.redirect('/');
        });  
    }   
});
module.exports = router;