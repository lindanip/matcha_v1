var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

// router.get('/', function(req, res) {
//     if (req.session && req.session.user)
//     {

//     }
//     else
//     {

//     }
// })

router.post('/', (req, res) => {
    if (req.body.match_username) {
        connection.query('DELETE FROM likes WHERE username = ? AND theLiked = ?', [req.session.user, req.body.match_username], (err) => {
            if (err) console.log(err)
            else
            {
                console.log("Entered delete like loop");
                console.log('deleted from likes');
                req.session.message = "User removed from likes";
                res.redirect('/match_full_info');
            }
        })  
    }
    else
        res.redirect('/match_full_info')
})

module.exports = router