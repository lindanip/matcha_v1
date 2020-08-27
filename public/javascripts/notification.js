
// protect again confict with ejs that if maybe an element is not there but front end wants to use it

const socket = io();

function login()
{
    socket.emit('notLoginReq', { me: document.getElementById('me').value });
}


// i am online
socket.on('matchOnline', (res) => {
    if (onlineTag && document.getElementById('_match_status'))
        if (res.match_username == document.getElementById('them').value){
            const match_status = document.getElementById('_match_status');
            
            match_status.innerText = `${res.match_username} is online`;
            match_status.style.color = 'green';
        }
});
// i am offline
socket.on('matchOffline', (res) => {
    if (onlineTag && document.getElementById('_match_status'))
        if (res.match_username == document.getElementById('them').value){
            const match_status = document.getElementById('_match_status');
            
            match_status.innerText = `${res.match_username} is offline, last seen ${res.lastSeen}`;
            match_status.style.color = 'red';
        }
});

// there is a user disconnected 
socket.on('broadcast', (res) => {
    if (onlineTag && document.getElementById('_match_status'))
        if (res.username == document.getElementById('them').value){
            const match_status = document.getElementById('_match_status');

            match_status.innerText = `${res.username} is offline, last seen ${res.lastSeen}`;
            match_status.style.color = 'red';
        }
});

// there is a user connected 
socket.on('broadcast1', (res) => {   
    if (onlineTag && document.getElementById('_match_status'))
        if (res.username == document.getElementById('them').value){
            const match_status = document.getElementById('_match_status');

            match_status.innerText = `${res.username} is online`;
            match_status.style.color = 'green';
        }
});














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

function displayMessages(){
    if (document.getElementById('message-bar').hasChildNodes())
    {
        let msgInfoAll = document.querySelectorAll('.msg_info');
        msgInfoAll.forEach((msgInfoItem) => {
            if (msgInfoItem.style.display == 'block')
                msgInfoItem.style.display = 'none';
            else
                msgInfoItem.style.display = 'block';
        });
    }
}





// section 1
// send new socket id to the backend
var onlineTag = 0;



socket.on('notLoginRes', (msg) => 
{
    document.getElementById('profile_pic').style.border = '2px solid gold';
});


// section 2 calling section 1
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





//section 3
// send notifications to the other user

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









//section 4
// add all messages to the dom

const addToMessages = function(res){
    const msgBar = document.getElementById('message-bar');

    let msgInfo = document.createElement('div');
    msgInfo.setAttribute('class', 'msg_info');

            //create notification username
            let msgInfoUser = document.createElement('span');
            msgInfoUser.id = 'msg_info_user';

            //create username text
            let msgUsernameText = document.createTextNode(res.them);
            msgInfoUser.appendChild(msgUsernameText);

            //create notification message
            let msgInfoMsg = document.createElement('span');
            msgInfoMsg.id = 'msg_info_msg';

            //create message text
            let msgText = document.createTextNode(res.msg);
            msgInfoMsg.appendChild(msgText);

            // create form
            let messagesForm = document.createElement('form');
            messagesForm.setAttribute('method', 'post');
            messagesForm.setAttribute('action', '/messages');

                    let usernameInput = document.createElement('input');
                    usernameInput.setAttribute('type', 'hidden');
                    usernameInput.setAttribute('name', 'username');
                    usernameInput.setAttribute('value', res.them);

                    let submitBtn = document.createElement('button');
                    submitBtn.setAttribute('type', 'submit');
                    submitBtn.innerText = 'view message';

            messagesForm.appendChild(usernameInput);
            messagesForm.appendChild(submitBtn);

    //append two spans to notification div and form
    msgInfo.appendChild(msgInfoUser);
    msgInfo.appendChild(msgInfoMsg);
    msgInfo.appendChild(messagesForm);

    msgInfo.style.display = "none";
    msgBar.appendChild(msgInfo);

    document.getElementById('message-link').style.color = 'gold';
}

socket.on('messagesRows', (rows) => {
    console.log(rows);
    rows.forEach(row => {
        let res = {
            them : row.sentby,
            msg: row.message
        } 

        addToMessages(res);
    });
});

socket.on('notMsg', res => addToMessages(res));





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
//socket.on('notChatMsgSeen', (res) => { preAddToNotifications('has view your message', res) });







































































































// // protect again confict with ejs that if maybe an element is not there but front end wants to use it

// const socket = io();

// // i am online
// socket.on('matchOnline', (res) => {
//     if (onlineTag && document.getElementById('_match_status'))
//         if (res.match_username == document.getElementById('them').value){
//             const match_status = document.getElementById('_match_status');
            
//             match_status.innerText = `${res.match_username} is online`;
//             match_status.style.color = 'green';
//         }
// });
// // i am offline
// socket.on('matchOffline', (res) => {
//     if (onlineTag && document.getElementById('_match_status'))
//         if (res.match_username == document.getElementById('them').value){
//             const match_status = document.getElementById('_match_status');
            
//             match_status.innerText = `${res.match_username} is offline`;
//             match_status.style.color = 'red';
//         }
// });

// // there is a user disconnected 
// socket.on('broadcast', (res) => {
//     if (onlineTag && document.getElementById('_match_status'))
//         if (res.username == document.getElementById('them').value){
//             const match_status = document.getElementById('_match_status');

//             match_status.innerText = `${res.username} is offline`;
//             match_status.style.color = 'red';
//         }
// });

// // there is a user connected 
// socket.on('broadcast1', (res) => {   
//     if (onlineTag && document.getElementById('_match_status'))
//         if (res.username == document.getElementById('them').value){
//             const match_status = document.getElementById('_match_status');

//             match_status.innerText = `${res.username} is online`;
//             match_status.style.color = 'green';
//         }
// });



















// var onlineTag = 0;

// // send new socket id to the backend
// function login(){
//     socket.emit('notLoginReq', {
//         me: document.getElementById('me').value,
//     });

//     socket.on('notLoginRes', (msg) => {
//         document.getElementById('profile_pic').style.border = '3px solid purple';
//     });
// }

// // send notification to user being viewed
// async function profileView(){
//     await socket.emit('profileView', {
//         me: document.getElementById('me').value,
//         them: document.getElementById('them').value
//     });
//     onlineTag = 1;
//     login();
// }

// // send notification to user that request has been opened
// async function connectionRequestView(){
//     await socket.emit('connectionRequestView', {
//         me: document.getElementById('me').value,
//         them: document.getElementById('them').value
//     });
//     onlineTag = 1;
//     login();
// }


// const addMessageToNotification = function(res){
//     const notificationBar = document.getElementById('notification-bar');

//     let notInfo = document.createElement('div');
//     notInfo.setAttribute('class', 'not_info');

//             //create notification username
//             let notInfoUser = document.createElement('span');
//             notInfoUser.id = 'not_info_user';

//             //create username text
//             let msgUsernameText = document.createTextNode(res.them);
//             notInfoUser.appendChild(msgUsernameText);

//             //create notification message
//             let notInfoMsg = document.createElement('span');
//             notInfoMsg.id = 'not_info_msg';

//             //create message text
//             let msgText = document.createTextNode(res.msg);
//             notInfoMsg.appendChild(msgText);

//             // create form
//             let messagesForm = document.createElement('form');
//             messagesForm.setAttribute('method', 'post');
//             messagesForm.setAttribute('action', '/messages');

//                     let usernameInput = document.createElement('input');
//                     usernameInput.setAttribute('type', 'hidden');
//                     usernameInput.setAttribute('name', 'username');
//                     usernameInput.setAttribute('value', res.them);

//                     let submitBtn = document.createElement('button');
//                     submitBtn.setAttribute('type', 'submit');
//                     submitBtn.innerText = 'view message';

//             messagesForm.appendChild(usernameInput);
//             messagesForm.appendChild(submitBtn);

//     //append two spans to notification div and form
//     notInfo.appendChild(notInfoUser);
//     notInfo.appendChild(notInfoMsg);
//     notInfo.appendChild(messagesForm);

//     notInfo.style.display = "none";
//     notificationBar.appendChild(notInfo);

//     document.getElementById('notification-link1').style.color = 'gold';
// }



















// socket.on('notificationsRows', (rows) => {
//     //console.log(rows);
//     rows.forEach(row => {
//         let res = {
//             them : row.sentby,
//             msg: row.message
//         } 

//         addMessageToNotification(res);
//     });
// });
// socket.on('messagesRows', (rows) => {
//     //console.log(rows);
//     rows.forEach(row => {
//         let res = {
//             them : row.sentby,
//             msg: row.message
//         } 

//         addMessageToNotification(res);
//     });
// });



// // send user that notification (some notifictions, 
// // 1 not messages (msg: your message has been read)
// //// 2 probably not views( msg: viewer have seen that you seen them))
// //// 3 no connection req (msg: match has sent you a connection req);
// //// 4 yes connection req (msg: match has accepted your connection req);
// //// 5 yes connection req (msg: match has declined your connection req);
// //// 6 yes connection req (msg: match has disconnected you);






// // send notification for connection request
// function sendConnectionReq() {
//     socket.emit('connectionReq', {
//         me: document.getElementById('me').value,
//         them: document.getElementById('them').value
//     });
// }

// // send notification for accepted connetion
// async function acceptRequest() {
//     await socket.emit('acceptConnectionReq', {
//         me: document.getElementById('me').value,
//         them: document.getElementById('them').value
//     });
//     document.getElementById('_accept').click();
// }

// // send notification for decline connection
// async function declineRequest() {
//     await socket.emit('declineConnectionReq', {
//         me: document.getElementById('me').value,
//         them: document.getElementById('them').value
//     });
//     document.getElementById('_refuse').click();
// }

// // send notification for remove connection
// function removeConnection() {
//     socket.emit('removeConnection', {
//         me: document.getElementById('me').value,
//         them: document.getElementById('them').value
//     });
// }

// // recieve a notification for profile view
// // connection request, connection accept,
// // connection decline, disconnection, need msg


// socket.on('notYourRequestViewed', (res) => addToNotifications('is viewing your request for connection', res));
// socket.on('notProfileView', (res) => addToNotifications('is viewing your profile', res));
// socket.on('notConnectionReq', (res) => addToNotifications('requested to connect', res));
// socket.on('notConnectionAccept', (res) => addToNotifications('accepted your request', res));
// socket.on('notConnectionDecline', (res) => addToNotifications('declined your request', res));
// socket.on('notDisconnection', (res) => addToNotifications('is disconnected from your profile', res));
// socket.on('notChatMsgSeen', (res) => { addToNotifications('has view your message', res) });



// let addToNotifications = (msg, res) => {
//     console.log(msg);
//     //display notification bar
//     notificationBar = document.getElementById('notification-bar');
//     notificationBar.style.display = 'block';

//     //create notification div
//     let notInfo = document.createElement('div');
//     notInfo.className = 'not_info';

//     //create notification username
//     let notInfoUser = document.createElement('span');
//     notInfoUser.id = 'not_info_user';

//     //create username text
//     let msgUsernameText = document.createTextNode(res.match_username + ' ' + msg);
//     notInfoUser.appendChild(msgUsernameText);

//     notInfo.appendChild(notInfoUser);

//     notificationBar.appendChild(notInfo);
//     setTimeout(() =>{
//         notInfo.style.display = 'none';
//         document.getElementById('notification-toggle').style.display = 'block';
//     }, 2000);
// }


// socket.on('notMsg', (res) => 
// {
//     //display notification bar
//     notificationBar = document.getElementById('notification-bar');
//     notificationBar.style.display = 'block';

//     //create notification div
//     let notInfo = document.createElement('div');
//     notInfo.className = 'not_info';

//     //create notification username
//     let notInfoUser = document.createElement('span');
//     notInfoUser.id = 'not_info_user';
    
//     //create username text
//     let msgUsernameText = document.createTextNode(res.me);
//     notInfoUser.appendChild(msgUsernameText);

//     //create notification message
//     let notInfoMsg = document.createElement('span');
//     notInfoMsg.id = 'not_info_msg';

//     //create message text
//     let msgText = document.createTextNode(res.msg);
//     notInfoMsg.appendChild(msgText);

//     //append two spans to notification div
//     notInfo.appendChild(notInfoUser);
//     notInfo.appendChild(notInfoMsg);

//     notificationBar.appendChild(notInfo);
//     setTimeout(() =>{
//         notInfo.style.display = 'none';
//         document.getElementById('notification-toggle').style.display = 'block';
//     }, 2000);
// });


// //function below needs to be fixed
// function displayNotifications(){
//     if (document.getElementById('notification-bar').hasChildNodes())
//     {
//         let notInfoAll = document.querySelectorAll('.not_info');
//         notInfoAll.forEach((notInfoItem) => {
//             if (notInfoItem.style.display == 'block')
//                 notInfoItem.style.display = 'none';
//             else
//                 notInfoItem.style.display = 'block';
//         });
//     }
// }


