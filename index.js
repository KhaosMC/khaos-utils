const Discord = require('discord.js');
const WebSocket = require('ws');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const websocketFiles = fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
console.log(`Loading ${commandFiles.length} command(s), ${eventFiles.length} event(s) and ${websocketFiles.length} websocket event(s).`);

const config = JSON.parse(fs.readFileSync('./config/config.json'));
const chatbridge = JSON.parse(fs.readFileSync('./config/chatbridge.json'));
const commandsConfig = JSON.parse(fs.readFileSync('./config/commands.json'));
const client = new Discord.Client();
if (commandsConfig.chatbridge) { var socket = new WebSocket(chatbridge.server_url) };

client.login(config.token);

var commands = new Map();
for (i = 0; i < commandFiles.length; i++) {
    commands.set(commandFiles[i].replace('.js', ''), require(`./commands/${commandFiles[i]}`));
}

var events = new Map();
for (i = 0; i < eventFiles.length; i++) {
    events.set(eventFiles[i].replace('.js', ''), require(`./events/${eventFiles[i]}`));
}

var websocketEvents = new Map();
for (i = 0; i < websocketFiles.length; i++) {
    websocketEvents.set(websocketFiles[i].replace('.js', ''), require(`./websocket/${websocketFiles[i]}`));
}

client.on('message', async message => {
    if (message.content.startsWith(config.prefix) && !(message.author.bot)) {
        const handler = require('./modules/commandhandler.js');
        handler(client, message, config, commands);
    }
})
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
