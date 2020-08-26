const socket = io();

// toggle 
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




//section 1
// sends new socket id to the backend
function login()
{
    socket.emit('notLoginReq', { me: document.getElementById('me').value });
    //socket.emit('checkMessages', { me: document.getElementById('me')});
}

socket.on('notLoginRes', (msg) => {
    document.getElementById('profile_pic').style.border = '2px solid gold';
});





//section 2
// add new notifications to the dom
const addNotificationToDOM = function(msg, res)
{
    socket.emit('pageNotificationsInView', { me: document.getElementById('me').value });

    var main = document.querySelector('main');

    // create main div
    let notificationMainDiv = document.createElement('div');
    notificationMainDiv.className = 'notification seen';


    // create first inner div
    let notificationFrom = document.createElement('div');
    notificationFrom.className = 'notification_from';
    
            let fromSpan = document.createElement('span');
            let fromNameSpan = document.createElement('span');

            let fromSpanText = document.createTextNode('form -');
            let fromNameSpanText = document.createTextNode(res.match_username);

            fromSpan.appendChild(fromSpanText);
            fromNameSpan.appendChild(fromNameSpanText);

            notificationFrom.appendChild(fromSpan);
            notificationFrom.appendChild(fromNameSpan);


    // create second inner div
    let notificationMsg = document.createElement('div');
    notificationMsg.className = 'notification_msg';

            let eventSpan = document.createElement('span');
            let msgSpan = document.createElement('span');

            let eventSpanText = document.createTextNode('event -');
            let msgSpanText = document.createTextNode(msg);

            eventSpan.appendChild(eventSpanText);
            msgSpan.appendChild(msgSpanText);

            notificationMsg.appendChild(eventSpan);
            notificationMsg.appendChild(msgSpan);


    // create inner delete form
    // let deleteForm = document.createElement('form');
    // deleteForm.setAttribute('method', 'post');
    // deleteForm.setAttribute('action', '/my_notifications');

    //         let sentByInput = document.createElement('input');
    //         sentByInput.setAttribute('type', 'hidden');
    //         sentByInput.setAttribute('name', 'sentby');
    //         sentByInput.setAttribute('value', res.match_username);


    //         let sentToInput = document.createElement('input');
    //         sentToInput.setAttribute('type', 'hidden');
    //         sentToInput.setAttribute('name', 'sentto');
    //         sentToInput.setAttribute('value', document.getElementById('me').value);

    //         // we need one for an id that we need to cater for

    //         deleteForm.appendChild(sentByInput);
    //         deleteForm.appendChild(sentToInput);

    

    notificationMainDiv.appendChild(notificationFrom);
    notificationMainDiv.appendChild(notificationMsg);
    //notificationMainDiv.appendChild(deleteForm);

    main.insertBefore(notificationMainDiv, main.childNodes[2]);
}


socket.on('notYourRequestViewed', (res) => addNotificationToDOM('is viewing your request for connection', res));
socket.on('notProfileView', (res) => addNotificationToDOM('is viewing your profile', res));
socket.on('notConnectionReq', (res) => addNotificationToDOM('requested to connect', res));
socket.on('notConnectionAccept', (res) => addNotificationToDOM('accepted your request', res));
socket.on('notConnectionDecline', (res) => addNotificationToDOM('declined your request', res));
socket.on('notDisconnection', (res) => addNotificationToDOM('is disconnected from your profile', res));
socket.on('notChatMsgSeen', (res) => { addNotificationToDOM('has view your message', res) });






//section 3
// add new messages and old message (that have not been read) to the dom
const addMessageToNotification = function(res){
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
    notInfo.appendChild(notInfoUser);
    notInfo.appendChild(notInfoMsg);
    notInfo.appendChild(messagesForm);

    notInfo.style.display = "none";
    notificationBar.appendChild(notInfo);

    document.getElementById('notification-link1').style.color = 'gold';
}

socket.on('messagesRows', (rows) => {
    rows.forEach(row => {
        let res = {
            them : row.sentby,
            msg: row.message
        } 

        addMessageToNotification(res);
    });
});

socket.on('notMsg', res => addMessageToNotification(res));
