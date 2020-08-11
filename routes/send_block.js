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
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.body.reason)
        res.redirect('/match_full_info')
    else if (req.body.reason) {
        console.log('---------send_block');
        console.log(req.body);
        let sql = 'INSERT INTO blocks  (`username`, `block_who`,`reason`,`accepted`) VALUES (?, ?, ?, 0)';

        connection.query(sql, [req.session.user, req.body.blocked_user, req.body.reason], (err) => {
            if (err) console.log(err)
            else res.redirect('/');
        });  
    }else {
        res.redirect('/login');
    }
});
module.exports = router;