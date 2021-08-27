const socket = io.connect('http://localhost:3000/');

var sender = document.getElementById('sender');
var submitBtn = document.getElementById('submit');
var messageInput = document.getElementById('message');
var output = document.getElementById('chat-box');
var feedback = document.getElementById('feedbackTxt');
var avatarURL = document.getElementById('avatarURL');
var avatarImg = document.getElementById('avatarImg');

const defaultAvatar = 'https://www.pngarts.com/files/8/Baby-Yoda-PNG-Image-Transparent-Background.png';

const myColor = getRandomColor();
let myAvatar = localStorage.getItem('avatarURL') ? localStorage.getItem('avatarURL') : defaultAvatar;

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('username') !== undefined) {
        sender.value = localStorage.getItem('username');
    }
    if(localStorage.getItem('avatarURL') !== undefined) {
        avatarURL.value = localStorage.getItem('avatarURL');
    }
    avatarImg.src = myAvatar;
});

sender.addEventListener('change', () => {
    localStorage.setItem('username', sender.value);
})

avatarURL.addEventListener('change', () => {
    localStorage.setItem('avatarURL', avatarURL.value);
    myAvatar = avatarURL.value;
    avatarImg.src = avatarURL.value;
});

avatarImg.addEventListener('error', () => {
    avatarImg.src = defaultAvatar;
    myAvatar = defaultAvatar;
});

function sendMessage(id, sender, message, color, avatarURL) {
    let date = new Date();
    let _time;

    if(date.getHours() < 10) {
        _time = "0" + date.getHours() + ":" + date.getMinutes();
    } else {
        _time = date.getHours() + ":" + date.getMinutes();
    }

    if(!sender.length) {
        return alert('Kullanıcı adı seçmeden mesaj gönderemezsiniz!');
    }

    socket.emit('chat', {
        id: id,
        sender: sender,
        message: message,
        color: color,
        time: _time,
        avatarURL: avatarURL
    });
    messageInput.value = "";
}

submitBtn.addEventListener('click', () => {
    sendMessage(socket.id, sender.value, messageInput.value, myColor, myAvatar);
});

messageInput.addEventListener('keypress', (event) => {
    if(event.keyCode === 13) {
        sendMessage(socket.id, sender.value, messageInput.value, myColor, myAvatar);
    }
    socket.emit('typing', sender.value);
});

socket.on('chat', data => {
    let message = "";
    
    if(socket.id !== data.id) {
        message = `
            <div class='message secondary'>
                <div class='sendername' style='color: ${data.color}'>
                    <img src='${data.avatarURL}' class='messageAvatar' />
                    <span>${data.sender}</span>
                </div>${data.message}<div class='timestamp'>${data.time}</div>
            </div>`;
    } else {
        message = `
            <div class='message primary'>
                <div class='sendername'>
                    <img src='${myAvatar}' class='messageAvatar' />
                    <h5>${data.message}</h5>
                </div>
                <div class='timestamp'>${data.time}</div>
            </div>`;
    }
    
    feedback.innerHTML = '';
    output.innerHTML += message;
    output.scrollTop = output.scrollHeight - output.clientHeight;
});

socket.on('typing', data => {
    if(!data.length) feedback.innerHTML = data + " yazıyor...";
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}