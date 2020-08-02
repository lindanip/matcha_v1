var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var bcrypt = require('bcryptjs')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.use('/:key', (req, res) => {
    if (req.params.key) {
        var hash = bcrypt.hashSync(req.params.key, 12)
        connection.query('UPDATE users SET Password = ?, Reset_token = \'NULL\' WHERE Reset_token = ?', [hash, req.params.key], (err) => {
            if (err) {
                req.session.error = "Error."
                console.log("from reset.js, Couldn't update password")
                res.redirect('/login')
            }
            else {
                req.session.success = "Password succesfully changed"
                console.log('from reset.js, password sucessfully changed')
                res.redirect('/login')
            }
        })
    }
    else {
        console.log('from reset.js, could not update database')
        res.redirect('/login')
    }
})

module.exports = router