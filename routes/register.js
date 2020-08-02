const connection = require('../config/db');
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const session = require('express-session');
const unirest = require('unirest');
const ip_loc = require('ip-locator');
const iplocation = require('iplocation');

router.get('/', (req, res) => res.render('register', {error: 'non'}));

router.post('/', (req, res) => {
    if (!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.age 
        || !req.body.email || !req.body.password || !req.body.vPassword)
       res.render('register', {error: 'Please complete form fields'});
    else if (req.body.password != req.body.vPassword)
        res.render('register', {error: 'Passwords do not match'});
    else if (req.body.password.length < 8)
        res.render('register', {error: 'Password must contain 8 or more characters'});
    else if (req.body.password.search(/\d/) == -1)
        res.render('register', {error: 'Password must contain atleast 1 number'});
    else if (req.body.password.search(/[a-z]/) == -1)
        res.render('register', {error: 'Password must contain atleast 1 small letter'});
    else if (req.body.password.search(/[A-Z]/) == -1)
        res.render('register', {error: 'Password must contain atleast 1 capital letter'});
    else{
        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const age = req.body.age;
        const email = req.body.email;
        
        var sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        connection.query(sql, [username, email], (err, rows, result) => {
            if (err)
                res.render('register', {error: 'Sorry, failed to connect to database. Please try again'});
            else if (rows[0] && rows[0]['Email'])
                res.render('register', {error: 'User email already taken'});
            else if (rows[0] && rows[0]['Username'])
                res.render('register', {error: 'Username already taken'});
            else{
                let hash = bcrypt.hashSync(req.body.password, 12)
                
                sql = 'INSERT INTO `users` (`username`, `Firstname`, `Lastname`, `Age`, `Email`, `Password`, `profile_pic`) VALUES (?, ?, ?, ?, ?, ?, "Uploads/stock_profile_pic.png")';
                connection.query(sql, [username, firstname, lastname, age, email, hash], err => {
                    if (err)
                        res.render('register' , {error: '1 Sorry, failed to connect to database. Please try again'});
                    console.log('new user added to database');
                });

                sql = 'INSERT INTO `user_hobbies` (`username`) VALUES (?)';
                connection.query(sql, [username], (err) => {
                    if (err)
                        res.render('register' , {error: ' 2 Sorry, failed to connect to database. Please try again'});
                });

                sql = 'INSERT INTO `user_filters` (`username`, `Age`, `Orientation`) VALUES (?, "None", "None")';
                connection.query(sql, [username], (err) => {
                    if (err)
                        res.render('register' , {error: ' 3 Sorry, failed to connect to database. Please try again'});
                });

                const token = (Math.random() + 1).toString(36).substr(2, 15)
                sql = 'UPDATE users SET Reset_token = ? WHERE Email = ?';
                connection.query(sql, [token, email], (err) => {
                    if (err)
                        res.render('register' , {error: '4 Sorry, failed to connect to database. Please try again'});
                });

                connection.end();
                res.render('login' , {msg: 'Check email to verify account', error: 'non'});
            }
        });
    }
});

module.exports = router;




































// var express = require('express')
// var router = express.Router()
// var connection = require('../config/db')
// var bcrypt = require('bcryptjs')
// var nodemailer = require('nodemailer')
// var session = require('express-session')
// var unirest = require('unirest');
// var ip_loc = require('ip-locator');
// var iplocation = require('iplocation')
// router.get('/', function(req, res) {
//     res.render('/register', {
//         title: '/register'
//     })
// })

// router.post('/', function(req, res) {
//     if (req.body.username && req.body.Firstname && req.body.Lastname && req.body.Age && req.body.Email && req.body.Password && req.body.vPassword) {
//         connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [req.body.username, req.body.email], (err, rows, result) => {
//             if (err) console.log(err)
//             else if (rows[0] && rows[0]['username']) {
//                 // req.session.error = "Username already exists";
//                 console.log("username exists");
//                 res.render('//register')
//             }
//             else if (rows[0] && rows[0]['Email']) {
//                 // req.session.error = "Email already exists";
//                 console.log("email exists");
//                 res.render('//register')
//             }
//             else if (req.body.Password != req.body.vPassword) {
//                 // req.session.error = "Passwords don't match";
//                 console.log("passwords don't match");
//                 res.render('//register')
//             }
//             // else if (req.body.password.search(/[^a-zA-Z0-9\&\#\@\$\%\!\*\_\(\)\,\.\\:]/) != -1) {
//             //     // req.session.error = "Passwords must have at least one uppercase, one number, and one special character";
//             //     console.log("no uppercase or special character");
//             //     res.render('//register')
//             // }
//             else
//             {
//                 var hash = bcrypt.hashSync(req.body.Password, 12)
//                 connection.query('INSERT INTO `users` (`username`, `Firstname`, `Lastname`, `Age`, `Email`, `Password`, `profile_pic`) VALUES (?, ?, ?, ?, ?, ?, "Uploads/stock_profile_pic.png")', [req.body.username, req.body.Firstname, req.body.Lastname, req.body.Age, req.body.Email, hash], (err, result) => {
//                     if (err) {
//                         // req.session.error = "error."
//                         console.log("could'nt insert");
//                         console.log(err);
//                         res.render('//register')
//                     }
//                     else {
//                         connection.query('INSERT INTO `user_hobbies` (`username`) VALUES (?)', [req.body.username], (err, result) => {
//                             if (err) {
//                                 console.log("couldn't create hobby table")
//                                 console.log(err);
//                             }
//                             else {
//                                 console.log('Hobby  updated')
//                             }
//                         })
//                         connection.query('INSERT INTO `user_filters` (`username`, `Age`, `Orientation`) VALUES (?, "None", "None")', [req.body.username], (err, result) => {
//                             if (err) {
//                                 console.log("couldn't create filters table")
//                                 console.log(err);
//                             }
//                             else {
//                                 console.log('filters  updated')
//                             }
//                         })
//                         console.log("success");
//                         var token = (Math.random() + 1).toString(36).substr(2, 15)
//                         connection.query('UPDATE users SET Reset_token = ? WHERE Email = ?', [token, req.body.Email], (err) => {
//                             if (err) console.log(err)
//                         })
//                         var url = '<a href="' + req.protocol + '://' + req.get('host') + '/Verify_email/' + token + '">Verify your Account creation</a>'
//                         var transporter = nodemailer.createTransport({
//                             service: 'gmail',
//                             port: 587,
//                             secure: false,
//                             auth:
//                             {
//                                 user: 'koketsomatjeke.km@gmail.com',
//                                 pass: 'ilovedragons'
//                             }
//                         });
//                         console.log("transport created");
//                         // LINDANI
//                         // let mailOptions = transporter.sendMail({
//                         //     from: 'koketsomatjeke.km@gmail.com', // sender address
//                         //     // to: req.body.Email, // list of receivers
//                         //     to: req.body.Email, // list of receivers
//                         //     subject: 'Account verification', // Subject line
//                         //     html: '<p>Click Here to verify your account creation ' + url + '</p>'// plain text body
//                         // });
//                         //mailOptions();
//                         //console.log("email sent");
//                         var user = req.body.username
//                         // var apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');
//                         // apiCall.end((response) => {
//                         //     if (response.body.length > 0)
//                         //     {
//                         //         ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
//                         //             if (err)
//                         //                 res.send("An error has occured!");
//                         //             else
//                         //             {
//                         //                 console.log(data);
//                         //                 connection.query("UPDATE users SET Longitude = ? WHERE username = ?", [data.lon, req.body.username], (err, succ) => {
//                         //                     if (err)
//                         //                         console.log(err);
//                         //                     else
//                         //                         console.log('longitude updated')
//                         //                 })
//                         //                 connection.query("UPDATE users SET Latitude = ? WHERE username = ?", [data.lat, req.body.username], (err, succ) => {
//                         //                     if (err)
//                         //                         console.log(err);
//                         //                     else
//                         //                         console.log('latitude updated')
//                         //                 })
//                         //                 connection.query("UPDATE users SET City = ? WHERE username = ?", [data.city, req.body.username], (err, succ) => {
//                         //                     if (err)
//                         //                         console.log(err);
//                         //                     else
//                         //                         console.log('city updated')
//                         //                 })
//                         //                 res.render('login');
//                         //                 // res.render('/settings')
//                         //             } 
//                         //         })
//                         //     }
//                         // })
//                         res.render('/login')
//                     }
//                 })
//             }
//         })
//     } else {
//         console.log("fields not filled");
//         // req.session.error = "error";
//         res.render('//register')
//     }
// })
// module.exports = router