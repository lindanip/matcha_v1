var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var nodemailer = require('nodemailer')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);


router.get('/', (req, res) => {
    res.render('forgot', {
        title: 'Forgot Page'
    })
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (req.body.Email && req.body) {
        connection.query('SELECT username, Email FROM users WHERE Email = ?', [req.body.Email], (err, rows) => {
            if (err) console.log(err)
            else if (rows[0]) {
                var token = (Math.random() + 1).toString(36).substr(2, 15)
                connection.query('UPDATE users SET Reset_token = ? WHERE Email = ?', [token, req.body.Email], (err) => {
                    if (err) console.log(err)
                })
                var url = '<a href="' + req.protocol + '://' + req.get('host') + '/reset/' + token + '">Reset your Password</a>'
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 587,
                    secure: false,
                    auth:
                    {
                        user: 'koketsomatjeke.km@gmail.com',
                        pass: 'ilovedragons'
                    }
                });
                let mailOptions = transporter.sendMail({
                    from: 'koketsomatjeke.km@gmail.com', // sender address
                    // to: req.body.Email, // list of receivers
                    to: req.body.Email, // list of receivers
                    subject: 'Password Reset', // Subject line
                    html: '<p>Click Here to continue with your password reset request ' + url + '</p><br></br>then connect with the password: ' + token + ' which you can change later in your profile.'// plain text body
                });
                req.session.success = "Password change request accepted, please check your email"
                console.log("Password change request accepted, please check your email")
                res.redirect('/login')
            }
            else {
                req.session.error = "Email doesn't exist in our database"
                console.log("Email doesn't exist in our database")
                res.redirect('/forgot')
            }
        })
    }
})

module.exports = router