const fs = require('fs');
const log = require('./modules/logger');
const init = require('./modules/init.js')
const dotenv = require('dotenv');

async function initialize() {
	var bot = {
		fs: fs,
		dotenv: dotenv,
		client: await init.discord(),
		config: await JSON.parse(fs.readFileSync('./config/config.json')),
                commandsConfig: await JSON.parse(fs.readFileSync('./config/commands.json')),
		chatbridge: await JSON.parse(fs.readFileSync('./config/chatbridge.json'))
	};
	bot.db = await init.database(bot.commandsConfig);
	bot.socket = await init.websocket(bot.commandsConfig, bot.client, bot.chatbridge);
	dotenv.config();

	bot.client.login(process.env.token);
	
	require('./modules/commandhandler.js')(bot);
	require('./modules/eventhandler')(bot);
	if (bot.commandsConfig.chatbridge) require('./modules/websockethandler')(bot);
}

initialize();
