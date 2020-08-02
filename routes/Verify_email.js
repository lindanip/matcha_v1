var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var nodemailer = require('nodemailer')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);


router.get('/', (req, res) => {
    res.render('Verify_email', {
        title: 'Verify_email'
    })
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.use('/:key', (req, res) => {
    if (req.params) {
        connection.query('UPDATE users SET Verify = 1 WHERE Reset_token = ?', [req.params.key], (err) => {
            if (err) {
                req.session.error = "Error."
                console.log("from verify_email.js, Couldn't verify email")
                res.redirect('/login')
            }
            else {
                req.session.success = "email succesfully verified"
                console.log('from verify_email.js, account sucessfully verified')
                res.redirect('/login')
            }
        })
    }
})

module.exports = router