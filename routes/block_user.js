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
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.query)
        res.redirect('/login');
    else{
        let { session } = req;
        res.render('block_user', {session, block : req.query.block_user});
    }
})


//res.render('block_user', {title: 'Express', user : user_info, block : req.session.block_user});
// router.post('/', (req, res) => {
//     if (req.body.match_username) {
//         req.session.block_user = req.body.match_username;
//         res.redirect('/block_user');
//     }
//     else
//         res.redirect('/match_full_info')
// })
module.exports = router;