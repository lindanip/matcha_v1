const connection = require('../config/db');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    if (!req.session && !req.session.user)
        res.redirect('/login');
    else{
        const user = req.session.user;
        var query = "SELECT * FROM connections WHERE username = ? AND accepted = 1";
        connection.query(query, [user], (err, row) => {
            if (err){
                console.log("database error");
                res.status(400).send("database error");
            }else{
                if (!row){
                    console.log("somthing went wrong");
                    res.render('chats', {result: "empty"});
                }else{
                    var iter = (row) => {
                        var i = 0;
                        while (row[i])
                             i++;
                        return i;
                    }
                    var num = iter(row);
                    if (num > 0)
                        res.render('chats', {result: 'found', no: num, contact: row});
                    else
                        res.render('chats', {result: 'non', no: num, contact: row});
                }
            }
        })
    }
});

module.exports = router
