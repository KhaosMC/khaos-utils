const { Client, Intents } = require('discord.js');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const dotenv = require('dotenv');

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
	intents.add(
        Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    );
	return new Client({intents: intents});
    },
    websocket: async function(commandsConfig, config, chatbridge) {
        if (!commandsConfig.chatbridge) return;
        return new WebSocket(process.env.chatbridgeUrl);
    },
    env: async function() {
        dotenv.config();
        return dotenv;
    }
}
