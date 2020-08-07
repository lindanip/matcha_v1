var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db');
var geo_tools = require('geolocation-utils');
const { NULL } = require('mysql/lib/protocol/constants/types');
var secretString = Math.floor((Math.random() * 10000) + 1);

// router.post('/', (req, res) => {
//     if (!req.session.user)
//         res.redirect('/login');
//     else{
//         req.session.filters = {
//             age: req.body.filter1,
//             orientation: req.body.filter2,
//             hobby: req.body.filter3,
//             city: 'none'
//         };
//         session = req.session;
        
//         let sql = 'UPDATE user_filters SET Age = ?, Orientation = ?, Hobby = ? WHERE username = ?';
//         connection.query(sql, [req.body.filter1, req.body.filter2, req.body.filter3, session.user], (err) => {
//             if (err) console.log(err); 
//         });
//         res.redirect('/search_match');
//     }
// });

// router.get('/', (req, res) => {
//     if (req.session.user) 
//         res.redirect('/login');   
//     else{
//         let session = req.session;
//         let filters = req.session.filters;


//         // no filters 
//         if (filters.age == "None" && filters.orientation == "None" && filters.hobby == "None"){
//             res.send('you have no filters');
//         }
//         // all age filters
//         else if (filters.age != "None" && filters.orientation == "None" && filters.hobby == "None") {
//             res.send('you have the age filter');
//         }
//         else if (filters.age != "None" && filters.orientation != "None" && filters.hobby == "None") {

//         }
//         else if (filters.age != "None" && filters.hobby != "None" && filters.orientation == "None") {

//         }
//         // orienatation
//         else if (filters.orientation != "None" && filters.age == "None" && filters.hobby == "None") {

//         }
//         else if (filters.orientation != "None" && filters.hobby != "None" && filters.age == "None") {

//         }

//         // hobby 
//         else if (filters.hobby != "None" && filters.age == "None" && filters.orientation == "None") {

//         }
//         else{
//             age_min = 18;
//             age_max = 19;
//             connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`Orientation` = ? AND `users`.`username` != ? AND (`users`.`Age` >= ? AND `users`.`Age` <= ?) AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY `users`.`fame_rating` DESC", [req.session.filters.filter2, req.session.user, age_min, age_max, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3], (err, users) => {
//                 if (err) {
//                     console.log(err);
//                     console.log("Couldn't fetch usersH");
//                 }
//                 else {
//                     var x = 0;
//                     while (users[x]) {
//                         let latt = users[x].Latitude;
//                         let longg = users[x].Longitude;
//                         let mylatt = req.session.Latitude;
//                         let mylong = req.session.Longitude;
//                         if (latt == undefined) {
//                             latt = 0;
//                         }
//                         if (longg == undefined) {
//                             longg = 0;
//                         }
//                         if (mylatt == undefined) {
//                             mylatt = 0;
//                         }
//                         if (mylong == undefined) {
//                             mylong = 0;
//                         }
//                         var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
//                         var kilometers = meters / 1000;
//                         distance_array[x] = kilometers;
                        
//                         x++;
//                     }
                    
//                     var user_info = {
//                         'username' : req.session.user,
//                         'Email' : req.session.Email,
//                         'Firstname' : req.session.Firstname,
//                         'Lastname' : req.session.Lastname,
//                         'profile_pic' : req.session.profile_pic,
//                         'complete' : req.session.complete
//                     }
//                     var complete = 0;
//                     if (req.session.complete) complete = 1;
//                     res.render('search_match', {results: users, user : user_info,
//                         complete : complete, filters : req.session.filters,
//                         distance : distance_array});
//                 }
//             })
//         }
//     }
// });

router.get('/', (req, res) => {
    if (req.session.user && req.session) {

        connection.query('SELECT * FROM user_filters WHERE username= ?', [req.session.user], (err1, rows1) => {
            if (err1) console.log(err1);
            else
            {
                let filter3 = "#" + rows1[0].Hobby;
                req.session.filters = {
                    'filter3' : filter3
                }
                           
                let age_min;
                let age_max;
                let distance_array = [];

                if (rows1[0].Age == "None" && rows1[0].Orientation == "None" && rows1[0].Hobby == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`,`users`.`Latitude`, `users`.`Longitude`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? ORDER BY `users`.`fame_rating` DESC", [req.session.user], (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
        
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
                else if (rows1[0].Age != "None" && rows1[0].Orientation == "None" && rows1[0].Hobby == "None") {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND `users`.`Age` >= ? AND `users`.`Age` <= ? ORDER BY `users`.`fame_rating` DESC", [req.session.user, age_min, age_max], (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Age == "None" && rows1[0].Orientation != "None" && rows1[0].Hobby == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`Orientation` = ? AND `users`.`username` != ? ORDER BY `users`.`fame_rating` DESC", [req.session.filters.filter2, req.session.user], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersC");
                        }
                        else {
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].age != "None" && rows1[0].Orientation != "None" && rows1[0].Hobby == "None") {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`Orientation` = ? AND `users`.`username` != ? AND `users`.`Age` >= ? AND `users`.`Age` <= ? ORDER BY `users`.`fame_rating` DESC", [req.session.filters.filter2, req.session.user, age_min, age_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersD");
                        }
                        else {
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                
                }

                else if (rows1[0].Hobby != "None" && rows1[0].Age == "None" && rows1[0].Orientation == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Gender`,`users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY `users`.`fame_rating` DESC", [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersE");
                        }
                        else {
                            req.session.search_results_backup = users;
                            
                           
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Hobby != "None" && rows1[0].Age == "None" && rows1[0].Orientation != "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) AND `users`.`Orientation` = ? ORDER BY `users`.`fame_rating` DESC", [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter2], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersF");
                        }
                        else {
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                           
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Hobby != "None" && rows1[0].Age != "None" && rows1[0].Orientation == "None") {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) AND (`users`.`Age` >= ? AND `users`.`Age` <= ?) ORDER BY `users`.`fame_rating` DESC", [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, age_min, age_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersG");
                        }
                        else {
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});;
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                           
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else
                {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`Orientation` = ? AND `users`.`username` != ? AND (`users`.`Age` >= ? AND `users`.`Age` <= ?) AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY `users`.`fame_rating` DESC", [req.session.filters.filter2, req.session.user, age_min, age_max, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersH");
                        }
                        else {
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
            }
        })
    }
    else {
        res.redirect('/login')
    }
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else{
        req.session.filters2 = {
            age: req.body.filter1,
            orientation: req.body.filter2,
            hobby: req.body.filter3,
            city: 'none'
        };
        session = req.session;
        
        let sql = 'UPDATE user_filters SET Age = ?, Orientation = ?, Hobby = ? WHERE username = ?';
        connection.query(sql, [req.body.filter1, req.body.filter2, req.body.filter3, session.user], (err) => {
            if (err) console.log(err); 
        });
        res.redirect('/search_match');
    }
});


module.exports = router;