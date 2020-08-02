var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var geo_tools = require('geolocation-utils');
const { NULL } = require('mysql/lib/protocol/constants/types');
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', function(req, res) {
    if (req.session && req.session.user){
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
        connection.query("SELECT `users`.`username`, `users`.`Firstname`, `users`.`Lastname`, `users`.`Age`,`users`.`City`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`,`users`.`Latitude`, `users`.`Longitude`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ?", [req.session.user], (err, users) => {
            if (err) {
                console.log(err);
                console.log("Couldn't fetch users");
                res.redirect('/admin_index');
            }
            else {
                if (users[0]){
                    res.render('all_users', {title: 'Express', user : user_info, result : users});
                }
                else
                    res.render('all_users', {title: 'Express', user : user_info, result : "none"});
            }
        })
    }
    else
        res.redirect('/login');
})

module.exports = router