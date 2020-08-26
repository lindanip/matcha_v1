const express = require('express')
const router = express.Router()
const session = require('express-session')
const connection = require('../config/db')
const bcrypt = require('bcryptjs')
const geo = require('geotools')
const ip = require('ip')
const unirest = require('unirest');
const ip_loc = require('ip-locator');
const { NULL } = require('mysql/lib/protocol/constants/types')
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


router.get('/', (req, res) => {
    if (req.session.user && req.session) {
        let { session } = req;

        connection.query('SELECT * FROM users WHERE username = ? ', [session.user], (err, userInfoRow) => {
            if (err) res.status(500).send('internal server error, please try again later');
            else
                if (userInfoRow[0].Complete == '-2')
                    res.render('settings', {session, error: 'none', msg: 'please complete additional form to get full access to matcha'});
                else if (userInfoRow[0].Complete == '0')
                    res.render('settings', {session, error: 'none', msg: 'please complete additional and hobbies form to get full access to matcha'});
                else if (userInfoRow[0].Complete == '-1')
                    res.render('settings', {session, error: 'none', msg: 'please complete hobbies form to get full access to matcha'});
                else
                    res.render('settings', {session, error: 'none', msg: 'none'});
        });
    }
    else {
        res.redirect('/login')
    }
})

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if (req.body.age)
    {
        let { session } = req;

        let sql = 'UPDATE users SET Age= ? WHERE username = ?';

        connection.query(sql, [req.body.age, session.user], (err) => {
            if (err) res.render('settings', {session, error: 'database error', msg: 'none'});
        });
        res.render('settings', {session, error: 'none', msg: 'age updated'});
    }
    else if (req.body && req.body.username && req.body.Firstname && req.body.Lastname && req.body.Email)
    {
        let { session } = req;

        if (req.body.username.search(/\s/) == 0)
            res.render('settings', {session, msg: 'none', error: 'Username should not have spaces'});
        // else if (req.body.username.search(/([A-Za-z0-9])/) != true)
        //     res.render('settings', {session, msg: 'none', error: 'Username should has to be a word and have no special characters'});
        else if (req.body.username.length > 25)
            res.render('settings', {session, msg: 'none', error: 'Username should has to be less than 25 charcters'});

        else if (req.body.Firstname.search(/\s/) == 0)
            res.render('settings', {session, msg: 'none', error: 'Firstname should not have spaces'});
        // else if (req.body.Firstname.search(/([A-Za-z0-9])/) != true)
        //     res.render('settings', {session, msg: 'none', error: 'Firstname should has to be a word and have no special characters'});
        else if (req.body.Firstname.length > 25)
            res.render('settings', {session, msg: 'none', error: 'Firstname should has to be less than 25 charcters'});

        else if (req.body.Lastname.search(/\s/) == 0)
            res.render('settings', {session, msg: 'none', error: 'lastname should not have spaces'});
        // else if (req.body.Lastname.search(/([A-Za-z0-9])/) != true)
        //     res.render('settings', {session, msg: 'none', error: 'lastname should has to be a word and have no special characters'});
        else if (req.body.Lastname.length > 25)
            res.render('settings', {session, msg: 'none', error: 'Lastname should has to be less than 25 charcters'});
        else
        {   
            let sql = 'SELECT * FROM users WHERE username = ?';
            
            connection.query(sql, [req.body.username], (err, rows, result) => {
                if (err) console.log(err)
                else if (rows[0] && rows[0]['username'])
                    res.render('settings', {session, msg:"username already exists", error: 'none'});
                else
                {
                    let { Firstname, Lastname, Email, user: username } = req.session;
                    
                    sql = 'UPDATE users SET username = ?, Firstname = ?, Lastname = ?, Email = ? WHERE username = ?';
                    
                    connection.query(sql, [req.body.username, req.body.Firstname, req.body.Lastname, req.body.Email, req.session.user], (err) => {
                        if (err) console.log(err)

                        sql = 'UPDATE user_hobbies SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })
                        sql = 'UPDATE user_filters SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })
                        
                        sql = 'UPDATE user_hobbies SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql = 'UPDATE images SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql =  'UPDATE connections SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })
                        
                        sql = 'UPDATE connections SET connected_to = ? WHERE connected_to = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql = 'UPDATE blocks SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql = 'UPDATE blocks SET block_who = ? WHERE block_who = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql = 'UPDATE views SET visitor = ? WHERE visitor = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql = 'UPDATE views SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        sql = 'UPDATE socketid SET username = ? WHERE username = ?';

                        connection.query(sql, [req.body.username, req.session.user], (err) => {
                            if (err) console.log(err)
                        })

                        req.session.user = req.body.username;
                        req.session.Firstname = req.body.Firstname;
                        req.session.Lastname = req.body.Lastname;
                        req.session.Email = req.body.Email;
                        
                        res.render('settings', {session, msg: 'personal info update success', error: 'none'});
                    })
                }
            })
        }
    }
    else if (req.body && req.body.password && req.body.vPassword) {
        let { session } = req;

        if (!req.body.password || !req.body.vPassword)
            res.render('settings', {session, msg: 'none', error: 'please complete the fields'});
        else if (req.body.password != req.body.vPassword)
            res.render('settings', {session, msg: 'none', error: 'passwords do not match'});
        else if (req.body.password.length < 8)
            res.render('settings', {session, msg: 'none', error: 'Password must contain 8 or more characters'});
        else if (req.body.password.search(/\d/) == -1)
            res.render('settings', {session, msg: 'none', error: 'Password must contain atleast 1 number'});
        else if (req.body.password.search(/[a-z]/) == -1)
            res.render('settings', {session, msg: 'none', error: 'Password must contain atleast 1 small letter'});
        else if (req.body.password.search(/[A-Z]/) == -1)
            res.render('settings', {session, msg: 'none', error: 'Password must contain atleast 1 capital letter'});
        else{

            let hash = bcrypt.hashSync(req.body.password, 12);

            connection.query('UPDATE users SET Password = ? WHERE username = ?',[hash, session.user], (err) => {
                if (err) res.render('settings', {session, msg: 'none', error: 'personal info update success'});
                else
                    res.render('settings', {session, msg: 'personal info update success', err: 'none'});
            });
        }
    }
    else if (req.body && req.body.Orientation && req.body.Bio)
    {    
        let { session } = req;
        let gender = req.body.Gender;
        gender = gender.toLowerCase();
        
        if (!gender || (gender != 'male' && gender != 'female'))
            res.render('settings', { session, error: 'invalid gender', msg: 'none' }); 
        else
        {
            let sql = 'UPDATE users SET Gender = ?, Orientation = ?, Bio = ? WHERE username = ?';
            
            connection.query(sql, [gender, req.body.Orientation, req.body.Bio, req.session.user], (err) => {
                if (err) res.status(500).send('internal server error, please try again later');
                else
                {
                    connection.query('SELECT * FROM users WHERE username = ? ', [session.user], (err, userInfoRow) => {
                        if (err) res.status(500).send('internal server error, please try again later');
                        else{
                            // %% new check { user after sql query } %% 

                            if (userInfoRow[0].Complete == '-2' )
                            {
                                connection.query('UPDATE users SET Complete = 1 WHERE username = ?', [req.session.user], (err) => {
                                    if (err) res.status(500).send('internal server error, please try again later');
                                    else{
                                        req.session.complete = 1;
                                        res.render('settings', {session, error: 'none', msg: 'profile successfully completed, you can now get full access to matcha '})
                                    }
                                });            
                            }else if (userInfoRow[0].Complete == '0')
                            {
                                connection.query('UPDATE users SET Complete = -1 WHERE username = ?', [req.session.user], (err) => {
                                    if (err) res.status(500).send('internal server error, please try again later');
                                    else{
                                        req.session.complete = -1;
                                        res.render('settings', {session, error: 'none', msg: 'update complete, please complete hobbies form to get full access to matcha'})
                                    }
                                });
                            }else if (userInfoRow[0].Complete == '-1')
                                res.render('settings', {session, error: 'none', msg: 'update complete, please complete hobbies form to get full access to matcha'})
                            else
                                res.render('settings', {session, error: 'none', msg: 'additional information successfully updated'})
                        }
                    });
                }
            })
        }
    }
    else if (req.body && req.body.Latitude && req.body.Longitude) {
            if (!req.session.user)
                res.redirect('/login');
            else{
            let session = req.session;

            let apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');
            apiCall.end((response) => {
                ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
                    if (err)
                        res.render('settings', {session, msg: 'none', error: 'couldnt get location please try again'});
                    else
                    {

                        let sql = "UPDATE users SET Longitude = ? WHERE username = ?";
                        connection.query(sql, [data.lon, req.session.user], (err) => {
                            if (err)
                                res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
                        });

                        sql = "UPDATE users SET Latitude = ? WHERE username = ?";
                        connection.query(sql, [data.lat, session.user], (err) => {
                            if (err)
                            res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
                        });

                        sql = "UPDATE users SET City = ? WHERE username = ?";
                        connection.query(sql, [data.city, session.user], (err) => {
                            if (err)
                                res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
                            else{
                                session.city = data.city;
                                res.render('settings', {session, msg: 'location updated', error: 'none'});
                            }
                        });
                    }
                });
            });
        }
        // 87.229.134.24
        // connection.query('UPDATE users SET Longitude = ?, Latitude = ? WHERE username = ?',[req.body.Longitude, req.body.Latitude, req.session.user], (err) => {
        //     if (err) console.log(err)
        //     else {
        //         console.log('Successfuly updated location')
        //         res.redirect('/settings')
        //     }
        // })
        // var apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');

        // apiCall.end((response) => {
        //     if (response.body.length > 0)
        //     {
        //         ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
        //             if (err)
        //                 res.send("An error has occured!");
        //             else
        //             {
        //                 console.log(data);
        //                 connection.query("UPDATE users SET Longitude = ? WHERE username = ?", [data.lon, req.session.user], (err, succ) => {
        //                     if (err)
        //                         console.log(err);
        //                 })
        //                 connection.query("UPDATE users SET Latitude = ? WHERE username = ?", [data.lat, req.session.user], (err, succ) => {
        //                     if (err)
        //                         console.log(err);
        //                 })
        //                 connection.query("UPDATE users SET City = ? WHERE username = ?", [data.city, req.session.user], (err, succ) => {
        //                     if (err)
        //                         console.log(err);
        //                 })
        //                 var user_info = {
        //                     'username' : req.session.user,
        //                     'Email' : req.session.Email,
        //                     'Firstname' : req.session.Firstname,
        //                     'Lastname' : req.session.Lastname,
        //                     'profile_pic' : req.session.profile_pic,
        //                     'complete' : req.session.complete
        //                     }
        //                     var complete = 0;
        //                     if (req.session.tocomplete == "you have completed your profile") {
        //                         complete = 1;
        //                         req.session.tocomplete = NULL;
        //                     }
        //                     console.log('the complete variable is ' + complete)
        //                     if (req.session.message) {
        //                         var message = req.session.message;
        //                         req.session.message = NULL;
        //                     }
        //                 res.render('settings', {updated_location: "yes", user : user_info, complete : complete, message : message});
        //                 // res.redirect('/settings')
        //             } 
        //         })
        //     }
        // })
    }
    else if (req.body && req.body.hobby1 && req.body.hobby2  && req.body.hobby3  && req.body.hobby4  && req.body.hobby5) {
        let { session } = req;

        hobby1 = "#" + req.body.hobby1;
        hobby2 = "#" + req.body.hobby2;
        hobby3 = "#" + req.body.hobby3;
        hobby4 = "#" + req.body.hobby4;
        hobby5 = "#" + req.body.hobby5;
        
        let sql = 'UPDATE user_hobbies SET Hobby1 = ?, Hobby2 = ?, Hobby3 = ?, Hobby4 = ?, Hobby5 = ? WHERE username = ?';
        
        connection.query(sql, [hobby1, hobby2, hobby3, hobby4, hobby5, session.user], (err) => {
            if (err) res.status(500).send('internal server error, please try again later');
            else
            {
                connection.query('SELECT * FROM users WHERE username = ? ', [session.user], (err, userInfoRow) => {
                    if (err) res.status(500).send('internal server error, please try again later');
                    else{
                        // %% new check { user after sql query } %%

                        if (userInfoRow[0].Complete == '-1')
                        {
                            connection.query('UPDATE users SET Complete = 1 WHERE username = ?', [req.session.user], (err) => {
                                if (err) res.status(500).send('internal server error, please try again later');
                                else{
                                    req.session.complete = 1;
                                    res.render('settings', {session, error: 'none', msg: 'profile successfully completed, you can now get full access to matcha '})
                                }
                            });            
                        }else if (userInfoRow[0].Complete == '0')
                        {
                            connection.query('UPDATE users SET Complete = -2 WHERE username = ?', [req.session.user], (err) => {
                                if (err) res.status(500).send('internal server error, please try again later');
                                else{
                                    req.session.complete = -2;
                                    res.render('settings', {session, error: 'none', msg: 'update complete, please complete the additional form to get full access to matcha'})
                                }
                            });
                        }else if (userInfoRow[0].Complete == '-2')
                            res.render('settings', {session, error: 'none', msg: 'update complete, please complete the additional form to get full access to matcha'})
                        else
                            res.render('settings', {session, error: 'none', msg: 'additional information successfully updated'})
                    }
                });
            }
        })
    }
    else {
        res.render('settings', {session, msg: 'none', error: 'please complete all form fields on seleted section'});
    }
})


module.exports = router;




























// const express = require('express');
// const router = express.Router();
// const session = require('express-session');
// const connection = require('../config/db');
// const bcrypt = require('bcryptjs');
// const geo = require('geotools');
// const ip = require('ip');
// const unirest = require('unirest');
// const ip_loc = require('ip-locator');
// const { NULL } = require('mysql/lib/protocol/constants/types');
// const secretString = Math.floor((Math.random() * 10000) + 1);

// router.use(session({
//     secret: secretString.toString(),
//     resave: false,
//     saveUninitialized: false
// }));

// router.get('/*', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         let session = req.session;
//         res.render('settings', {session: session, msg: 'none', error: 'none'});
//     }
// });

// router.post('/personal', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         let session = req.session;

//         if (!req.body.username || !req.body.Firstname || !req.body.Lastname || !req.body.Email)
//             res.render('settings', {session, msg: 'none', error: 'please complete the fields'});
//         else{
//             const username = req.body.username;
//             const firstname = req.body.Firstname;
//             const lastname = req.body.Lastname;
//             const email = req.body.Email;
            
//             let dbErrorMsg = (err) =>
//             {
//                 res.render('settings', {errParam: err, session, msg: 'none',
//                     error: 'database connection error, please try again'});
//             };

//             let updateShortTask = (sql, params) =>
//             {    
//                 connection.query(sql ,params, (err) => {
//                     if (err) dbErrorMsg(err);
//                 });
//             };

//             //needs to check if admin    &&& needs more debbugging
//             let sql = 'SELECT * FROM users WHERE username = ?';
//             connection.query(sql, [username], (err, rows, result) => {
//                 if (err) dbErrorMsg(err);
//                 else if (rows[0] && rows[0]['username'])
//                     res.render('settings', {session, msg: 'none', error: 'username already taken'});
//             });
            
            
//             sql = 'UPDATE users SET username = ?, Firstname = ?, Lastname = ?, Email = ? WHERE username = ?';
//             updateShortTask(sql, [username, firstname, lastname, email, req.session.user]);

//             sql = 'UPDATE user_hobbies SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE user_filters SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE user_hobbies SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE images SET username = ? WHERE username = ?';        
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE connections SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE connections SET connected_to = ? WHERE connected_to = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE blocks SET username = ? WHERE username = ?'
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE blocks SET block_who = ? WHERE block_who = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE likes SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE views SET visitor = ? WHERE visitor = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE views SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             sql = 'UPDATE socketid SET username = ? WHERE username = ?';
//             updateShortTask(sql, [username, req.session.user]);

//             req.session.user = req.body.username
//             req.session.Firstname = req.body.Firstname
//             req.session.Lastname = req.body.Lastname
//             req.session.Email = req.body.Email
//             req.session.message = "Details successfuly updated";

//             let updatedSession = req.session;    
//             res.render('settings', {session: updatedSession, msg: 'success', error: 'none'});
//         }
//     }
// });


// router.post('/password', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         let session = req.session;

//         if (!req.body.password || !req.body.vPassword)
//             res.render('settings', {session, msg: 'none', error: 'please complete the fields'});
//         else if (req.body.password != req.body.vPassword)
//             res.render('settings', {session, msg: 'none', error: 'passwords do not match'});
//         else if (req.body.password.length < 8)
//             res.render('settings', {session, msg: 'none',error: 'Password must contain 8 or more characters'});
//         else if (req.body.password.search(/\d/) == -1)
//             res.render('settings', {session, msg: 'none', error: 'Password must contain atleast 1 number'});
//         else if (req.body.password.search(/[a-z]/) == -1)
//             res.render('settings', {session, msg: 'none', error: 'Password must contain atleast 1 small letter'});
//         else if (req.body.password.search(/[A-Z]/) == -1)
//             res.render('settings', {session, msg: 'none', error: 'Password must contain atleast 1 capital letter'});
//         else{
//             let hash = bcrypt.hashSync(req.body.password, 12);

//             let sql = 'UPDATE users SET Password = ? WHERE username = ?';
//             connection.query(sql, [hash, session.user], (err) => {
//                 if (err)
//                     res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
//             });             
//             res.render('settings', {session, msg: 'success', error: 'none'});
//         }
//     }
// });

// router.post('/location', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         let session = req.session;

//         let apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');
//         apiCall.end((response) => {
//             ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
//                 if (err)
//                     res.render('settings', {session, msg: 'none', error: 'couldnt get location please try again'});
//                 else
//                 {

//                     let sql = "UPDATE users SET Longitude = ? WHERE username = ?";
//                     connection.query(sql, [data.lon, req.session.user], (err) => {
//                         if (err)
//                             res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
//                     });

//                     sql = "UPDATE users SET Latitude = ? WHERE username = ?";
//                     connection.query(sql, [data.lat, session.user], (err) => {
//                         if (err)
//                         res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
//                     });

//                     sql = "UPDATE users SET City = ? WHERE username = ?";
//                     connection.query(sql, [data.city, session.user], (err) => {
//                         if (err)
//                             res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
//                         else{
//                             session.city = data.city;
//                             res.render('settings', {session, msg: 'location updated', error: 'none'});
//                         }
//                     });
//                 }
//             });
//         });
//     }
// });

// router.post('/orientation', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         let session = req.session;

//         if (!req.body || !req.body.Orientation || !req.body.Bio)
//             res.render('settings', {session, msg: 'none', error: 'please complete form fields'});
//         else{
//             let sql = 'UPDATE users SET Orientation = ?, Bio = ? WHERE username = ?';
//             connection.query(sql, [req.body.Orientation, req.body.Bio, session.user], (err) => {
//                 if (err)
//                     res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
//             });

//             sql = 'UPDATE users SET Complete = 1 WHERE username = ?';
//             connection.query(sql, [session.user], (err) => {
//                 if (err)
//                     res.render('settings', {session, msg: 'none', error: 'database connection error, please try again'});
//                 else{
//                     req.session.complete = 1;
//                     session = req.session;
//                     res.render('settings', {session, msg: 'success', error: 'none'});
//                 }
//             });
//         }
//     }
// });

// router.post('/hobbies', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         let session = req.session;

//         if (!req.body || !req.body.hobby1 || !req.body.hobby2 
//             || !req.body.hobby3 || !req.body.hobby4  || !req.body.hobby5)
//             res.render('settings', {session, msg: 'none', error: 'please complete form fields'});
//         else{
//             hobby1 = `#${req.body.hobby1}`;
//             hobby2 = `#${req.body.hobby2}`;
//             hobby3 = `#${req.body.hobby3}`;
//             hobby4 = `#${req.body.hobby4}`;
//             hobby5 = `#${req.body.hobby5}`;

//             let sql = 'UPDATE user_hobbies SET Hobby1 = ?, Hobby2 = ?, Hobby3 = ?, Hobby4 = ?, Hobby5 = ? WHERE username = ?';
//             connection.query(sql, [hobby1, hobby2, hobby3, hobby4, hobby5, req.session.user], (err) => {
//                 if (err)
//                     res.render('settings', {session, msg: 'none',
//                             error: 'database connection error, please try again'});
//                 else
//                     res.render('settings',{session, msg: 'success', error: 'none'});
//             });
//         }
//     }
// });

// module.exports = router;


//needs more debugging
// sql = 'SELECT * FROM users WHERE email = ?';
// connection.query(sql, [email], (err, rows, result) => {
//     if (err) dbErrorMsg(err);
//     else if (rows[0] && rows[0]['email'])
//         res.render('settings', {msg: 'none', error: 'email already taken'});
// });

// router.post('/location', (req, res) => {
//     if (!req.session.user || !req.session)
//         res.redirect('/login');
//     else{}
// });