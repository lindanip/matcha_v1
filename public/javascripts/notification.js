const socket = io();

function login(){
    socket.emit('notLoginReq', {
        me: document.getElementById('me').value,
    });

    socket.on('notLoginRes', (msg) => {
        document.getElementById('profile_pic').style.borderTop = '5px solid green';
    });
}

socket.on('userJoined', (msg) => {
    console.log(msg);
});

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