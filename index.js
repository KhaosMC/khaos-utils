const Discord = require('discord.js');
const WebSocket = require('ws');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const websocketFiles = fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
console.log(`Loading ${commandFiles.length} command(s), ${eventFiles.length} event(s) and ${websocketFiles.length} websocket event(s).`);

const config = JSON.parse(fs.readFileSync('./config/config.json'));
const client = new Discord.Client();

