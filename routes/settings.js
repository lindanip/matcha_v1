const express = require('express');
const router = express.Router();
const session = require('express-session');
const connection = require('../config/db');
const bcrypt = require('bcryptjs');
const geo = require('geotools');
const ip = require('ip');
const unirest = require('unirest');
const ip_loc = require('ip-locator');
const { NULL } = require('mysql/lib/protocol/constants/types');
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
    if (!req.session.user || !req.session)
        res.redirect('/login');
    else{
        var user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'complete' : req.session.complete
            };
        var complete = 0;
        if (req.session.tocomplete == "you have completed your profile") {
            complete = 1;
            req.session.tocomplete = NULL;
        }
        if (req.session.message) {
            var message = req.session.message;
            req.session.message = NULL;
        }
        res.render('settings', {user : user_info,
                                complete : complete,
                                message : message,
                                msg: 'none',
                                error: 'none'}) 
    }
});

router.post('/personal', (req, res) => {
    if (!req.session.user || !req.session)
        res.redirect('/login');
    else{
        if (!req.body.username || !req.body.Firstname || !req.body.Lastname || !req.body.Email)
            res.render('settings', {msg: 'none', error: 'please complete the fields'});
        
        const username = req.body.username;
        const firstname = req.body.Firstname;
        const lastname = req.body.Lastname;
        const email = req.body.Email;

        //needs more debbugging
        var sql = 'SELECT * FROM users WHERE username = ?';
        connection.query(sql, [username], (err, rows, result) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
            else if (rows[0] && rows[0]['username'])
                res.render('settings', {msg: 'none', error: 'username already taken'});
        });

        //needs more debugging
        // sql = 'SELECT * FROM users WHERE email = ?';
        // connection.query(sql, [email], (err, rows, result) => {
        //     if (err)
        //         res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        //     else if (rows[0] && rows[0]['email'])
        //         res.render('settings', {msg: 'none', error: 'email already taken'});
        // });

        sql = 'UPDATE users SET username = ?, Firstname = ?, Lastname = ?, Email = ? WHERE username = ?';
        connection.query(sql ,[username, firstname, lastname, email, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE user_hobbies SET username = ? WHERE username = ?';
        connection.query(sql ,[username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE user_filters SET username = ? WHERE username = ?';
        connection.query(sql ,[username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE user_hobbies SET username = ? WHERE username = ?';
        connection.query(sql ,[username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE images SET username = ? WHERE username = ?';
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE connections SET username = ? WHERE username = ?';
        connection.query(sql , [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE connections SET connected_to = ? WHERE connected_to = ?';
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        })

        sql = 'UPDATE blocks SET username = ? WHERE username = ?'
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        })

        sql = 'UPDATE blocks SET block_who = ? WHERE block_who = ?';
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        })

        sql = 'UPDATE likes SET username = ? WHERE username = ?';
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE views SET visitor = ? WHERE visitor = ?';
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE views SET username = ? WHERE username = ?';
        connection.query(sql, [username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE socketid SET username = ? WHERE username = ?';
        connection.query(sql ,[username, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });
        req.session.user = req.body.username
        req.session.Firstname = req.body.Firstname
        req.session.Lastname = req.body.Lastname
        req.session.Email = req.body.Email
        req.session.message = "Details successfuly updated";
        var user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'complete' : req.session.complete
            };
                        
        res.render('settings', {msg: 'success', error: 'none', user : user_info});
    }
});






router.post('/password', (req, res) => {
    if (!req.session.user || !req.session)
        res.redirect('/login');
    else if (!req.body.password || !req.body.vPassword)
        res.render('settings', {msg: 'none', error: 'please complete the fields'});
    else if (req.body.password != req.body.vPassword)
        res.render('settings', {msg: 'none', error: 'passwords do not match'});
    else if (req.body.password.length < 8)
        res.render('settings', {msg: 'none',error: 'Password must contain 8 or more characters'});
    else if (req.body.password.search(/\d/) == -1)
        res.render('settings', {msg: 'none', error: 'Password must contain atleast 1 number'});
    else if (req.body.password.search(/[a-z]/) == -1)
        res.render('settings', {msg: 'none', error: 'Password must contain atleast 1 small letter'});
    else if (req.body.password.search(/[A-Z]/) == -1)
        res.render('settings', {msg: 'none', error: 'Password must contain atleast 1 capital letter'});
    else{
        var hash = bcrypt.hashSync(req.body.password, 12)

        var sql = 'UPDATE users SET Password = ? WHERE username = ?';
        connection.query(sql,[hash, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });
        var user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'complete' : req.session.complete
            };
                        
        res.render('settings', {msg: 'success', error: 'none', user : user_info});
    }
});




router.post('/orientation', (req, res) => {
    if (!req.session.user || !req.session)
        res.redirect('/login');
    else if (!req.body || !req.body.Orientation || !req.body.Bio)
        res.render('settings', {msg: 'none', error: 'please complete form fields'});
    else{
        var sql = 'UPDATE users SET Orientation = ?, Bio = ? WHERE username = ?';
        connection.query(sql, [req.body.Orientation, req.body.Bio, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
        });

        sql = 'UPDATE users SET Complete = 1 WHERE username = ?';
        connection.query(sql, [req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
            else{
                req.session.tocomplete = "you have completed your profile";
                req.session.complete = 1;
                res.render('settings', {msg: 'success', error: 'none'});
            }
        });
    }
});

// router.post('/location', (req, res) => {
//     if (!req.session.user || !req.session)
//         res.redirect('/login');
//     else{}
// });

router.post('/hobbies', (req, res) => {
    if (!req.session.user || !req.session)
        res.redirect('/login');
    else if (!req.body || !req.body.hobby1 || !req.body.hobby2 
        || !req.body.hobby3 || !req.body.hobby4  || !req.body.hobby5)
        res.render('settings', {msg: 'none', error: 'please complete form fields'});
    else{
        hobby1 = "#" + req.body.hobby1;
        hobby2 = "#" + req.body.hobby2;
        hobby3 = "#" + req.body.hobby3;
        hobby4 = "#" + req.body.hobby4;
        hobby5 = "#" + req.body.hobby5;
        connection.query('UPDATE user_hobbies SET Hobby1 = ?, Hobby2 = ?, Hobby3 = ?, Hobby4 = ?, Hobby5 = ? WHERE username = ?',[hobby1, hobby2, hobby3, hobby4, hobby5, req.session.user], (err) => {
            if (err)
                res.render('settings', {msg: 'none', error: 'database connection error, please try again'});
            else
                res.render('settings',{msg: 'success', error: 'none'});
        });
    }
});

module.exports = router











// var express = require('express')
// var router = express.Router()
// var session = require('express-session')
// var connection = require('../config/db')
// var bcrypt = require('bcryptjs')
// var geo = require('geotools')
// var ip = require('ip')
// var unirest = require('unirest');
// var ip_loc = require('ip-locator');
// const { NULL } = require('mysql/lib/protocol/constants/types')
// var secretString = Math.floor((Math.random() * 10000) + 1);

// router.use(session({
//     secret: secretString.toString(),
//     resave: false,
//     saveUninitialized: false
// }));


// router.get('/', (req, res) => {
//     if (req.session.user && req.session) {
//         var user_info = {
//             'username' : req.session.user,
//             'Email' : req.session.Email,
//             'Firstname' : req.session.Firstname,
//             'Lastname' : req.session.Lastname,
//             'profile_pic' : req.session.profile_pic,
//             'complete' : req.session.complete
//             }
//         var complete = 0;
//         if (req.session.tocomplete == "you have completed your profile") {
//             complete = 1;
//             req.session.tocomplete = NULL;
//         }
//         console.log('the complete variable is ' + complete)
//         if (req.session.message) {
//             var message = req.session.message;
//             req.session.message = NULL;
//         }
//         res.render('settings', {user : user_info, complete : complete, message : message})
//     }
//     else {
//         res.redirect('/login')
//     }
// })

// router.post('/', (req, res) => {
//     if (req.body && req.body.username && req.body.Firstname && req.body.Lastname && req.body.Email) {
//         connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, rows, result) => {
//             if (err) console.log(err)
//             else if (rows[0] && rows[0]['username']) {
//                 // req.session.error = "Username already exists";
//                 console.log("username exists");
//                 res.redirect('/settings')
//             }
//             else
//             {
//                 connection.query('UPDATE users SET username = ?, Firstname = ?, Lastname = ?, Email = ? WHERE username = ?',[req.body.username, req.body.Firstname, req.body.Lastname, req.body.Email, req.session.user], (err) => {
//                     if (err) console.log(err)
//                     // req.session.destroy()
//                     connection.query('UPDATE user_hobbies SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE user_filters SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE user_hobbies SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE images SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE connections SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE connections SET connected_to = ? WHERE connected_to = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE blocks SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE blocks SET block_who = ? WHERE block_who = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE likes SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE views SET visitor = ? WHERE visitor = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE views SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     connection.query('UPDATE socketid SET username = ? WHERE username = ?',[req.body.username, req.session.user], (err) => {
//                         if (err) console.log(err)
//                     })
//                     req.session.user = req.body.username
//                     req.session.Firstname = req.body.Firstname
//                     req.session.Lastname = req.body.Lastname
//                     req.session.Email = req.body.Email
//                     console.log('Successfuly updated')
//                     req.session.message = "Details successfuly updated";
            
//                     res.redirect('/settings')
//                 })
//             }
//         })
//     }
//     else if (req.body && req.body.Password && req.body.vPassword) {
//         if (req.body.Password != req.body.vPassword) {
//             console.log("Passwords don't match");
//             req.session.error = "Passwords don't match"
//             res.redirect('/settings') 
//         }
//         else {
//             var hash = bcrypt.hashSync(req.body.Password, 12)
//             connection.query('UPDATE users SET Password = ? WHERE username = ?',[hash, req.session.user], (err) => {
//                 if (err) console.log(err)
//                 else {
//                     console.log('Successfuly updated')
//                     res.redirect('/settings')
//                 }
//             })
//         }
//     }
//     else if (req.body && req.body.Orientation && req.body.Bio) {
//         connection.query('UPDATE users SET Orientation = ?, Bio = ? WHERE username = ?',[req.body.Orientation, req.body.Bio, req.session.user], (err) => {
//             if (err) console.log(err)
//             else {
//                 console.log('Successfuly updated') 
//                 connection.query('UPDATE users SET Complete = 1 WHERE username = ?', [req.session.user], (err3) => {
//                     if (err3)
//                         res.send("An error has occured");
//                 })
//                 req.session.tocomplete = "you have completed your profile";
//                 req.session.complete = 1;
//                 console.log("Updated complete to 1");
                  
//                 res.redirect('/settings')
//             }
//         })
//     }
//     else if (req.body && req.body.Latitude && req.body.Longitude) { //87.229.134.24
//         // connection.query('UPDATE users SET Longitude = ?, Latitude = ? WHERE username = ?',[req.body.Longitude, req.body.Latitude, req.session.user], (err) => {
//         //     if (err) console.log(err)
//         //     else {
//         //         console.log('Successfuly updated location')
//         //         res.redirect('/settings')
//         //     }
//         // })
//         var apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');

//         apiCall.end((response) => {
//             if (response.body.length > 0)
//             {
//                 ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
//                     if (err)
//                         res.send("An error has occured!");
//                     else
//                     {
//                         console.log(data);
//                         connection.query("UPDATE users SET Longitude = ? WHERE username = ?", [data.lon, req.session.user], (err, succ) => {
//                             if (err)
//                                 console.log(err);
//                         })
//                         connection.query("UPDATE users SET Latitude = ? WHERE username = ?", [data.lat, req.session.user], (err, succ) => {
//                             if (err)
//                                 console.log(err);
//                         })
//                         connection.query("UPDATE users SET City = ? WHERE username = ?", [data.city, req.session.user], (err, succ) => {
//                             if (err)
//                                 console.log(err);
//                         })
//                         var user_info = {
//                             'username' : req.session.user,
//                             'Email' : req.session.Email,
//                             'Firstname' : req.session.Firstname,
//                             'Lastname' : req.session.Lastname,
//                             'profile_pic' : req.session.profile_pic,
//                             'complete' : req.session.complete
//                             }
//                             var complete = 0;
//                             if (req.session.tocomplete == "you have completed your profile") {
//                                 complete = 1;
//                                 req.session.tocomplete = NULL;
//                             }
//                             console.log('the complete variable is ' + complete)
//                             if (req.session.message) {
//                                 var message = req.session.message;
//                                 req.session.message = NULL;
//                             }
//                         res.render('settings', {updated_location: "yes", user : user_info, complete : complete, message : message});
//                         // res.redirect('/settings')
//                     } 
//                 })
//             }
//         })
//     }
//     else if (req.body && req.body.hobby1 && req.body.hobby2  && req.body.hobby3  && req.body.hobby4  && req.body.hobby5) {
//         hobby1 = "#" + req.body.hobby1;
//         console.log(hobby1);
//         hobby2 = "#" + req.body.hobby2;
//         console.log(hobby2);
//         hobby3 = "#" + req.body.hobby3;
//         console.log(hobby3);
//         hobby4 = "#" + req.body.hobby4;
//         console.log(hobby4);
//         hobby5 = "#" + req.body.hobby5;
//         console.log(hobby5);
//         connection.query('UPDATE user_hobbies SET Hobby1 = ?, Hobby2 = ?, Hobby3 = ?, Hobby4 = ?, Hobby5 = ? WHERE username = ?',[hobby1, hobby2, hobby3, hobby4, hobby5, req.session.user], (err) => {
//             if (err) console.log(err)
//             else {
//                 console.log('Successfuly updated')
//                 res.redirect('/settings')
//             }
//         })
//     }
//     else {
//         console.log('Details incorrectly passed in')
//         res.redirect('/settings')
//     }
// })

// module.exports = router