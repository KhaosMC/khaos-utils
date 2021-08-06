const Discord = require('discord.js');
const WebSocket = require('ws');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const websocketFiles = fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
console.log(`Loading ${commandFiles.length} command(s), ${eventFiles.length} event(s) and ${websocketFiles.length} websocket event(s).`);

const config = JSON.parse(fs.readFileSync('./config/config.json'));
const chatbridge = JSON.parse(fs.readFileSync('./config/chatbridge.json'));
const client = new Discord.Client();
// var socket = new WebSocket(chatbridge.server_url);

client.login(config.token);

var commands = [];
for (i = 0; i < commandFiles.length; i++) {
    commands.push(commandFiles[i].replace('.js', ''));
}

var events = [];
for (i = 0; i < eventFiles.length; i++) {
    events.push(eventFiles[i].replace('.js', ''));
}

var websocketEvents = [];
for (i = 0; i < websocketFiles.length; i++) {
    websocketEvents.push(websocketFiles[i].replace('.js', ''));
}

client.on('message', async message => {
    if (message.content.startsWith(config.prefix) && !(message.author.bot)) {
        const handler = require('./modules/commandhandler.js');
        handler(client, message, config, commands);
    }
})
/*
socket.on('connect', function() {
    const authData = {
        "type": "auth",
        "token": chatbridge.auth_token,
        "client": {
            "type": chatbridge.client_type,
            "name": chatbridge.client_name
        }
    }
    socket.send(JSON.stringify(authData));
}); */