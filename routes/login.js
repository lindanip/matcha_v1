const connection = require('../config/db');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const get_date = require('get-date');
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => res.render('login', {msg: "none", error: "none"}));

router.post('/', (req, res) => {
    if (!req.body.username || !req.body.password)
        res.render('login', {msg: 'none', error: 'Please enter the form fields'});
    else{
        const username = req.body.username;
        
        var sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        connection.query(sql, [username], (err, rows) => {
            if (err)
                res.render('login', {msg: 'none', error: 'could not connect to database, please try again'});
            else if (!rows[0])
                res.render('login', {msg: 'account does not exist', error: 'none'});
            else if (rows[0].Verify == 0)
                res.render('login', {msg: 'Please verify your account', error: 'none'});
            else if (!bcrypt.compareSync(req.body.password, rows[0].Password))
                res.render('login', {msg: 'none', error: 'wrong password'});    
            else{
                req.session.socketid = req.body.socketid;
                req.session.user = req.body.username;
                req.session.Firstname = rows[0].Firstname;
                req.session.Lastname = rows[0].Lastname;
                req.session.Email = rows[0].Email;
                req.session.Longitude = rows[0].Longitude;
                req.session.Latitude = rows[0].Latitude;
                req.session.Bio = rows[0].Bio;
                req.session.Age = rows[0].Age;
                req.session.city = rows[0].City;
                req.session.profile_pic = rows[0].profile_pic;
                req.session.complete = rows[0].Complete;
                req.session.filters2 = {
                    age: 'none',
                    orientation: 'none',
                    hobby: 'none',
                    city: 'none'
                };
                
                sql = 'UPDATE users SET Online = 1, last_seen = ? WHERE username = ?';
                connection.query(sql, [get_date(), rows[0].username], (err) => {
                    if (err)
                        res.render('login', {msg: 'none', error: 'could not connect to database, please try again'});
                });

                sql = 'INSERT INTO `socketid` (`username`, `soc_id`) VALUES (?, ?)';
                connection.query(sql, [req.body.username, req.body.socketid], (err) => {
                    if (err) console.log('databse error');
                    else console.log("socket added to the db");
                });

                if (rows[0].admin == 0) res.redirect('/')
                else res.redirect('/admin_index');
            }
        });
    }
});

module.exports = router;
