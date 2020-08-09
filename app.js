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


io.on('connection', (socket) => {
    console.log("user has connected");
    
    socket.on("loginMsg", (msg) => {
        socket.emit('id', socket.id);
    });
    socket.on("chatMsg",  (msg) => {
        var from = msg.me;
        var to = msg.them;
        var theMsg = msg.msg;
        var state = '0';
        
        var query = 'INSERT INTO `messages` (`sentby`, `sentto`, `message`, `msg_state`) VALUES (?, ?, ?, ?)';
        connection.query(query, [from, to, theMsg, state], (err) => {
            if (err) console.log("database error");
            else console.log('message inserted');
        });
        console.log(socket.id);
        // io.to(`${ros[0].soc_id}`.emit('msgBack', theMsg));
        //query = 'SELECT * FROM socketid WHERE username = ?';
        // connection.query(query, [to], (err, rows) => {
        //     if (err) console.log("database error");
        //     else if (rows[0] && rows[0]['username']) {
        //         try{
        //             io.to(`${ros[0].soc_id}`.emit('msgBack', theMsg));
        //             io.emit('back', 'hoping');
        //         }catch (err){
        //             console.log('this has happend');
        //             io.emit('back', 'back');
        //         }
        //     }
        // });
    });
    // we have to do for the disconnecting on the page close and on the log out
});

server.listen(port, () => console.log(`listening on port ${port}`));
