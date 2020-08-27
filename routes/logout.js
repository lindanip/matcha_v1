var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db')
var get_date = require('get-date')

router.get('/', (req, res) => {
    if (req.session && req.session.user)
    {
        let dateObj = new Date();
        
        let date = ('0' + dateObj.getDate()).slice(-2);
        let month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        let year = dateObj.getFullYear();
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        let seconds = dateObj.getSeconds();

        let fullDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`

        connection.query('UPDATE users SET Online = 0 WHERE username = ?', [req.session.user], (err) => {
            if (err) console.log(err)
        })
        connection.query('UPDATE users SET last_seen = ? WHERE username = ?', [fullDateTime, req.session.user], (err) => {
            if (err) console.log(err)
        })
    }
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router