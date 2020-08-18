const socket = io();

// send new socket id to the backend
function login(){
    socket.emit('notLoginReq', {
        me: document.getElementById('me').value,
    });

    socket.on('notLoginRes', (msg) => {
        document.getElementById('profile_pic').style.border = '3px solid green';
    });
}

// send notification to user beign viewed
async function profileView()
{
    await socket.emit('profileView', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
    login();
}

// send notification for connection request
function sendConnectionReq() {
    socket.emit('connectionReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
}

// send notification for accepted connetion
function acceptConnectionReq() {
    //console.log('the id we are looking for' + this.id);
    socket.emit('acceptConnectionReq', {
        me: document.getElementById('me').value,
        them: this.id
    });
}

// send notification for remove connection
function declineConnectionReq() {
    socket.emit('declineConnectionReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
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
// connection decline, disconnection

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













