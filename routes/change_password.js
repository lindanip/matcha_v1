const express = require('express')
const router = express.Router()
const connection = require('../config/db')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.body.email)
        res.render('change_password', {msg: 'none', error: 'missing email field, unauthorized'});
    else if (!req.body.password || !req.body.vPassword)
        res.render('change_password', {msg: 'none', error: 'missing fields'});
    else if (req.body.password != req.body.vPassword)
        res.render('change_password', {error: 'Passwords do not match'});
    else if (req.body.password.length < 8)
        res.render('change_password', {error: 'Password must contain 8 or more characters'});
    else if (req.body.password.search(/\d/) == -1)
        res.render('change_password', {error: 'Password must contain atleast 1 number'});
    else if (req.body.password.search(/[a-z]/) == -1)
        res.render('change_password', {error: 'Password must contain atleast 1 small letter'});
    else if (req.body.password.search(/[A-Z]/) == -1)
        res.render('change_password', {error: 'Password must contain atleast 1 capital letter'});
    else
    {
        let hash = bcrypt.hashSync(req.body.password, 12);

        connection.query('UPDATE users SET Password = ? WHERE Email = ?',[hash, req.body.email], (err) => {
            if (err) res.render('login', {session, msg: 'none', error: 'password updated'});
            else
                res.render('login', {session, msg: 'password updated', error: 'none'});
        });
    }
});


module.exports = router;