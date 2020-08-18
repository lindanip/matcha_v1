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
const addLike = require('./routes/add_like');
const deleteLike = require('./routes/delete_like');
const addConnection = require('./routes/add_connection');
const deleteConnection = require('./routes/delete_connection');
const acceptConnection = require('./routes/accept_connection');
const declineConnection = require('./routes/decline_connection');
const connectionRequests = require('./routes/connection_requests');
const uploadImages = require('./routes/upload_images');
const removeImage = require('./routes/remove_image');
var adminIndex = require('./routes/admin_index');
var allUsers = require('./routes/all_users');
var blockRequests = require('./routes/block_requests');
var blockUser = require('./routes/block_user');
var sendBlock = require('./routes/send_block');
var acceptBlock = require('./routes/accept_block');
var declineBlock = require('./routes/decline_block');
var profileViews = require('./routes/profile_views');
const chats = require('./routes/chats');
const messages = require('./routes/messages');

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/home/Uploads', express.static(path.join(__dirname, '/home/Uploads')));
app.use('/search/Uploads', express.static(path.join(__dirname, '/search/Uploads')));
app.use('/index_images', express.static(path.join(__dirname, 'index_images')));

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
app.use('/add_like', addLike);
app.use('/delete_like', deleteLike);
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
app.use('/messages', messages)


io.on('connection', (socket) =>
{
    // user typing
    socket.on('matchTyping', params => {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notMatchTyping', {match_username: me});
        });
    });

    // profile view notification
    socket.on('profileView', params => {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notProfileView', {match_username: me});
        });
    });

    //connection request notification
    socket.on('connectionReq', params => {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        console.log('sam cooke');
        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notConnectionReq', {match_username: me});
        });
    });

    //connection accept notification
    socket.on('acceptConnectionReq', params => {
        let { me, them } = params;

        console.log('sdfghjklsdsadu8320099s');
        console.log(params);
        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notConnectionAccept', {match_username: me});
        });
    });

    //connection decline notification
    socket.on('declineConnectionReq', params => {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('database error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notConnectionDecline', {match_username: me});
        });
    });

    //disconnection notification
    socket.on('removeConnection', params => {
        let { me, them } = params;

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('dtabase error');
            else
                if (themStatusRow[0])
                    io.to(themStatusRow[0].soc_id).emit('notDisconnection', {match_username: me});
        });
    });

    // insert or update socket id
    socket.on('notLoginReq', (params) =>
    {
        let sql = 'SELECT * FROM socketid WHERE username = ?';
        connection.query(sql, [params.me], (err, socketIdRow) =>
        {
            if (err) io.emit('error', 'internal server error');
            else if (socketIdRow[0])
            {
                sql = 'UPDATE socketid SET soc_id = ? WHERE username = ?';
                connection.query(sql, [socket.id, params.me], (err) => {
                    if (err) io.emit('error', 'interal server error');
                });
            }else
            {
                sql = 'INSERT INTO socketid (username, soc_id) VALUES (?, ?)';
                connection.query(sql, [params.me, socket.id], (err) => {
                    if (err) io.emit('error', 'interal server error');
                });
            }
            io.to(socket.id).emit('notLoginRes', params.me);
        });
    });

    // get information for the chat page
    socket.on("loginReq", (params) =>
    {
        let sql = 'SELECT * FROM socketid WHERE username = ?';    
        connection.query(sql, [params.me], (err, socketIdRow) =>
        {
            if (err) io.emit('error', 'internal server error');
            else if (socketIdRow[0])
            {
                sql = 'UPDATE socketid SET soc_id = ? WHERE username = ?';
                connection.query(sql, [socket.id, params.me], (err) => {
                    if (err) io.emit('error', 'interal server error');
                });
            }else
            {
                sql = 'INSERT INTO socketid (username, soc_id) VALUES (?, ?)';
                connection.query(sql, [params.me, socket.id], (err) => {
                    if (err) io.emit('error', 'interal server error');
                });
            }

            sql = 'SELECT * FROM socketid WHERE username = ?';
            connection.query(sql, [params.them], (err, themStatusRow) => {
                if (err) io.emit('error', 'internal server error');
                io.emit('loginRes', { themStatus: themStatusRow[0] ? 'online' : 'offline' });
            });
        });
    });

    // chat message event
    socket.on("chatMsg",  (msgParams) => {
        let { me, them, msg } = msgParams;
        
        let sql = 'INSERT INTO `messages` (`sentby`, `sentto`, `message`, `msg_state`) VALUES (?, ?, ?, ?)';
        
        connection.query(sql, [me, them, msg, 0], (err) => {
            if (err) console.log(err);
        });

        sql = 'SELECT * FROM socketid WHERE username = ?';

        connection.query(sql, [them], (err, themStatusRow) => {
            if (err) console.log('dtabase error');
            
            if (themStatusRow[0])
            {
                io.to(themStatusRow[0].soc_id).emit('resMsg', msgParams);
                io.to(themStatusRow[0].soc_id).emit('notMsg', msgParams);
            }
        });
    });

    // disconnecting user
    socket.on("disconnect", () => {
        connection.query('DELETE FROM socketid WHERE soc_id = ?', socket.id, (err) => {
            if (err) console.log(err);
        });        
    });
});

server.listen(port, () => console.log(`listening on port ${port}`));
