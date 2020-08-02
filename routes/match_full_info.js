var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.get('/', function(req, res) {
    if (req.session && req.session.user)
    { 
        console.log(req.session.match_profilepic)
        console.log(req.session.match_username)
        console.log(req.session.match_firstname)
        console.log(req.session.match_lastname)
        console.log(req.session.match_age)
        console.log(req.session.match_hobby1)
        console.log(req.session.match_hobby2)
        console.log(req.session.match_hobby3)
        console.log(req.session.match_hobby4)
        console.log(req.session.match_hobby5)
        console.log(req.session.match_orientation)
        console.log(req.session.match_bio)
        console.log(req.session.match_gender)
        console.log(req.session.match_distance)
        connection.query('SELECT * FROM views WHERE visitor = ? AND username = ?', [req.session.user, req.session.match_username], (err, row) => {
            if (err) console.log(err)
            else
            {
                if (row[0]) {
                    console.log('view already exists');
                }
                else
                {
                    connection.query('INSERT INTO views  (`username`, `visitor`) VALUES (?, ?)', [req.session.match_username, req.session.user] , (err) => {
                        if (err) console.log(err)
                        else
                            console.log('Inserted into views');
                    })
                }
            }

        })
       
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
        var match_info = {
            'username' : req.session.match_username,
            'profile_pic' : req.session.match_profilepic,
            'firstname' : req.session.match_firstname,
            'lastname' : req.session.match_lastname,
            'age' : req.session.match_age,
            'hobby1' : req.session.match_hobby1,
            'hobby2' : req.session.match_hobby2,
            'hobby3' : req.session.match_hobby3,
            'hobby4' : req.session.match_hobby4,
            'hobby5' : req.session.match_hobby5,
            'orientation' : req.session.match_orientation,
            'gender' : req.session.match_gender,
            'bio' : req.session.match_bio,
            'distance' : req.session.match_distance,
            'pic' : req.session.pic,
            'last_seen' : req.session.match_last_seen,
            'fame_rating'  : req.session.match_fame_rating
        }
        connection.query('SELECT * FROM connections WHERE username = ? AND connected_to = ? AND accepted = 1', [req.session.user, req.session.match_username], (err, rows) => {
            if (err) console.log(err)
            else
            {
                var isconnected;
                var isblocked;
                var isliked;
                if (rows[0]) {
                    isconnected = 1;
                    console.log('already connected')
                }
                else
                {
                    isconnected = 0;
                    console.log('you are not connected');
                }
                connection.query('SELECT * FROM likes WHERE username = ? AND theLiked = ?', [req.session.user, req.session.match_username], (err, row) => {
                    if (err) console.log(err)
                    else
                    {
                        if (row[0]) {
                            console.log('like already exists');
                            isliked = 1;
                            // console.log("the users info");
                            // console.log(user_info);
                            // res.render('match_full_info', {title: 'Express', user : user_info, match_info : match_info, islike : 1, connected : isconnected});
                        }
                        else
                        {
                            console.log("like doesn't exist")
                            isliked = 0;
                            // console.log("the users info");
                            // console.log(user_info);
                            // res.render('match_full_info', {title: 'Express', user : user_info, match_info : match_info, islike : 0, connected :isconnected});
                        }
                    }
                })
                connection.query('SELECT * FROM blocks WHERE username = ? AND block_who = ?', [req.session.user, req.session.match_username], (err, row) => {
                    if (err) console.log(err)
                    else
                    {
                        var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                        if (row[0]) {
                            console.log("This user is blocked");
                            isblocked = 1;
                            res.render('match_full_info', {title: 'Express', user : user_info, match_info : match_info, islike : isliked, connected : isconnected, blocked : 1, complete : complete});
                        }
                        else
                        {
                            console.log("the users info");
                            console.log(user_info);
                            res.render('match_full_info', {title: 'Express', user : user_info, match_info : match_info, islike : isliked, connected :isconnected, blocked : 0, complete : complete});
                        }
                    }
                })
            }
        })
        // console.log("the users info");
        // console.log(user_info);
        // res.render('match_full_info', {title: 'Express', user : user_info, match_info : match_info, islike : isliked});
    }
    else {
        res.redirect('/login')
    }
});

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (req.body.match_profilepic && req.body.match_username && req.body.match_age) {
        console.log("data successfully transfered");
        req.session.match_profilepic = req.body.match_profilepic;
        if (req.session.profile_pic == "Uploads/stock_profile_pic.png") {
            req.session.pic = 0;
        }
        else
            req.session.pic = 1;
        req.session.match_username = req.body.match_username;
        req.session.match_firstname = req.body.match_firstname;
        req.session.match_lastname = req.body.match_lastname;
        req.session.match_age = req.body.match_age;
        req.session.match_orientation = req.body.match_orientation;
        req.session.match_hobby1 = req.body.match_hobby1;
        req.session.match_hobby2 = req.body.match_hobby2;
        req.session.match_hobby3 = req.body.match_hobby3;
        req.session.match_hobby4 = req.body.match_hobby4;
        req.session.match_hobby5 = req.body.match_hobby5;
        req.session.match_distance = req.body.match_distance;
        req.session.match_bio = req.body.match_bio;
        req.session.match_gender = req.body.match_gender;
        req.session.match_fame_rating = req.body.match_fame_rating;
        req.session.match_last_seen = req.body.match_last_seen;
        res.redirect('/match_full_info');
    }
    else
    {
        console.log("could not fetch data");
        res.redirect('/search_match');
    }
})

module.exports = router;