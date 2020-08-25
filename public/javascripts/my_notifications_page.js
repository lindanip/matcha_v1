const socket = io();

// send new socket id to the backend
function login()
{
    socket.emit('notLoginReq', { me: document.getElementById('me').value });
}

socket.on('notLoginRes', (msg) => {
    document.getElementById('profile_pic').style.border = '2px solid gold';
});









socket.on('notYourRequestViewed', (res) => addNotificationToDOM('is viewing your request for connection', res));
socket.on('notProfileView', (res) => addNotificationToDOM('is viewing your profile', res));
socket.on('notConnectionReq', (res) => addNotificationToDOM('requested to connect', res));
socket.on('notConnectionAccept', (res) => addNotificationToDOM('accepted your request', res));
socket.on('notConnectionDecline', (res) => addNotificationToDOM('declined your request', res));
socket.on('notDisconnection', (res) => addNotificationToDOM('is disconnected from your profile', res));
socket.on('notChatMsgSeen', (res) => { addNotificationToDOM('has view your message', res) });



const addNotificationToDOM = function(msg, res)
{
    
    var main = document.querySelector('main');

    // console.log(main.childNodes);

    // console.log(main.childNodes[1]);

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
    let deleteForm = document.createElement('form');
    deleteForm.setAttribute('method', 'post');
    deleteForm.setAttribute('action', '/my_notifications');

            let sentByInput = document.createElement('input');
            sentByInput.setAttribute('type', 'hidden');
            sentByInput.setAttribute('name', 'sentby');
            sentByInput.setAttribute('value', res.match_username);


            let sentToInput = document.createElement('input');
            sentToInput.setAttribute('type', 'hidden');
            sentToInput.setAttribute('name', 'sentto');
            sentToInput.setAttribute('value', document.getElementById('me').value);

            // we need one for an id that we need to cater for

            deleteForm.appendChild(sentByInput);
            deleteForm.appendChild(sentToInput);

    

    notificationMainDiv.appendChild(notificationFrom);
    notificationMainDiv.appendChild(notificationMsg);
    notificationMainDiv.appendChild(deleteForm);

    main.insertBefore(notificationMainDiv, main.childNodes[2]);
}

