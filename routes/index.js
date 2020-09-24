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
                                let suggResults = new Array();
                                let r = 0;
                                let indx = 0;
                                sql = 
                                        'SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`block_status`,`users`.`Firstname`,' +
                                        ' `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`,' +
                                        ' `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM ' +
                                        '`users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE ' +
                                        ' `users`.`username` != ? AND `users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR ' +
                                        '`user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)';
                                
                                connection.query(sql, [session.user, Hobby1, Hobby1, Hobby1, Hobby1, Hobby1], (err, suggByHobby1) => {
                                    if (err) res.status(500).send('internal server error');
                                    else{
                                        if (suggByHobby1){
                                            while (suggByHobby1[r]){
                                                suggResults[r] = suggByHobby1[r];
                                                r++;
                                            }
                                            indx = r;
                                            r = 0;
                                        }
                                        sql = 
                                                'SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`Firstname`,' +
                                                ' `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `users`.block_status, `user_hobbies`.`Hobby1`,' +
                                                ' `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM ' +
                                                '`users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE ' +
                                                ' `users`.`username` != ? AND `users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR ' +
                                                '`user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)';

                                        connection.query(sql, [session.user, Hobby2, Hobby2, Hobby2, Hobby2, Hobby2], (err, suggByHobby2) => {
                                            if (err) res.status(500).send('internal server error');
                                            else{
                                                if (suggByHobby2){
                                                    while (suggByHobby2[r]){
                                                        suggResults[indx] = suggByHobby2[r];
                                                        r++;
                                                        indx++;
                                                    }
                                                    r = 0;
                                                }
                                                sql = 
                                                        'SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`block_status`,`users`.`Firstname`,' +
                                                        ' `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`,' +
                                                        ' `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM ' +
                                                        '`users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE ' +
                                                        ' `users`.`username` != ? AND `users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR ' +
                                                        '`user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)';

                                                connection.query(sql, [session.user, Hobby3, Hobby3, Hobby3, Hobby3, Hobby3], (err, suggByHobby3) => {
                                                    if (err) res.status(500).send('internal server error');
                                                    else{
                                                        if (suggByHobby3){
                                                            while (suggByHobby3[r]){
                                                                suggResults[indx] = suggByHobby3[r];
                                                                r++;
                                                                indx++;
                                                            }
                                                            r = 0;
                                                        }
                                                        sql = 
                                                                'SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`block_status`,`users`.`Firstname`,' +
                                                                ' `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`,' +
                                                                ' `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM ' +
                                                                '`users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE ' +
                                                                ' `users`.`username` != ? AND `users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR ' +
                                                                '`user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)';

                                                        connection.query(sql, [session.user, Hobby4, Hobby4, Hobby4, Hobby4, Hobby4], (err, suggByHobby4) => {
                                                            if (err) res.status(500).send('internal server error');
                                                            else{
                                                                if (suggByHobby4){
                                                                    while (suggByHobby4[r]){
                                                                        suggResults[indx] = suggByHobby4[r];
                                                                        r++;
                                                                        indx++;
                                                                    }
                                                                    r = 0;
                                                                }
                                                                sql = 
                                                                        'SELECT `users`.`username`,`users`.`Gender`,`users`.`last_seen`,`users`.`fame_rating`,`users`.`block_status`,`users`.`Firstname`,' +
                                                                        ' `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`,' +
                                                                        ' `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM ' +
                                                                        '`users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE ' +
                                                                        ' `users`.`username` != ? AND `users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR ' +
                                                                        '`user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)';

                                                                connection.query(sql, [session.user, Hobby5, Hobby5, Hobby5, Hobby5, Hobby5], (err, suggByHobby5) => {
                                                                    if (err) res.status(500).send('internal server error');
                                                                    else{
                                                                        if (suggByHobby5){
                                                                            while (suggByHobby5[r]){
                                                                                suggResults[indx] = suggByHobby5[r];
                                                                                r++;
                                                                                indx++;
                                                                            }
                                                                            r = 0;
                                                                        }
//--------------------------------------------------------------------------------Removing Users Who Appear more than once in suggResult Array----------------------------------------
                                                                        
                                                                        //indx = indx - 1; <----REMEMBER!!
                                                                        let b = 0;
                                                                        let tempR;
                                                                        let a = 0;
                                                                        tempR = suggResults[b];                                                                    
                                                                        while (b < indx)
                                                                        {
                                                                            while (suggResults[r]){
                                                                                if (suggResults[r].username == tempR.username){
                                                                                    a++;
                                                                                    if (a == 2) suggResults[r].username = "Re-appearing";
                                                                                }
                                                                                r++;
                                                                            }
                                                                            a = 0;
                                                                            r = 0;
                                                                            b++;
                                                                            tempR = suggResults[b];
                                                                        }
                                                                        res.render('index', {session, connections, suggestions: suggResults});
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
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;


router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else{
        req.session.filters2 = {
            age: req.body.filter1,
            fame_rating: req.body.filter2,
            hobby1: req.body.filter3,
            hobby2: req.body.filter4
        };
        session = req.session;
        
        res.redirect('/index');
    }
});

