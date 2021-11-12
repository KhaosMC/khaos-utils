const fs = require('fs');
const log = require('./modules/logger');
const init = require('./modules/init.js');
const validate = require('./modules/validate.js');

async function initialize() {
	var bot = {
		fs: fs,
		dotenv: await init.env(),
		client: await init.discord(),
		config: await JSON.parse(fs.readFileSync('./config/config.json')),
                commandsConfig: await JSON.parse(fs.readFileSync('./config/commands.json')),
                tags: await JSON.parse(fs.readFileSync('./config/tags.json')),
		chatbridge: await JSON.parse(fs.readFileSync('./config/chatbridge.json')),
		bridge: require('./modules/requesthandler.js')
	};
	// Simple check to see if configs are valid, otherwise exit the process.
	// if (await validate.run(bot)) console.log("Validation failed!").then(process.exit());
	
	bot.db = await init.database(bot.commandsConfig);
	bot.socket = await init.websocket(bot.commandsConfig, bot.client, bot.chatbridge);

	bot.client.login(process.env.token);
	
	require('./modules/commandhandler.js')(bot);
	require('./modules/eventhandler')(bot);
	if (bot.commandsConfig.chatbridge) require('./modules/websockethandler')(bot);
}

initialize();
