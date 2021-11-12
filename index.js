const fs = require('fs');
const log = require('./modules/logger');
const init = require('./modules/init.js')

async function initialize() {
	var bot = {
		fs: fs,
		client: await init.discord(),
		config: await JSON.parse(fs.readFileSync('./config/config.json')),
                commandsConfig: await JSON.parse(fs.readFileSync('./config/commands.json')),
		chatbridge: await JSON.parse(fs.readFileSync('./config/chatbridge.json'))
	};
	bot.db = await init.database(bot.commandsConfig);
	bot.socket = await init.websocket(bot.commandsConfig, bot.client, bot.chatbridge);

	bot.client.login(bot.config.token);
	
	require('./modules/commandhandler.js')(bot);
	require('./modules/eventhandler')(bot);
	if (bot.commandsConfig.chatbridge) require('./modules/websockethandler')(bot);
}

initialize();
