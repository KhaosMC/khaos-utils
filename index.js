const fs = require('fs');
const log = require('./modules/logger');
const init = require('./modules/init.js')

async function initialize() {
	const config = JSON.parse(fs.readFileSync('./config/config.json'));
	const chatbridge = JSON.parse(fs.readFileSync('./config/chatbridge.json'));
	const commandsConfig = JSON.parse(fs.readFileSync('./config/commands.json'));

	const db = await init.database(commandsConfig);
	const client = await init.discord();
	const socket = await init.websocket(commandsConfig, client, chatbridge);

	client.login(config.token);
	
	require('./modules/commandhandler.js')(client, config, socket, fs, log, commandsConfig, db);
	require('./modules/eventhandler')(client, config, socket, fs, log, db);
	if (commandsConfig.chatbridge) require('./modules/websockethandler')(client, config, chatbridge, socket, fs, log);
}

initialize();
