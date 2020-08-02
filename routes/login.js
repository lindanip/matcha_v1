var express = require('express')
var router = express.Router()
var session = require('express-session')
var bcrypt = require('bcryptjs')
var connection = require('../config/db')
var get_date = require('get-date')
var secretString = Math.floor((Math.random() * 10000) + 1);
const socketio = require('socket.io');

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (req.body.username && req.body.Password && req.body) {
        connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.body.username], (err, rows) => {
            if (err) console.log(err)
            else if (rows[0] && rows[0].Verify == 0) {
                console.log("email not verified");
                res.redirect('/login');
            }
            else if (rows[0] && rows[0].Verify == 1) {
                if (bcrypt.compareSync(req.body.Password, rows[0].Password)) {
                    req.session.socketid = req.body.socketid;
                    req.session.user = req.body.username
                    req.session.Firstname = rows[0].Firstname
                    req.session.Lastname = rows[0].Lastname
                    req.session.Email = rows[0].Email
                    req.session.Longitude = rows[0].Longitude
                    req.session.Latitude = rows[0].Latitude
                    req.session.Bio = rows[0].Bio
                    req.session.Age = rows[0].Age
                    req.session.city = rows[0].City
                    req.session.profile_pic = rows[0].profile_pic
                    req.session.complete = rows[0].Complete
                    console.log(req.session.profile_pic);
                    req.session.success = "Successfully logged in"
                    console.log("Successfully logged in")
                    console.log(req.session.user)
                    console.log(req.session.Firstname)
                    console.log(req.session.Lastname)
                    console.log(req.session.Email)
                    console.log("Age is" + req.session.Age)
                    console.log("City is" + req.session.city)
                    console.log(req.session.success)
                    console.log(req.session.complete)
                    connection.query('UPDATE users SET Online = 1, last_seen = ? WHERE username = ?', [get_date(),rows[0].username], (err) => {
                        if (err) console.log(err)
                    })
                    var query = 'INSERT INTO `socketid` (`username`, `soc_id`) VALUES (?, ?)';
                    connection.query(query, [req.body.username, req.body.socketid], (err) => {
                        if (err) console.log('databse error');
                        else console.log("socket added to the db");
                    });
                    if (rows[0].admin == 0) {
                        res.redirect('/')
                    }
                    else
                    {
                        res.redirect('/admin_index');
                    }
                }
                else {
                    // req.session.error = "Password Incorrect"
                    console.log("password incorrect")
                    res.redirect('/login')
                }
            }
            else {
                // req.session.error = "User doesn't exist"
                console.log("User doesn't exist")
                res.redirect('/login')
            }
        })
    }
    else {
        // req.session.error = "details unsuccessfully entered"
        console.log("Details unsuccessfully entered")
        res.redirect('/login')
    }
})
module.exports = router