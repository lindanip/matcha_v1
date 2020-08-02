var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/', function(req, res) {
    if (req.session && req.session.user){
        var user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'longitude' : req.session.Longitude,
            'latitude' : req.session.Latitude,
            'complete' : req.session.complete
        }

        connection.query('SELECT * FROM `blocks` INNER JOIN `users` ON `blocks`.`username` = `users`.`username` WHERE `blocks`.`accepted` = 0', (err, row1) => {
            if (err) console.log(err)
            else
            {
                if (row1[0])
                {
                        connection.query('SELECT * FROM `blocks` INNER JOIN `users` ON `blocks`.`block_who` = `users`.`username` WHERE `blocks`.`accepted` = 0', (err, result) => {
                            if (err) console.log(err)
                            else
                            {
                                if (result[0])
                                {
                                    res.render('block_requests', {user : user_info, blocker : row1, blockee : result})
                                }
                            }
                        })     
                }
                else
                {
                    res.render('block_requests', {blocker : "none", user : user_info, blocker : "none", blockee : "none"})
                }   
                    
            }
        })
    }
    else
        res.redirect('/login');
})

module.exports = router