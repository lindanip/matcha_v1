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
    else
    {
        let { session } = req;

        connection.query('SELECT * FROM notifications WHERE sentto = ?', [session.user], (err, rows) => {
            if (err) console.log(err);
            else if (!rows[0])
                res.render('notifications', {session, notifications: 'none'});
            else
                res.send(rows);
        });
    }
});

router.delete('/:id', (req, res) => {
    if (!req.seesion.user)
        res.redirect('/login');
    else
    {
        connection.query('DELETE FROM notifications WHERE id = ?', [req.params.id], (err, row) => {
            if (err) console.log(err);
            else if (!row[0])
                res.redirect('/my_notifactions');
            else
                res.render('/my_notifactions');
        });
    }
});

module.exports = router;