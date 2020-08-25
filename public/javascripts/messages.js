const socket = io();


function login(){
    socket.emit('loginReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });
}

socket.on('loginRes', (msg) =>
{
    let match_status = document.getElementById('_match_status');
    
    if (msg.themStatus == 'online'){
        match_status.innerText = `${msg.them} is online`;
        match_status.style.color = 'green';
    }
    else{
        match_status.innerText = `${msg.them} is offline`;
        match_status.style.color = 'red';
    }
});

function sendBtn()
{
    let me = document.getElementById("me").value;
    let them = document.getElementById("them").value;
    let msg = document.getElementById("msg").value;
    let date = new Date();

    socket.emit('chatMsg', {id: socket.id, msg, them, me});

    let themMessage =   `<div class="message-me"> <p>${me} (me)</p>`+
                            `<p>${msg}</p>`+
                            `<p>${date}</p>`+
                            `<p class="seen">message unseen</p>`+
                        `</div>`;

    document.getElementById('messages').innerHTML += themMessage;
}

socket.on('resMsg', (msg) =>
{
    let date = new Date();

    let themMessage =   `<div class="message-them"> <p>${msg.them}</p>`+
                            `<p>${msg.msg}</p>`+
                            `<p>${date}</p>`+
                        `</div>`;

    document.getElementById('messages').innerHTML += themMessage;

    socket.emit('chatMsgSeen', {    id: socket.id,
                                    me: document.getElementById("me").value,
                                    them: document.getElementById("them").value,
                                    msg: msg.msg });
});

socket.on('yourChatMsgSeen', (res) =>
{
    var seenElements = document.querySelectorAll('.seen');

    var i = 0;
    while (seenElements[i]){
        seenElements[i].innerText = 'seen';
        i++;
    }
});









// there is a user disconnected 
socket.on('broadcast', (res) =>
{
    const match_status = document.getElementById('_match_status');

    if (res.username == document.getElementById('them').value){
        match_status.innerText = `${res.username} is offline`;
        match_status.style.color = 'red';
    }
});

// there is a user connected 
socket.on('broadcast1', (res) =>
{   
    const match_status = document.getElementById('_match_status');

    if (res.username == document.getElementById('them').value){
        match_status.innerText = `${res.username} is online`;
        match_status.style.color = 'green';
    }
});



socket.on('notYourRequestViewed', (res) => addNotificationElement('is viewing your request for connection', res));
socket.on('notProfileView', (res) => addNotificationElement('is viewing your profile', res));
socket.on('notConnectionReq', (res) => addNotificationElement('requested to connect', res));
socket.on('notConnectionAccept', (res) => addNotificationElement('accepted your request', res));
socket.on('notConnectionDecline', (res) => addNotificationElement('declined your request', res));
socket.on('notDisconnection', (res) => addNotificationElement('is disconnected from your profile', res));

let addNotificationElement = (msg, res) => {

    //display notification bar
    let notificationBar = document.getElementById('notification-bar');
    // notificationBar.style.display = 'block';

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
    notificationBar.style.display = 'none';
    document.getElementById('notification-toggle').style.display = 'block';
}


function displayNotifications()
{
    if (document.getElementById('notification-bar').hasChildNodes())
    {
        let notificationBar = document.getElementById('notification-bar');

        if (notificationBar.style.display == 'block')
            notificationBar.style.display = 'none';
        else
            notificationBar.style.display = 'block';
    }
}