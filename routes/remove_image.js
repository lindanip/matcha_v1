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


router.post('/', (req, res) => {
    if (req.body.remove) {
        connection.query('DELETE FROM images WHERE username = ? AND image = ?', [req.session.user, req.body.remove], (err) => {
            if (err) console.log(err)
            else
            {
                console.log("Entered delete image loop");
                console.log('deleted from image');
                req.session.message = "Image deleted from images";
                res.redirect('/My_pictures');
            }
        })  
    }
    else
        res.redirect('/My_pictures')
})
module.exports = router;