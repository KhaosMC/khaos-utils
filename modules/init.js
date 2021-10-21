const Discord = require('discord.js');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

module.exports = {
    database: async function(commandsConfig) {
	if (!commandsConfig.applications) return;
	const db = await sqlite.open({
		filename: './db/database.sqlite3',
		driver: sqlite3.Database
	});

        await db.run(`
        CREATE TABLE IF NOT EXISTS application_channels (
            channel_id TEXT PRIMARY KEY,
            user_id TEXT,
            message_id TEXT UNIQUE,
            open INTEGER DEFAULT 1
        );
        `);
	return db;
    },
    discord: async function() {
	const client = new Discord.Client({
    		intents: Discord.Intents.ALL,
    		partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	});
	return client;
    },
    websocket: async function(commandsConfig, config, chatbridge) {
        if (!commandsConfig.chatbridge) return;
        const socket = new WebSocket(chatbridge.server_url);
        return socket;
    }
}
