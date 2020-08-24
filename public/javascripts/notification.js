// protect again confict with ejs that if maybe an element is not there but front end wants to use it

const socket = io();

// i am online
socket.on('matchOnline', (res) => {
    if (onlineTag && document.getElementById('match_profile_pic'))
        if (res.match_username == document.getElementById('them').value)
            document.getElementById('match_profile_pic').style.border = '5px solid green';
});
// i am offline
socket.on('matchOffline', (res) => {
    if (onlineTag && document.getElementById('match_profile_pic'))
        if (res.match_username == document.getElementById('them').value)
            document.getElementById('match_profile_pic').style.border = '5px solid red';
});

// there is a user disconnected 
socket.on('broadcast', (res) => {
    if (onlineTag && document.getElementById('match_profile_pic'))
        if (res.username == document.getElementById('them').value)
            document.getElementById('match_profile_pic').style.border = '5px solid red';
});

// there is a user connected 
socket.on('broadcast1', (res) => {   
    if (onlineTag && document.getElementById('match_profile_pic'))
        if (res.username == document.getElementById('them').value)
            document.getElementById('match_profile_pic').style.border = '5px solid green';
});




















var onlineTag = 0;

// send new socket id to the backend
function login(){
    socket.emit('notLoginReq', {
        me: document.getElementById('me').value,
    });

    socket.on('notLoginRes', (msg) => {
        document.getElementById('profile_pic').style.border = '3px solid purple';
    });
}

// send notification to user being viewed
async function profileView(){
    await socket.emit('profileView', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
    onlineTag = 1;
    login();
}

// send notification to user that request has been opened
async function connectionRequestView(){
    await socket.emit('connectionRequestView', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
    onlineTag = 1;
    login();
}

// send user that notification (some notifictions, 
// 1 not messages (msg: your message has been read)
//// 2 probably not views( msg: viewer have seen that you seen them))
//// 3 no connection req (msg: match has sent you a connection req);
//// 4 yes connection req (msg: match has accepted your connection req);
//// 5 yes connection req (msg: match has declined your connection req);
//// 6 yes connection req (msg: match has disconnected you);






// send notification for connection request
function sendConnectionReq() {
    socket.emit('connectionReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
}

// send notification for accepted connetion
async function acceptRequest() {
    await socket.emit('acceptConnectionReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
    document.getElementById('_accept').click();
}

// send notification for decline connection
async function declineRequest() {
    await socket.emit('declineConnectionReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
    document.getElementById('_refuse').click();
}

// send notification for remove connection
function removeConnection() {
    socket.emit('removeConnection', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
}

// recieve a notification for profile view
// connection request, connection accept,
// connection decline, disconnection, need msg

socket.on('notYourRequestViewed', (res) => addNotificationElement('is viewing your request for connection', res));
socket.on('notProfileView', (res) => addNotificationElement('is viewing your profile', res));
socket.on('notConnectionReq', (res) => addNotificationElement('requested to connect', res));
socket.on('notConnectionAccept', (res) => addNotificationElement('accepted your request', res));
socket.on('notConnectionDecline', (res) => addNotificationElement('declined your request', res));
socket.on('notDisconnection', (res) => addNotificationElement('is disconnected from your profile', res));

let addNotificationElement = (msg, res) => {

    //display notification bar
    notificationBar = document.getElementById('notification-bar');
    notificationBar.style.display = 'block';

    //create notification div
    let notInfo = document.createElement('div');
    notInfo.className = 'not_info';

    //create notification username
    let notInfoUser = document.createElement('span');
    notInfoUser.id = 'not_info_user';

    //create username text
    let msgUsernameText = document.createTextNode(res.match_username + ' ' + msg);
    notInfoUser.appendChild(msgUsernameText);

    notInfo.appendChild(notInfoUser);

    notificationBar.appendChild(notInfo);
    setTimeout(() =>{
        notInfo.style.display = 'none';
        document.getElementById('notification-toggle').style.display = 'block';
    }, 2000);
}


socket.on('notMsg', (res) => 
{
    //display notification bar
    notificationBar = document.getElementById('notification-bar');
    notificationBar.style.display = 'block';

    //create notification div
    let notInfo = document.createElement('div');
    notInfo.className = 'not_info';

    //create notification username
    let notInfoUser = document.createElement('span');
    notInfoUser.id = 'not_info_user';
    
    //create username text
    let msgUsernameText = document.createTextNode(res.me);
    notInfoUser.appendChild(msgUsernameText);

    //create notification message
    let notInfoMsg = document.createElement('span');
    notInfoMsg.id = 'not_info_msg';

    //create message text
    let msgText = document.createTextNode(res.msg);
    notInfoMsg.appendChild(msgText);

    //append two spans to notification div
    notInfo.appendChild(notInfoUser);
    notInfo.appendChild(notInfoMsg);

    notificationBar.appendChild(notInfo);
    setTimeout(() =>{
        notInfo.style.display = 'none';
        document.getElementById('notification-toggle').style.display = 'block';
    }, 2000);
});














































































































// recieve a notification from chat messages
socket.on('notMsg', (res) => 
{
    //display notification bar
    notificationBar = document.getElementById('notification-bar');
    notificationBar.style.display = 'block';

    //create notification div
    let notInfo = document.createElement('div');
    notInfo.className = 'not_info';

    //create notification username
    let notInfoUser = document.createElement('span');
    notInfoUser.id = 'not_info_user';
    
    //create username text
    let msgUsernameText = document.createTextNode(res.me);
    notInfoUser.appendChild(msgUsernameText);

    //create notification message
    let notInfoMsg = document.createElement('span');
    notInfoMsg.id = 'not_info_msg';

    //create message text
    let msgText = document.createTextNode(res.msg);
    notInfoMsg.appendChild(msgText);

    //append two spans to notification div
    notInfo.appendChild(notInfoUser);
    notInfo.appendChild(notInfoMsg);

    // if (notificationBar.hasChildNodes())
    // {
    //     document.getElementById('notification-toggle').style.display = 'block';
    //     let notInfoAll = document.querySelectorAll('.not_info');
    //     console.log(notInfoAll);
    //     notInfoAll.forEach((notInfoItem) => {
    //         console.log('wassssss');
    //         notInfoItem.style.display = 'none';
    //     });
    // }
    notificationBar.appendChild(notInfo);
    setTimeout(() =>{
        notInfo.style.display = 'none';
        document.getElementById('notification-toggle').style.display = 'block';
    }, 2000);
});











//function below needs to be fixed
function displayNotifications(){
    if (document.getElementById('notification-bar').hasChildNodes())
    {
        let notInfoAll = document.querySelectorAll('.not_info');
        notInfoAll.forEach((notInfoItem) => {
            if (notInfoItem.style.display == 'block')
                notInfoItem.style.display = 'none';
            else
                notInfoItem.style.display = 'block';
        });
    }
}













