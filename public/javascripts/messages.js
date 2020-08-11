const socket = io();

function login(){
    socket.emit('loginReq', {
        me: document.getElementById('me').value,
        them: document.getElementById('them').value
    });

    socket.on('loginRes', (msg) => {
        console.log(msg);
    });
}

socket.on('userJoined', (msg) => {
    console.log(msg);
});
function sendBtn(){
    let me = document.getElementById("me").value;
    let them = document.getElementById("them").value;
    let msg = document.getElementById("msg").value;

   // console.log(`${me}  ${them} ${msg}`);
    socket.emit('chatMsg', {id: socket.id, msg, them, me})
}

socket.on('resMsg', (msg) => {
    console.log(msg);
    let themMessage =   `<div class="message-them"> <p>${msg.them}</p>`+
                    `<p>${msg.msg}</p><p>use javascript for time</p>`+
                    `</div>`;

    document.getElementById('messages').innerHTML += themMessage;
});