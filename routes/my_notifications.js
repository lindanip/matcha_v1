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

router.get('/', (req, res) =>
{
    if (!req.session.user)
        res.redirect('/login');
    else
    {
        let { session } = req;

        connection.query('SELECT * FROM notifications WHERE sentto = ? ORDER BY id DESC', [session.user], (err, rows) => {
            if (err) console.log(err);
            else if (!rows[0])
                res.render('my_notifications', {session, notifications: 'none'});
            else{
                connection.query('UPDATE notifications SET seen = 1 WHERE sentto = ?', [req.session.user], (err) => {
                    if (err) console.log(err);
                    else
                        res.render('my_notifications', {session, notifications: rows});
                });     
            }
        });
    }
});

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else
    {
        console.log('inside delete request for the that part');
        console.log(req);
        connection.query('DELETE FROM notifications WHERE id = ?', [req.body.id], (err) => {
            if (err) console.log(err);
            else
                res.redirect('/my_notifications');
        });
    }
});

module.exports = router;