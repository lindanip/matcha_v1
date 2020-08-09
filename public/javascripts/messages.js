const socket = io();

console.log(socket)





socket.emit('loginMsg', "online");
socket.on('msgBack', (msg) => {
    console.log(msg);
});

function sendBtn(){
    let me = document.getElementById("me").value;
    let them = document.getElementById("them").value;
    let msg = document.getElementById("msg").value;

    console.log(`${me}  ${them} ${msg}`);
    socket.emit('chatMsg', {id: socket.id, msg, them, me})
}