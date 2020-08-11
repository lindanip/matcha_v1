var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var nodemailer = require('nodemailer')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
    if (req.session && req.session.user) {
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

        let { session } = req;
        res.render('block_user', {session, title: 'Express', user : user_info, block : req.session.block_user});
    }
    else
        res.redirect('/login');
})

router.post('/', (req, res) => {
    if (req.body.match_username) {
        req.session.block_user = req.body.match_username;
        res.redirect('/block_user');
    }
    else
        res.redirect('/match_full_info')
})
module.exports = router;