'use strict';

import socket from 'socket.io';

const PORT = process.env.NODE_PORT || 8080;

let io = socket(PORT);
console.log(`🌏  Server start on port ${PORT}`);

let messages = [];
io.on('connection', socket => {
    // On stock les données du client dans la socket
    socket._user = { username: socket.handshake.query.username };

    // Lorsqu'un utilisateur se connecte, on lui envoie tous les messages
    socket.emit('chat.connected', messages);

    socket.on('chat.send_message', content => {
        let message = { username: socket._user.username, content };
        messages.push(message);
        io.emit('chat.receive_message', message);
    });
});
