const connection = require('./config/db');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const path = require('path');
const http = require('http');

const port = 4000 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socket(server);

const secretString = Math.floor((Math.random() * 10000) + 1);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: 'true'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


//new route to fetch_req

const return_cities = require('./routes/fetch_req/return_cities');
const fullProfile2 = require('./routes/match_full_info2');
const my_notifications = require('./routes/my_notifications');

//

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const forgotRouter = require('./routes/forgot');
const verifyRouter = require('./routes/Verify_email');
const resetRouter = require('./routes/reset');
const logoutRouter = require('./routes/logout');
const settingsRouter = require('./routes/settings');
const searchMatchRouter = require('./routes/search_match');
const myPicturesRouter = require('./routes/My_pictures');
const fullProfile = require('./routes/match_full_info');
const addConnection = require('./routes/add_connection');
const deleteConnection = require('./routes/delete_connection');
const acceptConnection = require('./routes/accept_connection');
const declineConnection = require('./routes/decline_connection');
const connectionRequests = require('./routes/connection_requests');
const uploadImages = require('./routes/upload_images');
const removeImage = require('./routes/remove_image');
const adminIndex = require('./routes/admin_index');
const allUsers = require('./routes/all_users');
const blockRequests = require('./routes/block_requests');
const blockUser = require('./routes/block_user');
const sendBlock = require('./routes/send_block');
const acceptBlock = require('./routes/accept_block');
const declineBlock = require('./routes/decline_block');
const profileViews = require('./routes/profile_views');
const chats = require('./routes/chats');
const messages = require('./routes/messages');
const change_password = require('./routes/change_password');

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/home/Uploads', express.static(path.join(__dirname, '/home/Uploads')));
app.use('/search/Uploads', express.static(path.join(__dirname, '/search/Uploads')));
app.use('/index_images', express.static(path.join(__dirname, 'index_images')));


//for testing
app.use('/fetch_req/return_cities', return_cities);
//end testing



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/forgot', forgotRouter);
app.use('/Verify_email', verifyRouter);
app.use('/reset', resetRouter);
app.use('/logout', logoutRouter);
app.use('/settings', settingsRouter);
app.use('/search_match', searchMatchRouter);
app.use('/My_pictures', myPicturesRouter);
app.use('/match_full_info', fullProfile);
app.use('/add_connection', addConnection);
app.use('/delete_connection', deleteConnection);
app.use('/accept_connection', acceptConnection);
app.use('/decline_connection', declineConnection);
app.use('/connection_requests', connectionRequests);
app.use('/upload_images', uploadImages);
app.use('/remove_image', removeImage);
app.use('/admin_index', adminIndex);
app.use('/all_users', allUsers);
app.use('/block_requests', blockRequests);
app.use('/block_user', blockUser);
app.use('/send_block', sendBlock);
app.use('/accept_block', acceptBlock);
app.use('/decline_block', declineBlock);
app.use('/profile_views', profileViews);
app.use('/chats', chats);
app.use('/messages', messages);
app.use('/change_password', change_password);

app.use('/match_full_info2', fullProfile2);
app.use('/my_notifications', my_notifications);

io.on('connection', (socket) =>
{
    let sql;

// -------------------------------- notifications -------------------------------------------

    // send notification to profile being viewed
    socket.on('profileView', params =>
    {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else{
                if (themStatusRow[0]){
                    io.to(themStatusRow[0].soc_id).emit('notProfileView', {match_username: me});
                    io.to(socket.id).emit('matchOnline', {match_username: them});
                }else
                    io.to(socket.id).emit('matchOffline', {match_username: them});
            }
        });
    });

    // send notification that your connection request was viewed
    socket.on('connectionRequestView', params => 
    {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0]){
                    io.to(themStatusRow[0].soc_id).emit('notYourRequestViewed', {match_username: me});
                    io.to(socket.id).emit('matchOnline', {match_username: them});
                }else
                    io.to(socket.id).emit('matchOffline', {match_username: them});
                // data must be stored to the database here 
        });
    });

    // send notification that you have a connection request
    socket.on('connectionReq', params =>
    {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notConnectionReq', {match_username: me});
                    // must be stored in the database here 
        });
    });

    // send a notification that your connection request is accepted
    socket.on('acceptConnectionReq', params =>
    {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notConnectionAccept', {match_username: me});
                    // must be stored in the database here
        });
    });

    // send a notification that your connection request is declined
    socket.on('declineConnectionReq', params =>
    {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notConnectionDecline', {match_username: me});
                    // must be stored in database
        });
    });

    // send a notification that your connection was removed
    socket.on('removeConnection', params =>
    {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('dtabase error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notDisconnection', {match_username: me});
                    //must be stored in the database
        });
    });

// --------------------------------------- end


// ```````````````````` create & store new sockets with matcha and tell everyone that im online```````````

    // insert or update socket id in database
    socket.on('notLoginReq', (params) =>
    {
        let sql = 'SELECT * FROM socketid WHERE username = ?';
        connection.query(sql, [params.me], (err, socketIdRow) =>
        {
            if (err) console.log(err)
            else if (socketIdRow[0])
            {
                sql = 'UPDATE socketid SET soc_id = ? WHERE username = ?';
                connection.query(sql, [socket.id, params.me], (err) => { if (err) console.log(err) });
            }
            else
            {
                sql = 'INSERT INTO socketid (username, soc_id) VALUES (?, ?)';
                connection.query(sql, [params.me, socket.id], (err) => { if (err) console.log(err) });
            }
            
            io.to(socket.id).emit('notLoginRes', params.me);
            io.sockets.emit('broadcast1', {username: params.me});
        });
    });


// ```````````````````````````````` end

// ###################### message part

    // send a notification that message has been seen
    socket.on('chatMsgSeen', params =>
    {
        let { me, them, msg } = params;
        console.log(params)

        // a select from the messages database so that is doesnt show viewing when there is no message
        // i think this may need to be done for more functions

        sql = 'UPDATE messages SET msg_state = 1 WHERE sentto = ?';

        connection.query(sql, [me], err => { if (err) console.log(err) });

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log(err);
            else
                if (themStatusRow[0])
                {
                    io.to(themStatusRow[0].soc_id).emit('yourChatMsgSeen', {match_username: me});
                    io.to(themStatusRow[0].soc_id).emit('notChatMsgSeen', {match_username: me, msg});
                }
        });
    });

    // get information for the chat page
    socket.on("loginReq", (params) =>
    {
        let sql = 'SELECT * FROM socketid WHERE username = ?';    
        
        connection.query(sql, [params.me], (err, socketIdRow) =>
        {
            if (err) console.log(err);
            else if (socketIdRow[0])
            {
                sql = 'UPDATE socketid SET soc_id = ? WHERE username = ?';
                connection.query(sql, [socket.id, params.me], (err) => { if (err) console.log(err) });
            }
            else
            {
                sql = 'INSERT INTO socketid (username, soc_id) VALUES (?, ?)';
                connection.query(sql, [params.me, socket.id], (err) => {
                    if (err) io.emit('error', 'interal server error');
                });
            }

            // check match status 
            sql = 'SELECT * FROM socketid WHERE username = ?';
            connection.query(sql, [params.them], (err, themStatusRow) => {
                if (err) console.log(err);
                else if (!themStatusRow[0])
                    io.to(socket.id).emit('loginRes', { themStatus: 'offline'});
                else
                {
                    io.to(themStatusRow[0].soc_id).emit('notChatMsgSeen', {match_username: params.me});
                    io.to(socket.id).emit('loginRes', {them: params.them, themStatus: 'online'});
                    io.to(themStatusRow[0].soc_id).emit('yourChatMsgSeen', {match_username: params.me});
                    // for notification for read io.to(themStatusRow[0].soc_id).emit('yourChatMsgSeen', {match_username: me});
                }
            });

            sql = 'UPDATE messages SET msg_state = 1 WHERE sentto = ?';

            connection.query(sql, [params.me], err => { if (err) console.log(err) });
            io.sockets.emit('broadcast1', {username: params.me});
            

        });
    });

//################################################end 


// ``````````````````````````````` chat message are all handled here ```````````````````````````````
    // chat message event
    socket.on("chatMsg",  (msgParams) => 
    {
        let { me, them, msg } = msgParams;
        
        let sql = 'INSERT INTO `messages` (`sentby`, `sentto`, `message`, `msg_state`) VALUES (?, ?, ?, ?)';
        
        connection.query(sql, [me, them, msg, 0], (err) => { if (err) console.log(err); });

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('dtabase error');
            else if (themStatusRow[0])
            {
                io.to(themStatusRow[0].soc_id).emit('resMsg', {me: them, them: me, msg});
                io.to(themStatusRow[0].soc_id).emit('notMsg', {me: them, them: me, msg});
            }
            // else must tell the sender the users is some how offline
        });
    });

// ``````````````````````````````` end

// ############################### disconnection
    
    // disconnecting user
    const get_date = require('get-date');
    socket.on("disconnect", () =>
    {
        let userDisconnected = 'none';
        
        let sql = 'SELECT username FROM socketid WHERE soc_id = ?'

        connection.query(sql, socket.id, (err, row) => {
            if (err) console.log(err)
            else
            {
                if (row[0])
                {
                    userDisconnected = row;
                    lastSeen = get_date();
                    sql = 'UPDATE users SET last_seen = ? WHERE username = ?';
                    
                    connection.query(sql, [lastSeen, userDisconnected[0].username], (err) => { if (err) console.log(err) });

                    sql = 'DELETE FROM socketid WHERE soc_id = ?';

                    connection.query(sql, socket.id, (err) => {
                        if (err) console.log(err);
                        else
                            io.sockets.emit('broadcast', {username: userDisconnected[0].username, lastSeen});
                    });
                }
            }
        });
    });
// ############################### end
});

let cleared = 0;

if (cleared == 0)
     

    connection.query('DELETE  FROM socketid', (err) => {
        if (err) console.log(err);
        else
        {
            cleared = 1;
            console.log('sockets db cleared');
        }
    });

server.listen(port, () => console.log(`listening on port ${port}`));
