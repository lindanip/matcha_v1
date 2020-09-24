var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db');
var geo_tools = require('geolocation-utils');
const { NULL } = require('mysql/lib/protocol/constants/types');
var secretString = Math.floor((Math.random() * 10000) + 1);

router.get('/', (req, res) => {
    if (req.session.user && req.session) {

        connection.query('SELECT * FROM user_filters WHERE username= ?', [req.session.user], (err1, rows1) => {
            if (err1) console.log(err1);
            else
            {
                function resultJoin(result1, result2){
                    let x = 0;
                    let a = 0;
                    let lstpos = 0;
                    var newObj = {};
                    newObj = result1;
                    while (newObj[lstpos]){
                        lstpos++;
                    }
                //----Remove re-appearing users before joining results    
                    while (result2[a]){
                        while (result1[x]){
                            if (result1[x].id == result2[a].id && result2[a].id != -2){
                                result2[a].id = -2;
                            }
                            x++;
                        }
                        x = 0;
                        a++;
                    }
                    a = 0;
                    while (result2[a]){
                        if (result2[a].id != -2){
                            newObj[lstpos] = result2[a];
                            lstpos++;
                        }
                        a++;
                    }
                    return newObj;
                }
                if (rows1[0].Hobby1 != "None"){
                    let filter3 = "#" + rows1[0].Hobby1;
                        req.session.filters = {
                        'filter3' : filter3
                    }
                }
                if (rows1[0].Hobby2 != "None"){
                    let filter4 = "#" + rows1[0].Hobby2;
                        req.session.filters = {
                        'filter4' : filter4
                    }
                }

                let fame_min;
                let fame_max;
                let age_min;
                let age_max;
                let distance_array = [];
//                                   ----------------------All blank------------------------------
                if (rows1[0].Age == "None" && rows1[0].Fame_rating == "None" && rows1[0].Hobby1 == "None" && rows1[0].Hobby2 == "None" && rows1[0].City == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`,"+
                                    "`users`.`block_status`,`users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`,"+
                                    "`users`.`Latitude`, `users`.`Longitude`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`,"+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN"+
                                    " `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? "+
                                    "AND `users`.`block_status` = 0 ORDER BY"+
                                    " `users`.`fame_rating` DESC", [req.session.user], (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
        
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
//--------------------------------------------------Age Only-------------------------------------

                else if (rows1[0].Age != "None" && rows1[0].Fame_rating == "None") {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,`users`.`fame_rating`,"+
                                    "`users`.`block_status`, `users`.`Lastname`,`users`.`Age`,`users`.`Orientation`,`users`.`Bio`,`users`.`profile_pic`,"+
                                    "`user_hobbies`.`Hobby1`,`user_hobbies`.`Hobby2`,`user_hobbies`.`Hobby3`,`user_hobbies`.`Hobby4`,"+
                                    "`user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` "+
                                    "WHERE `users`.`username` != ? AND `users`.`block_status` = 0 AND `users`.`Age` >= ? AND `users`.`Age` <= ? ORDER BY `users`.`fame_rating` DESC",
                                    [req.session.user, age_min, age_max], (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
 //---------------------------------------------------Both Hobbies----------------------------------------               
                else if (rows1[0].Hobby1 != "None" && rows1[0].Hobby2 != "None"){
                    connection.query("SELECT `users`.`id`, `users`.`username`,`users`.`last_seen`,`users`.`Firstname`, `users`.`fame_rating`, `users`.`Lastname`, "+
                                    "`users`.`block_status`,`users`.`Age`, `users`.`Gender`,`users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, "+
                                    "`user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, "+
                                    "`user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON "+
                                    "`users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND `users`.`block_status` = 0 AND"+
                                    "(`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? "+
                                    "OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY `users`.`fame_rating` DESC",
                                    [req.session.user, req.session.filters.filter4, req.session.filters.filter4, req.session.filters.filter4,
                                    req.session.filters.filter4, req.session.filters.filter4], (err, usersB) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersE");
                        }
                        else {
                            if (rows1[0].Hobby1 != "None"){
                                let filter3 = "#" + rows1[0].Hobby1;
                                    req.session.filters = {
                                    'filter3' : filter3
                                }
                            }
                            connection.query("SELECT `users`.`id`,`users`.`username`,`users`.`last_seen`,`users`.`Firstname`, `users`.`Lastname`, "+
                                        "`users`.`block_status`,`users`.`Age`, `users`.`Gender`,`users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, "+
                                        "`user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, "+
                                        "`user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON "+
                                        "`users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND "+
                                        "`users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? "+
                                        "OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY `users`.`fame_rating` DESC",
                                        [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, 
                                            req.session.filters.filter3, req.session.filters.filter3], (err, usersA) => {
                                if (err) {
                                    console.log(err);
                                    console.log("Couldn't fetch usersE");
                                }
                                else {
                                    var users = resultJoin(usersA, usersB);
                                    
                                    req.session.search_results_backup = users;
                            
                                    var x = 0;
                                    while (users[x]) {
                                        let match_username = users[x].username;
                                        let latt = users[x].Latitude;
                                        let longg = users[x].Longitude;
                                        let mylatt = req.session.Latitude;
                                        let mylong = req.session.Longitude;
                                        if (latt == undefined) {
                                            latt = 0;
                                        }
                                        if (longg == undefined) {
                                            longg = 0;
                                        }
                                        if (mylatt == undefined) {
                                            mylatt = 0;
                                        }
                                        if (mylong == undefined) {
                                            mylong = 0;
                                        }
                                        var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                        var kilometers = meters / 1000;
                                        distance_array[x] = kilometers;
                                        
                                        x++;
                                    }
                                    var user_info = {
                                        'username' : req.session.user,
                                        'Email' : req.session.Email,
                                        'Firstname' : req.session.Firstname,
                                        'Lastname' : req.session.Lastname,
                                        'profile_pic' : req.session.profile_pic,
                                        'complete' : req.session.complete
                                    }
                                    var complete = 0;
                                    if (req.session.complete) {
                                        complete = 1;
                                    }
                                    res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});

                                }
                            })
                        }
                    })
                }
//-----------------------------------------------------------City Only------------------------------------------------
                else if (rows1[0].Age == "None" && rows1[0].Fame_rating == "None" && rows1[0].Hobby1 == "None" && rows1[0].Hobby2 == "None" && rows1[0].City){
                    let find_city;
                    if (rows1[0].City == "Hong Kong") find_city = "Hong Kong";
                    else if (rows1[0].City == "Bangkok") find_city = "Bangkok";
                    else if (rows1[0].City == "London") find_city = "London";
                    else if (rows1[0].City == "Paris") find_city = "Paris";
                    else if (rows1[0].City == "New York City") find_city = "New York City";
                    else if (rows1[0].City == "Tokyo") find_city = "Tokyo";
                    else if (rows1[0].City == "Rome") find_city = "Rome";
                    else if (rows1[0].City == "Miami") find_city = "Miami";
                    else if (rows1[0].City == "Amsterdam") find_city = "Amsterdam";
                    else if (rows1[0].City == "Cape Town") find_city = "Cape Town";
                    else if (rows1[0].City == "Johannesburg") find_city = "Johannesburg";
                    else if (rows1[0].City == "Las Vegas") find_city = "Las Vegas";
                    else if (rows1[0].City == "Barcelona") find_city = "Barcelona";
                    else if (rows1[0].City == "Madrid") find_city = "Madrid";
                    else if (rows1[0].City == "Cairo") find_city = "Cairo";
                    else{
                        find_city = "Pretoria";
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                    "`users`.`fame_rating`,`users`.`block_status`,`users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, "+
                                    "`users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, "+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` "+
                                    "INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE "+
                                    "`users`.`City` = ? AND `users`.`username` != ? AND `users`.`block_status`= 0", 
                                    [find_city, req.session.user], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch City");
                        }
                        else {
                            console.log("Fetching City");
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});

                        }
                    })
                }
// ------------------------------------------------------------Fame Only---------------------------------------------------

                else if (rows1[0].Age == "None" && rows1[0].Fame_rating != "None" && rows1[0].Hobby1 == "None" && rows1[0].Hobby2 == "None") {
                    if (rows1[0].Fame_rating == "0-10"){
                        fame_min = 0;
                        fame_max = 10;
                    }
                    else if (rows1[0].Fame_rating == "11-50"){
                        fame_min = 11;
                        fame_max = 50;
                    }
                    else if (rows1[0].Fame_rating == "51-100"){
                        fame_min = 51;
                        fame_max = 100;
                    }
                    else if (rows1[0].Fame_rating == "101-Above"){
                        fame_min = 101;
                        fame_max = 1000000;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                    "`users`.`fame_rating`,`users`.`block_status`,`users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, "+
                                    "`users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, "+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` "+
                                    "INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE "+
                                    "`users`.`Fame_rating` >= ? AND `users`.`Fame_rating` <= ? AND `users`.`username` != ? AND "+
                                    "`users`.`block_status`= 0", [fame_min, fame_max, req.session.user], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersC");
                        }
                        else {
                            console.log("Fame Range Only");
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
                //-----------------------------------------Age and Fame------------------------------------
                
                else if (rows1[0].age != "None" && rows1[0].Fame_rating != "None" && rows1[0].Hobby1 == "None" && rows1[0].Hobby2 == "None") {
                    if (rows1[0].Fame_rating == "0-10"){
                        fame_min = 0;
                        fame_max = 10;
                    }
                    else if (rows1[0].Fame_rating == "11-50"){
                        fame_min = 11;
                        fame_max = 50;
                    }
                    else if (rows1[0].Fame_rating == "51-100"){
                        fame_min = 51;
                        fame_max = 100;
                    }
                    else if (rows1[0].Fame_rating == "101-Above"){
                        fame_min = 101;
                        fame_max = 1000000;
                    }

                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    else if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    else if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    else if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    else if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    else if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    else if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    else if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`, "+
                                    "`users`.`fame_rating`, `users`.`block_status`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, "+
                                    "`users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, "+
                                    "`user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON "+
                                    "`users`.`username` = `user_hobbies`.`username` WHERE (`users`.`Fame_rating` >= ? AND `users`.`Fame_rating` <= ?)"+
                                    " AND `users`.`username` != ? AND `users`.`block_status` = 0 AND (`users`.`Age` >= ? AND `users`.`Age` <= ?)",
                                    [fame_min, fame_max, req.session.user, age_min, age_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersD");
                        }
                        else {
                            console.log("Fame and Age");
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                
                }
//                   --------------------------------------Hobby 1 Only---------------------------------------------

                else if (rows1[0].Hobby1 != "None" && rows1[0].Hobby2 == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Firstname`, `users`.`Lastname`, "+
                                    "`users`.`Age`, `users`.`fame_rating`,`users`.`block_status`,`users`.`Gender`,`users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, "+
                                    "`user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, "+
                                    "`user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON "+
                                    "`users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND "+
                                    "`users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? "+
                                    " OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY `users`.`fame_rating` DESC",
                                    [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3,
                                    req.session.filters.filter3, req.session.filters.filter3], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersE");
                        }
                        else {
                            console.log("Searching using single Hobby");
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
//                  ---------------------------------------Hobby 2 Only----------------------------------------

                else if (rows1[0].Hobby2 != "None" && rows1[0].Hobby1 == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`, "+
                                    "`users`.`fame_rating`,`users`.`block_status`,`users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, "+
                                    "`users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, "+
                                    "`user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON "+
                                    "`users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND "+
                                    "`users`.`block_status` = 0 AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR "+
                                    "`user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)"+
                                    "ORDER BY `users`.`fame_rating` DESC", [req.session.user, req.session.filters.filter4,
                                     req.session.filters.filter4, req.session.filters.filter4, req.session.filters.filter4, 
                                     req.session.filters.filter4], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersF");
                        }
                        else {
                            console.log("Hobby 2 Only");
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                           
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }                
            }
        })
    }
    else {
        res.redirect('/login')
    }
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else{
        req.session.filters2 = {
            age: req.body.filter1,
            fame_rating: req.body.filter2,
            hobby1: req.body.filter3,
            hobby2: req.body.filter4,
            city: req.body.filter5
        };
        session = req.session;
        
        let sql = 'UPDATE user_filters SET Age = ?, Fame_rating = ?, City = ?, Hobby1 = ?, Hobby2 = ? WHERE username = ?';
        connection.query(sql, [req.body.filter1, req.body.filter2, req.body.filter5, req.body.filter3, req.body.filter4, session.user],
        (err) => {
            if (err) console.log(err);
        });
        res.redirect('/search_match');
    }
});


module.exports = router;