var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db')
var get_date = require('get-date')

router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        connection.query('UPDATE users SET Online = 0 WHERE username = ?', [req.session.user], (err) => {
            if (err) console.log(err)
        })
        connection.query('UPDATE users SET last_seen = ? WHERE username = ?', [get_date(), req.session.user], (err) => {
            if (err) console.log(err)
        })
    }
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router