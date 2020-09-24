const connection = require('../config/db');
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const unirest = require('unirest');
const ip_loc = require('ip-locator');


router.get('/', (req, res) => res.render('register', {error: 'none'}));

router.post('/', (req, res) => {
    if (!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.age 
        || !req.body.email || !req.body.password || !req.body.vPassword)
       res.render('register', {error: 'Please complete form fields'});
    
    else if (req.body.username.search(/\s/) == 0)
        res.render('register', {error: 'Username should not have spaces'});
    else if (req.body.username.search(/([A-Za-z0-9])/) != 0)
        res.render('register', {error: 'Username should has to be a word and have no special characters'});
    else if (req.body.username.length > 25)
        res.render('register', {error: 'Username should has to be less than 25 charcters'});

    else if (req.body.firstname.search(/\s/) == 0)
        res.render('register', {error: 'Firstname should not have spaces'});
    else if (req.body.firstname.search(/([A-Za-z0-9])/) != 0)
        res.render('register', {error: 'Firstname should has to be a word and have no special characters'});
    else if (req.body.firstname.length > 25)
        res.render('register', {error: 'Firstname should has to be less than 25 charcters'});

    else if (req.body.lastname.search(/\s/) == 0)
        res.render('register', {error: 'lastname should not have spaces'});
    else if (req.body.lastname.search(/([A-Za-z0-9])/) != 0)
        res.render('register', {error: 'lastname should has to be a word and have no special characters'});
    else if (req.body.lastname.length > 25)
        res.render('register', {error: 'Lastname should has to be less than 25 charcters'});
    
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
    else
    {
        const { username, firstname, lastname, age, email }
            = req.body;
        
        let sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        
        connection.query(sql, [username, email], (err, rows) => {
            if (err)
                res.render('register', {msg: 'none', error: 'Sorry, failed to connect to database. Please try again'});
            else 
            {
                if (rows[0] && rows[0].Email.toLowerCase() == email.toLowerCase())
                    res.render('register', {msg: 'none', error: 'user email already taken'});
                else if (rows[0] && rows[0].username.toLowerCase() == username.toLowerCase())
                    res.render('register', {msg: 'none', error: 'username already taken'});
                else
                {
                    const hash = bcrypt.hashSync(req.body.password, 12)
                    
                    sql = 
                        'INSERT INTO `users` (`username`, `Firstname`, `Lastname`, `Age`, `Email`, `Password`, `profile_pic`, `Orientation`)' +
                        ' VALUES (?, ?, ?, ?, ?, ?, "Uploads/stock_profile_pic.png", "bisexual")';
                    
                    connection.query(sql, [username, firstname, lastname, age, email, hash], err => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
                    });

                    sql = 'INSERT INTO `user_hobbies` (`username`) VALUES (?)';
                    connection.query(sql, [username], (err) => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
                    });

                    sql = 'INSERT INTO `user_filters` (`username`, `Age`, `Fame_rating`, `City`, `Hobby1`, `Hobby2`) VALUES '+
                        '(?, "None", "None", "None", "None", "None")';
                    connection.query(sql, [username], (err) => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
                    });

                    const token = (Math.random() + 1).toString(36).substr(2, 15)
                    sql = 'UPDATE users SET Reset_token = ? WHERE Email = ?';
                    connection.query(sql, [token, email], (err) => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'Sorry, failed to connect to database. Please try again'});
                    });

                    // email sending process
                    // <
                    
                    let url =   `<a href="${req.protocol}://${req.get('host')}/Verify_email/${token}">`+
                                     `verify your account creation` +
                                `</a>`;
                    let transporter = nodemailer.createTransport({
                        
                        service: 'gmail',
                        port: 587,
                        secure: false,
                        auth:
                        {
                            user: 'koketsomatjeke.matcha@gmail.com',
                            pass: 'LieThatTellsTheTruth'
                        },
                        tls:{
                            rejectUnauthorized: false
                        }
                    });

                    let mailOptions = {
                        form: 'koketsomatjeke.matcha@gmail.com',
                        to: req.body.email,
                        subject: 'account verification',
                        html: `<p> click here to verify your account creation ${url} </p>`
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

                    // >
                    // end of the emailing process

                    let apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');
                    apiCall.end((response) => {
                        if (!response.body.length)
                            res.render({msg: 'we need a message here'});
                        else {
                            ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
                                if (err)
                                    res.render('login', {msg: 'we need a message here'});
                                else{
                                    sql = "UPDATE users SET Longitude = ? WHERE username = ?";
                                    connection.query(sql, [data.lon, username], err => {
                                        if (err)
                                            res.render('login', {msg: 'we need a message here'});
                                        console.log('longitude updated');
                                    });
                                    
                                    sql = "UPDATE users SET Latitude = ? WHERE username = ?";
                                    connection.query(sql, [data.lat, username], err => {
                                        if (err)
                                            res.render('login', {msg: 'we need a message here'});
                                        console.log('latitude updated')
                                    });

                                    sql = "UPDATE users SET City = ? WHERE username = ?";
                                    connection.query(sql, [data.city, username], err => {
                                        if (err)
                                            res.render('login', {msg: 'we need a message here'});
                                        console.log('city updated')
                                    });
                                }
                            });
                        }
                    });
                    res.render('login' , {msg: 'check email to verify account', error: 'none'});
                }
            }
        });
    }
});

module.exports = router;