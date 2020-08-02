var express = require('express');
var router = express.Router();
var connection = require('../config/db')

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
        res.render('admin_index', {title: 'Express', user : user_info});
    }
    else
        res.redirect('/login');
})

module.exports = router