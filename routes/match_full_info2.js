const express = require('express');
const router = express.Router();
const connection = require('../config/db')
const session = require('express-session')
const secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.query.match_username)
        res.status(401).redirect('/'); // unauthorized
    else
    {
        let { session } = req;
        const { user: username } = session;
        let  { match_username } = req.query;
        let match_info = 'none';
        
        let sql =   'SELECT users.username, users.Firstname, users.Lastname, users.Age, users.City, users.Gender, users.Orientation,'+
                    'users.Bio, users.profile_pic, users.last_seen, users.fame_rating, user_hobbies.Hobby1, user_hobbies.Hobby2,'+
                    'user_hobbies.Hobby3, user_hobbies.Hobby4, user_hobbies.Hobby5 FROM users INNER JOIN user_hobbies ON '+
                    'users.username = user_hobbies.username WHERE users.username = ?' ;

        connection.query(sql, [match_username], (err, row) => {
            if (err) console.log(err);
            else if (!row[0])
                res.send('this user dont exist');
            else 
            {
                match_info = row[0];
                console.log('34567890-');
                console.log(match_info);
            }
        });

        sql = 'SELECT * FROM views WHERE visitor = ? AND username = ?';
        connection.query(sql, [username, match_username], (err, row) => {
            if (err) res.status(500).send('internal server error');
            else{
                if (!row[0])
                {
                    sql = 'INSERT INTO views  (`username`, `visitor`) VALUES (?, ?)';
                    connection.query(sql, [match_username, username] , (err) => {
                        if (err) res.status(500).send('internal server error');
                    });
                }
            }
        });

        sql = 'SELECT * FROM connections WHERE username = ? AND connected_to = ?';
        connection.query(sql, [username, match_username], (err, row) => {
            if (err) res.status(500).send('internal server error');
            else
            {
                let connected = 0;
                console.log('35678ghgghghghgjhghjg77689uiuhvhhbhbhb....................-');
                console.log(match_info);
                
                if (row[0])
                    connected = (row[0].accepted == '0') ? -1 : 1;
                else
                {
                    sql = 'SELECT * FROM connections WHERE username = ? AND connected_to = ?';
                    connection.query(sql, [match_username, username], (err, row) => {
                        if (err) res.status(500).send('internal server error');
                        else
                            if (row[0])
                                connected = (row[0].accepted == '0') ? -2 : 1;
                    });   
                }

                sql = 'SELECT * FROM blocks WHERE username = ? AND block_who = ?';
                connection.query(sql, [username, match_username], (err, row) => {
                    if (err) res.status(500).send('internal server error');
                    else {
                        let blocked = 0;
                        
                        if (row[0])
                            blocked = (row[0].accepted == '0') ? -1 : 1;
                        
                        res.render('match_full_info2', { session, match_info, connected, blocked });
                    }
                });
            }
        });
    }
});

module.exports = router;