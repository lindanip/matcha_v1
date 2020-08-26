const socket = io();


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








//section 5
// add all notifications to the dom

const addToNotifications = function(res){
    const notificationBar = document.getElementById('notification-bar');

    let notInfo = document.createElement('div');
    notInfo.setAttribute('class', 'not_info');

            //create notification username
            let notInfoUser = document.createElement('span');
            notInfoUser.id = 'not_info_user';

            //create username text
            let msgUsernameText = document.createTextNode(res.them);
            notInfoUser.appendChild(msgUsernameText);

            //create notification message
            let notInfoMsg = document.createElement('span');
            notInfoMsg.id = 'not_info_msg';

            //create message text
            let msgText = document.createTextNode(res.msg);
            notInfoMsg.appendChild(msgText);

    //append two spans to notification div and form
    notInfo.appendChild(notInfoUser);
    notInfo.appendChild(notInfoMsg);


    notInfo.style.display = "none";
    notificationBar.appendChild(notInfo);

    document.getElementById('notification-link').style.color = 'gold';
}


socket.on('notificationsRows', (rows) => {
    console.log(rows);
    rows.forEach(row => {
        let res = {
            them : row.sentby,
            msg: row.notification_message
        } 

        addToNotifications(res);
    });
});

const preAddToNotifications = function(msg, serverRes)
{
    let res = {
        them : serverRes.match_username,
        msg: msg
    } 

    addToNotifications(res);
}

socket.on('notYourRequestViewed', (res) => preAddToNotifications('viewed your request for connection', res));
socket.on('notProfileView', (res) => preAddToNotifications('viewed your profile', res));
socket.on('notConnectionReq', (res) => preAddToNotifications('request to connect', res));
socket.on('notConnectionAccept', (res) => preAddToNotifications('accepted your request', res));
socket.on('notConnectionDecline', (res) => preAddToNotifications('declined your request', res));
socket.on('notDisconnection', (res) => preAddToNotifications('disconnected from your profile', res));