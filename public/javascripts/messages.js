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

function sendBtn(){
    let me = document.getElementById("me").value;
    let them = document.getElementById("them").value;
    let msg = document.getElementById("msg").value;


    socket.emit('chatMsg', {id: socket.id, msg, them, me});

    let themMessage =   `<div class="message-me"> <p>${me} (me)</p>`+
                            `<p>${msg}</p>`+
                            `<p>use javascript for time</p>`+
                        `</div>`;

    document.getElementById('messages').innerHTML += themMessage;
}

socket.on('resMsg', (msg) =>
{
    console.log(msg);
    let themMessage =   `<div class="message-them"> <p>${msg.them}</p>`+
                            `<p>${msg.msg}</p><p>use javascript for time</p>`+
                        `</div>`;

    document.getElementById('messages').innerHTML += themMessage;
});