var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.get('/', function(req, res) {
    if (req.session && req.session.user) {
        let { session } = req
        connection.query('SELECT * FROM `connections` INNER JOIN `users` ON `connections`.`username` = `users`.`username` JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `connections`.`connected_to` = ? AND `connections`.`accepted` = 0', [req.session.user], (err, row) => {
            if (err) console.log(err)
            else
            {
                if (row[0]) {
                    var user_info = {
                        'username' : req.session.user,
                        'Email' : req.session.Email,
                        'Firstname' : req.session.Firstname,
                        'Lastname' : req.session.Lastname,
                        'profile_pic' : req.session.profile_pic,
                        'longitude' : req.session.Longitude,
                        'latitude' : req.session.Latitude,
                        'complete' : req.session.complete
                    }
                    res.render('connection_requests', {session, connections : row, user : user_info})
                }
                else
                {
                    var user_info = {
                        'username' : req.session.user,
                        'Email' : req.session.Email,
                        'Firstname' : req.session.Firstname,
                        'Lastname' : req.session.Lastname,
                        'profile_pic' : req.session.profile_pic,
                        'longitude' : req.session.Longitude,
                        'latitude' : req.session.Latitude,
                        'complete' : req.session.complete
                    }
                    res.render('connection_requests', {session, connections : "none", user : user_info})
                }
            }
        })
        
    }
    else
        res.redirect('/login');
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

module.exports = router;