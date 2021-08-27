const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);

app.use(express.static('public'));

const io = socket(server);
let onlineCount = 0;

io.on('connection', (socket) => {
    onlineCount++;
    console.log('Yeni baglanti saglandi. Online kisi sayisi: ' + onlineCount);
    
    socket.on('disconnect', () => {
        onlineCount--;
        console.log('Bir kullanici cikis yapti. Online kisi sayisi: ' + onlineCount);
    });

    socket.on('chat', data => {
        io.sockets.emit('chat', data);
        console.log("> (Yeni Mesaj) " + data.sender + ": " + data.message + " [ID: " + data.id + "]");
    });

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    });
});