const socket = io();

socket.emit('loginMsg', "online");
socket.on('msgBack', (msg) => {
    console.log(msg);
});

function sendBtn(){
    var me = document.getElementById("me").value;
    var them = document.getElementById("them").value;
    var msg = document.getElementById("msg").value;
    console.log(`${me}  ${them} ${msg}`);
    socket.emit('chatMsg', {msg: msg, them: them, me: me})
}