const { Client, Intents } = require('discord.js');
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
        const intents = new Intents();
	intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES);
	const client = new Client({
    		intents: intents
	});
	return client;
    },
    websocket: async function(commandsConfig, config, chatbridge) {
        if (!commandsConfig.chatbridge) return;
        const socket = new WebSocket(chatbridge.server_url);
        return socket;
    }
}
