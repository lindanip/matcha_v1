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
    else
    {
        let { session } = req;
        let { match_info } = session;
        const { user: username } = session;
        const { match_username } = match_info;
        
        let sql = 'SELECT * FROM views WHERE visitor = ? AND username = ?';
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
                let isliked;
                
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
                        
                        res.render('match_full_info', { session, match_info, isliked, connected, blocked });
                    }
                });
            }
        });
    }
});

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.body.match_username)
        res.redirect('/search_match');
    else{
        let {session, body: match_info} = req;
        
        if (session.profile_pic == "Uploads/stock_profile_pic.png")
            req.session.pic = 0;
        else
            req.session.pic = 1;

        req.session.match_info = match_info;
        res.redirect('/match_full_info');
    }
});


module.exports = router;
