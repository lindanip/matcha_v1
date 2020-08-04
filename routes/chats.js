const connection = require('../config/db');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) =>{
    if (!req.session.user)
        res.redirect('/login');
    else{
        let session = req.session;
        var query = "SELECT * FROM connections WHERE username = ? AND accepted = 1";
        connection.query(query, [session.user], (err, row) => {
            if (err){
                res.status(400).send("database error");
            }else{
                if (!row){
                    res.render('chats', {session, msg:'none', error:'none', result: "empty"});
                }else{
                    var iter = (row) => {
                        var i = 0;
                        while (row[i])
                             i++;
                        return i;
                    }
                    var num = iter(row);
                    if (num > 0)
                        res.render('chats', {session, msg:'none', error:'none',
                                            result: 'found', no: num, contact: row});
                    else
                        res.render('chats', {session, msg:'none', error:'none', 
                                            result: 'non', no: num, contact: row});
                }
            }
        })
    }
});

module.exports = router
