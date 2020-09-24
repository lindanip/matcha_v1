const mysql = require('mysql');
const faker = require('faker');

const connection = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : ''
});

const resHandler = (err, dbName) => {
    if (err) console.log(err);
    console.log(`table ${dbName} created..`);
};

let sql = 'CREATE DATABASE IF NOT EXISTS matcha';
connection.query(sql, err => {
    if (err) console.log(err);
    console.log('database created..');
});

sql = 'CREATE TABLE IF NOT EXISTS matcha.users(id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY, username VARCHAR(255) NOT NULL, Firstname VARCHAR(255) NOT NULL, Lastname VARCHAR(255) NOT NULL,Age INT(11), Email VARCHAR(255) NOT NULL, Password VARCHAR(255) NOT NULL, Token VARCHAR(255) DEFAULT \'NULL\',Reset_token VARCHAR(255) DEFAULT \'NULL\', City VARCHAR(255),Longitude FLOAT DEFAULT 0, Latitude FLOAT DEFAULT 0,Gender VARCHAR(255), Orientation VARCHAR(255), Bio VARCHAR(1000), profile_pic VARCHAR(1000), Online INT(1) DEFAULT 0, Verify INT(1) DEFAULT 0, Complete INT(1) DEFAULT 0, last_seen VARCHAR(50),fame_rating INT(15) DEFAULT 0, block_status INT(2) DEFAULT 0,admin INT(1) DEFAULT 0)'; 
connection.query(sql, err => resHandler(err, 'Users'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.user_hobbies(id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY, username VARCHAR(255) NOT NULL, Hobby1 VARCHAR(25), Hobby2 VARCHAR(25), Hobby3 VARCHAR(25), Hobby4 VARCHAR(25), Hobby5 VARCHAR(25))';
connection.query(sql, err => resHandler(err, 'User_hobbies'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.user_filters(id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY, username VARCHAR(255) NOT NULL, Age VARCHAR(11), Fame_rating VARCHAR(11), City VARCHAR(11), Hobby1 VARCHAR(255), Hobby2 VARCHAR(255))';
connection.query(sql, err => resHandler(err, 'User_filters'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.messages (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, sentby VARCHAR(255) NOT NULL, sentto VARCHAR(255) NOT NULL, message VARCHAR(255) NOT NULL, msg_state VARCHAR(255) NOT NULL, date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)';
connection.query(sql, err => resHandler(err, 'Messages'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.socketid (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, soc_id VARCHAR(255) NOT NULL)';
connection.query(sql, err => resHandler(err, 'SocketId'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.images (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, image VARCHAR(1500) NOT NULL)';
connection.query(sql, err => resHandler(err, 'Images'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.views (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, visitor VARCHAR(255) NOT NULL)';
connection.query(sql, err => resHandler(err, 'Views'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.notifications (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, sentby VARCHAR(255) NOT NULL, sentto VARCHAR(255) NOT NULL, notification_message VARCHAR(255) NOT NULL, seen INT(11) DEFAULT 0)';
connection.query(sql, err => resHandler(err, 'Notifications'));


sql = 'CREATE TABLE IF NOT EXISTS matcha.connections (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, connected_to VARCHAR(255) NOT NULL, accepted INT(11) DEFAULT 0)';
connection.query(sql, err => resHandler(err, 'Connections'));

sql = 'CREATE TABLE IF NOT EXISTS matcha.blocks (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, block_who VARCHAR(255) NOT NULL, reason VARCHAR(500) NOT NULL, accepted INT(11) DEFAULT 0)';
connection.query(sql, err => resHandler(err,'Blocks'));

sql = 'INSERT INTO matcha.users (`username`, `Firstname`, `Lastname`, `Age`, `Email`, `Password`, `profile_pic`,verify, admin) VALUES ("Admin", "Admin", "Admin", 20, "Admin@mailinator.com", "$2a$12$gEZKQHTPp82XyZEz/XsWYen6r3RycFPVKyD3PsJF8t3aNM4OZmKli", "Uploads/stock_profile_pic.png", 1, 1)';
connection.query(sql, err => {
    if (err) console.log(err);
    console.log("Admin account created");
});

function random_gender(genders){
    return genders[Math.floor(Math.random() * genders.length)];
}

for(i = 0; i <= 500; i++)
{
    var randomName = faker.name.firstName();
    var surName = faker.name.lastName();
    var finalName = randomName.replace(/'/," ");
    var finalsurName = surName.replace(/'/," ");
    var age =  Math.floor((Math.random() * 82) + 18);
    var email = finalName + '.' + finalsurName + "@gmail.com";
    var pic = faker.image.avatar();
    var city = ['Hong Kong', 'Bangkok', 'London', 'Paris', 'New York City',
                'Tokyo', 'Rome', 'Miami', 'Amsterdam', 'Cape Town', 'Johannesburg',
                'Las Vegas', 'Barcelona', 'Madrid', 'Cairo', 'Pretoria']
    
    var finalCity = random_gender(city);
    var preferences = ['Female', 'Male', 'Bisexual'];
    var genders = ['Female', 'Male'];
    var finalPreference = random_gender(preferences);
    var finalGender = random_gender(genders);
    var fameRating = Math.floor(Math.random() * 100);

    sql = 
        "INSERT INTO matcha.users (username, Firstname, Lastname, Age, Email, City,"+
        " Orientation, Gender, profile_pic, fame_rating)" +
        " VALUES ('"+ finalName +"','"+ finalName +"','"+ finalsurName + 
        "','"+ age +"','"+ email +"','"+ finalCity +"','"+ finalPreference +
        "','"+ finalGender +"','"+ pic +"', "+ fameRating +")";
    
    connection.query(sql, err => {
        if (err) console.log(err);
    });

    var hobby1 = ['#soccer','#painting','#backpacking','#ziplining','#shell collecting','#archaeology','#reading','#horseback Riding','#traveling','#bowling','#Video game collecting','#running','#drag racing','#coding', '#music','#singing', '#watching spots', '#martial arts', '#baking', '#cooking'];
    var hobby2 = ['#soccer','#typing','#painting','#paintball','#gardening','#reading','#traveling','#bird watching','#running','#video game collecting','#drag racing','#coding', '#music','#singing', '#watching spots', '#martial arts', '#baking', '#cooking'];
    var hobby3 = ['#soccer','#painting','#reading','#traveling','#gun collecting','#running','#drag racing','#coding', '#music','#singing', '#watching spots', '#martial arts', '#baking', '#cooking'];
    var hobby4 = ['#soccer','#painting','#writing','#ballroom dancing','#gardening','#reading','#knitting','#traveling','#running','#drag racing','#coding', '#music','#mountain climbing','#singing', '#watching spots', '#martial arts', '#baking', '#cooking'];
    var hobby5 = ['#soccer','#lockpicking','#painting','#ziplining','#kite flying','#reading','#traveling','#running','#drag racing','#coding', '#music','#table tennis','#singing', '#sports', '#martial arts', '#baking', '#cooking'];

    var finalHobby1 = random_gender(hobby1);
    var finalHobby2 = random_gender(hobby2);
    var finalHobby3 = random_gender(hobby3);
    var finalHobby4 = random_gender(hobby4);
    var finalHobby5 = random_gender(hobby5);

    sql = "INSERT INTO matcha.user_hobbies (username, Hobby1, Hobby2, Hobby3, Hobby4, Hobby5) VALUES ('"+ finalName +"','"+ finalHobby1 +"','"+ finalHobby2 +"','"+ finalHobby3 +"', '"+ finalHobby4 +"', '"+ finalHobby5 +"')";
    connection.query(sql, err => {
        if (err) console.log(err);
    });

    sql = "INSERT INTO matcha.user_filters (username) VALUES ('"+ finalName + "')";
    connection.query(sql, err => {
        if (err) console.log(err);
    });
}

connection.end();
