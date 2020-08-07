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

router.get('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else{
        let { session } = req;
        let { match_info } = session;
        const { user: username } = session;
        const { match_username } = match_info;
        

        let sql = 'SELECT * FROM views WHERE visitor = ? AND username = ?';
        connection.query(sql, [username, match_username], (err, row) => {
            if (err) res.redirect('/search_match');
            else{
                if (!row[0]){
                    sql = 'INSERT INTO views  (`username`, `visitor`) VALUES (?, ?)';
                    connection.query(sql, [match_username, username] , (err) => {
                        if (err) res.redirect('/search_match');
                    });
                }
            }
        });

        sql = 'SELECT * FROM connections WHERE username = ? AND connected_to = ? AND accepted = 1';
        connection.query(sql, [username, match_username], (err, row) => {
            if (err) res.redirect('/search_match');
            else{
                let connected, isliked;
                connected = row[0] ? 1 : 0;
                
                sql = 'SELECT * FROM likes WHERE username = ? AND theLiked = ?';
                connection.query(sql, [username, match_username], (err, row) => {
                    if (err) res.redirect('/search_match');
                    else isliked = row[0] ? 1 : 0;  
                });

                sql = 'SELECT * FROM blocks WHERE username = ? AND block_who = ?';
                connection.query(sql, [username, match_username], (err, row) => {
                    if (err) res.redirect('/search_match');
                    else {
                        console.log(session);
                        let blocked = row[0] ? 1 : 0;
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
        else req.session.pic = 1;

        req.session.match_info = match_info;
        res.redirect('/match_full_info');
    }
});


module.exports = router;
