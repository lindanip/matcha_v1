const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const session = require('express-session');
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if  (!req.body.match_username)
        res.redirect('/match_full_info');
    else{
        let sql = 'INSERT INTO connections  (`username`, `connected_to`, `accepted`) VALUES (?, ?, ?)';
        connection.query(sql, [req.session.user, req.body.match_username, 0], (err) => {
            if (err) console.log(err)
            else res.redirect('/match_full_info');
        });  
    }
})

module.exports = router;
