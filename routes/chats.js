const connection = require('../config/db');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    if (!req.session.user)
        res.redirect('/login');
    else{
        let { session } = req;
        let query = "SELECT * FROM connections WHERE username = ? AND accepted = 1";
        connection.query(query, [session.user], (err, row1) => {
            if (err) res.status(500).send("database error");
            else{
                query = "SELECT * FROM connections WHERE connected_to = ? AND accepted = 1";
                connection.query(query, [session.user], (err, row2) => {
                    if (err) res.status(500).send("database error");
                    else if (!row1 && !row2){
                        res.render('chats', {session, msg:'none', error:'none', result: "empty"});
                    }else{
                        let contact00 = row1[0] ? 'found' : 'none';
                        let contact11 = row2[0] ? 'found' : 'none';

                        res.render('chats', {session, msg:'none', error:'none',
                                                result: 'found',
                                                contact: row1, contact1: row2,
                                                contact00,
                                                contact11
                                            });
                    }
                });
            }
        });
    }
});

module.exports = router
