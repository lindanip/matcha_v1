var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session');
const { query } = require('express');
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', function(req, res) {
    if (!req.session.user)
        res.redirect('/login');
    else
    {
        let { session } = req;
        let user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'longitude' : req.session.Longitude,
            'latitude' : req.session.Latitude,
            'complete' : req.session.complete
        }

        let sql = 
                    'SELECT * FROM views INNER JOIN `users` ON `views`.`visitor` = `users`.`username` JOIN ' +
                    '`user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `views`.`username` = ?';

        connection.query(sql, [session.user], (err, row) => {
            if (err) res.status(500).send('internal server error');
            else{
                if (row[0])
                    res.render('profile_views', {session, user : user_info, views : row});
                else
                    res.render('profile_views', {session, user : user_info, views : "none"});
            }
        })
    }
})


module.exports = router