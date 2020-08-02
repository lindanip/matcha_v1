const express = require('express');
var session = require('express-session');
var router = express.Router();
var connection = require('../config/db');
var bodyParser = require('body-parser');
var multer = require('multer');
var Objects = require('../objects');
var uploads = multer({dest: "Uploads"});
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post ('/', uploads.array('photos', 5), (req, res) => {
    if (req.session.user)
    {
        console.log(req.files);
        var user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'complete' : req.session.complete
            }
        connection.query("SELECT * FROM images WHERE username = ?", [req.session.user], (err, images) => {
            let image_upload_limit = 5;
            image_upload_limit -= images.length;
    
            if (err)
                res.send("An error has occured!");
            else if (req.files.length <= image_upload_limit)
            {
                var post = new Objects(req.session.user, req.files);
                post.post();
                res.render('My_pictures', {image_upload_limit: image_upload_limit, amount: "", uploaded_images: "yes", user : user_info, images : images})
            }
            else
            {
                res.render('My_pictures', {image_upload_limit: image_upload_limit, amount: "Too much images", uploaded_images: "", user :user_info, images : images})
            }
        })
    }
    else
        res.redirect('/login');
})

module.exports = router;