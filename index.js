const Discord = require('discord.js');
const WebSocket = require('ws');
const fs = require('fs');
const log = require('./modules/logger')

const config = JSON.parse(fs.readFileSync('./config/config.json'));
const chatbridge = JSON.parse(fs.readFileSync('./config/chatbridge.json'));
const commandsConfig = JSON.parse(fs.readFileSync('./config/commands.json'));
const client = new Discord.Client();

let socket;
if (commandsConfig.chatbridge) { socket = new WebSocket(chatbridge.server_url) };

client.login(config.token);

require('./modules/commandhandler.js')(client, config, socket, fs, log);
require('./modules/eventhandler')(client, config, socket, fs, log);
if (commandsConfig.chatbridge) { require('./modules/websockethandler')(client, config, chatbridge, socket, fs, log) }
