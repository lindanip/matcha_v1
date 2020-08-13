const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const session = require('express-session');
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


router.get('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else
    {
        let { session } = req;
        let connections = 'none';
        let suggestions = 'This varible yes its not used but, but part for the returned object. please check res.render';

        let sql = "SELECT * FROM user_hobbies WHERE username = ?";

        connection.query(sql, [session.user], (err, myHobbiesRow) => {
            if (err) res.status(500).send('internal server error');
            else
            {
                //myHobbies = myHobbiesRow[0] ? myHobbiesRow[0] : 'none';
                let myHobbies = myHobbiesRow[0];

                sql =
                        "SELECT * FROM connections INNER JOIN `users` ON `connections`.`connected_to` = `users`.`username` JOIN " +
                        "`user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `connections`.`username` = ? AND " + 
                        " `connections`.`accepted` = 1";
                
                connection.query(sql, [session.user], (err, connectionsRow1) => {
                    if (err) res.status(500).send('internal server error');
                    else
                    {
                        connections = connectionsRow1[0] ? connectionsRow1 : 'none';
                        sql = 
                                "SELECT * FROM connections INNER JOIN `users` ON `connections`.`username` = `users`.`username` JOIN " +
                                "`user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `connections`.`connected_to` = ? AND " + 
                                " `connections`.`accepted` = 1";
                        
                        connection.query(sql, [session.user], (err, connectionsRows2) => {
                            if (err) res.status(500).send('internal server error');
                            else
                            {
                                if (connectionsRows2[0])
                                {
                                    if (connections == 'none')
                                        connections = connectionsRows2
                                    else{
                                        let i = 0;
                                        while(connectionsRows2[i]){
                                            if (connectionsRows2[i])
                                                connections.push(connectionsRows2[i])
                                            i++;
                                        }
                                    }
                                }

                                let { Hobby1, Hobby2, Hobby3, Hobby4, Hobby5 } = myHobbies; 

                                sql = 
                                        'SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`Firstname`,' +
                                        ' `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`,' +
                                        ' `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM ' +
                                        '`users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE ' +
                                        ' `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR ' +
                                        '`user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)' +
                                        ' ORDER BY RAND() LIMIT 5';
                                
                                connection.query(sql, [session.user, Hobby1, Hobby2, Hobby3, Hobby4, Hobby5], (err, suggByHobbyRow) => {
                                    if (err) res.status(500).send('internal server error');
                                    else
                                    {
                                        if (suggByHobbyRow[0]) res.render('index', {session, connections,
                                                                            suggestions: suggByHobbyRow});
                                        else
                                        {
                                            sql = 
                                                    'SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, ' +
                                                    '  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`,' +
                                                    ' `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON ' +
                                                    '`users`.`username` = `user_hobbies`.`username` WHERE `users`.`City` = ? AND `users`.`username` != ? ' +
                                                    'ORDER BY RAND() LIMIT 5';

                                            connection.query(sql, [session.city, session.user], (err, suggByCityRows) => {
                                                if (err) res.status(500).send('internal server error');
                                                else{
                                                    if (suggByCityRows[0])
                                                        res.render('index', {session, connections,
                                                                        suggestions : suggByCityRows});
                                                    else
                                                    {
                                                        sql = 
                                                                'SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, ' +
                                                                '  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`,' +
                                                                ' `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON ' +
                                                                '`users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? ' +
                                                                'ORDER BY RAND() LIMIT 5';

                                                        connection.query(sql, [session.user], (err, suggNotByFiltersRows) => {
                                                            if (err) res.status(400).send('internal server error');
                                                            else{
                                                               if (suggNotByFiltersRows[0]){
                                                                    res.render('index', {session, connections,
                                                                                suggestions: suggNotByFiltersRows});
                                                                        
                                                                }
                                                                else
                                                                    res.send('DEAD END! you are now all alone in darkness, this app does not have users....');
                                                                    // this app is not supposed to reach this else statement.
                                                                    // you will be reported to authory if it does.
                                                            }
                                                        });
                                                    }
                                                }
                                            })
                                        }
                                    }
                                });                                 
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;
































// router.get('/', function(req, res) {
//     if (req.session && req.session.user) { 
//         connection.query("SELECT * FROM connections INNER JOIN `users` ON `connections`.`connected_to` = `users`.`username` JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `connections`.`username` = ? AND `connections`.`accepted` = 1", [req.session.user], (err, row) => {
//             if (err)
//                 res.send("An error has occurred!");
//             else
//             {
//                 if (row[0]) {
//                             var user_info = {
//                                 'username' : req.session.user,
//                                 'Email' : req.session.Email,
//                                 'Firstname' : req.session.Firstname,
//                                 'Lastname' : req.session.Lastname,
//                                 'profile_pic' : req.session.profile_pic,
//                                 'longitude' : req.session.Longitude,
//                                 'latitude' : req.session.Latitude,
//                                 'gender' : req.session.Gender,
//                                 'complete' : req.session.complete
//                             }
//                             connection.query('SELECT `user_hobbies`.`username`, `users`.`Age`, `users`.`profile_pic`,`user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `user_hobbies` INNER JOIN `users` ON `user_hobbies`.`username` = `users`.`username` WHERE `user_hobbies`.`username` = ?', [req.session.user], (err, row1) => {
//                                 if (err) console.log(err)
//                                 else
//                                 {
//                                     if (row1[0])
//                                     {
//                                         connection.query('SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY RAND() LIMIT 5', [req.session.user, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1], (err, result) => {
//                                             if (err) console.log(err)
//                                             else
//                                             {
//                                                 if (result[0]) {
//                                                     res.render('index', {title: 'Express', user : user_info, connections : row, suggestions : result});
//                                                 }
//                                                 else { 
//                                                     connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`City` = ? AND `users`.`username` != ? ORDER BY RAND() LIMIT 5', [req.session.city, req.session.user], (err3, result2) => {
//                                                         if (err3) console.log(err)
//                                                         else
//                                                         {
//                                                             console.log('entered other loop');
//                                                             if (result2[0]) {
//                                                                 res.render('index', {title: 'Express', user : user_info, connections : row, suggestions : result2});
//                                                             }
//                                                             else
//                                                                 res.render('index', {title: 'Express', user : user_info, connections : row, suggestions : "none"});
//                                                         }
//                                                     })
//                                                 }
//                                             }
                                            
//                                         })
//                                     }
//                                     else
//                                         res.render('index', {title: 'Express', user : user_info, connections : row});
//                                 }
//                             }) 
//                 }
//                 else
//                 {
//                     console.log("Major loop 2");
//                     var user_info = {
//                         'username' : req.session.user,
//                         'Email' : req.session.Email,
//                         'Firstname' : req.session.Firstname,
//                         'Lastname' : req.session.Lastname,
//                         'profile_pic' : req.session.profile_pic,
//                         'longitude' : req.session.Longitude,
//                         'latitude' : req.session.Latitude,
//                         'complete' : req.session.complete
//                     }
//                     connection.query('SELECT `user_hobbies`.`username`, `users`.`Age`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `user_hobbies` INNER JOIN `users` ON `user_hobbies`.`username` = `users`.`username` WHERE `user_hobbies`.`username` = ?', [req.session.user], (err, row1) => {
//                         if (err) console.log(err)
//                         else
//                         {
//                             if (row1[0])
//                             {
                                
//                                 connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY RAND() LIMIT 5', [req.session.user, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1], (err, result) => {
//                                     if (err) console.log(err)
//                                     else
//                                     {
//                                         if (result[0]) {
//                                             res.render('index', {title: 'Express', user : user_info, suggestions : result, connections : "none"});
//                                         }
//                                         else {
                  
//                                             connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`City` = ? AND `users`.`username` != ? ORDER BY RAND() LIMIT 5', [req.session.city, req.session.user], (err3, result2) => {
//                                                 if (err3) console.log(err)
//                                                 else
//                                                 {
//                                                     console.log('entered other loop');
//                                                     if (result2[0]) {
//                                                         res.render('index', {title: 'Express', user : user_info, suggestions : result2, connections : "none"});
//                                                     }
//                                                     else
//                                                     {
//                                                         res.render('index', {title: 'Express', user : user_info, suggestions : "none", connections : "none"});
//                                                     }
//                                                 }
//                                             })
                                            
//                                         }
//                                         // res.render('index', {title: 'Express', user : user_info, connections : row});
//                                     }
                                    
//                                 })
//                             }
//                         }
//                     })
//                 }
                
                
//             }
//         })
//     }
//     else {
//         res.redirect('/login')
//     }
// });

// module.exports = router;
