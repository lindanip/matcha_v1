const express = require('express')
const router = express.Router()
const connection = require('../config/db')
const nodemailer = require('nodemailer')
const session = require('express-session')
const secretString = Math.floor((Math.random() * 10000) + 1);


router.get('/', (req, res) => res.render('forgot', { msg: 'none', error: 'none'}));

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


router.post('/', (req, res) => {
    if (!req.body.Email)
        res.render('forgot', { msg: 'none', error: 'please enter email'});
    else
    {
        let sql = 'SELECT username, Email FROM users WHERE Email = ?';

        connection.query(sql, [req.body.Email], (err, rows) => 
        {
            if (err) console.log(err);
            else if (!rows[0])
                res.render('forgot', { msg: 'none', error: 'user email not found'});
            else
            {
                let token = (Math.random() + 1).toString(36).substr(2, 15);

                sql = 'UPDATE users SET Reset_token = ? WHERE Email = ?';

                connection.query(sql, [token, req.body.Email], (err) => {
                    if (err) console.log(err);
                });
                
                // email sending process
                let url =   `<a href="${req.protocol}://${req.get('host')}/reset/${token}">`+
                                    `Reset your Password` +
                            `</a>`;
                let transporter = nodemailer.createTransport({                    
                    service: 'gmail',
                    port: 587,
                    secure: false,
                    auth:{
                        user: 'koketsomatjeke.matcha@gmail.com',
                        pass: 'LieThatTellsTheTruth'
                    },
                    tls:{ rejectUnauthorized: false }
                });

                let mailOptions = {
                    form: 'koketsomatjeke.matcha@gmail.com',
                    to: req.body.Email,
                    subject: 'reset password',
                    html: `<p> Click Here to continue with your password reset request ${url} </p>`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error)
                        console.log(error);
                    else
                    {
                        console.log('email sent');
                        console.log(info);
                    }
                });

                // end of the emailing process

                res.render('login', {msg: 'please check your email', error: 'none'})
            }
        });
    }
});

module.exports = router;



















































// router.post('/', (req, res) => {
//     if (req.body.Email && req.body) {
//         connection.query('SELECT username, Email FROM users WHERE Email = ?', [req.body.Email], (err, rows) => 
//         {
//             if (err) console.log(err)
//             else if (rows[0])
//             {
//                 var token = (Math.random() + 1).toString(36).substr(2, 15)
//                 connection.query('UPDATE users SET Reset_token = ? WHERE Email = ?', [token, req.body.Email], (err) => {
//                     if (err) console.log(err)
//                 });
                
//                 // email sending process
//                 // <
                
//                 let url =   `<a href="${req.protocol}://${req.get('host')}/reset/${token}">`+
//                                     `Reset your Password` +
//                             `</a>`;
//                 let transporter = nodemailer.createTransport({
                    
//                     service: 'gmail',
//                     port: 587,
//                     secure: false,
//                     auth:
//                     {
//                         user: 'koketsomatjeke.matcha@gmail.com',
//                         pass: 'LieThatTellsTheTruth'
//                     },
//                     tls:{
//                         rejectUnauthorized: false
//                     }
//                 });

//                 let mailOptions = {
//                     form: 'koketsomatjeke.matcha@gmail.com',
//                     to: req.body.Email,
//                     subject: 'reset password',
//                     html: `<p> Click Here to continue with your password reset request ${url} </p>`
//                 };

//                 transporter.sendMail(mailOptions, (error, info) => {
//                     if (error)
//                         console.log(error);
//                     else
//                     {
//                         console.log('email sent');
//                         console.log(info);
//                     }
//                 });

//                 // >
//                 // end of the emailing process
//                 res.redirect('/login')
//             }
//             else {
//                 res.redirect('/forgot')
//             }
//         });
//     }
// })

// module.exports = router;
