const Discord = require('discord.js');
const WebSocket = require('ws');
const fs = require('fs');
const log = require('./modules/logger')

const websocketFiles = fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));

const config = JSON.parse(fs.readFileSync('./config/config.json'));
const chatbridge = JSON.parse(fs.readFileSync('./config/chatbridge.json'));
const commandsConfig = JSON.parse(fs.readFileSync('./config/commands.json'));
const client = new Discord.Client();

var socket;
if (commandsConfig.chatbridge) { socket = new WebSocket(chatbridge.server_url) };

client.login(config.token);

require('./modules/commandhandler.js')(client, config, socket, fs, log);
require('./modules/eventhandler')(client, config, socket, fs, log);
if (commandsConfig.chatbridge) { require('./modules/websockethandler')(client, config, chatbridge, fs, log) }

if (commandsConfig.chatbridge) {
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
    });
    
    socket.on('message', function(message) {
        const handler = require('./modules/websockethandler.js');
        handler(message, websocketEvents, chatbridge, client, config);
    })
}
