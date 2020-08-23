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

router.get('/:key', (req, res) => {
    if (req.params.key)
    {
        let sql = 'SELECT Email FROM users WHERE Reset_token = ?';

        connection.query(sql, [req.params.key], (err, row) => {
            if (err) console.log(err);
            else if (!row[0])
                res.redirect('/login');
            else
            {
                console.log('inside reset.js');
                console.log(row);
                res.render('change_password', {user_email: row[0].Email, msg: 'none', error: 'none'});
            }
        });
    }
});

module.exports = router;



// router.use('/:key', (req, res) => {
//     if (req.params.key) {
//         var hash = bcrypt.hashSync(req.params.key, 12)
//         connection.query('UPDATE users SET Password = ?, Reset_token = \'NULL\' WHERE Reset_token = ?', [hash, req.params.key], (err) => {
//             if (err) {
//                 req.session.error = "Error."
//                 console.log("from reset.js, Couldn't update password")
//                 res.redirect('/login')
//             }
//             else {
//                 req.session.success = "Password succesfully changed"
//                 console.log('from reset.js, password sucessfully changed')
//                 res.redirect('/login')
//             }
//         })
//     }
//     else {
//         console.log('from reset.js, could not update database')
//         res.redirect('/login')
//     }
// })

// module.exports = router