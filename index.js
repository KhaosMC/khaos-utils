const fs = require('fs');
const init = require('./modules/init.js');
const validate = require('./modules/validate.js');

async function initialize() {
	let bot = {
		fs: fs,
		dotenv: await init.env(),
		client: await init.discord(),
		logger: require('./modules/logger.js'),
		utils: require('./modules/utils.js'),
		config: await JSON.parse(fs.readFileSync('./config/config.json')),
                commandsConfig: await JSON.parse(fs.readFileSync('./config/commands.json')),
                tags: await JSON.parse(fs.readFileSync('./config/tags.json')),
		chatbridge: await JSON.parse(fs.readFileSync('./config/chatbridge.json'))
	};
	// Simple check to see if configs are valid, otherwise exit the process.
	if (await validate.run(bot)) process.exit();
	
	bot.db = await init.database(bot.commandsConfig);
	bot.socket = await init.websocket(bot.commandsConfig, bot.client, bot.chatbridge);

	bot.client.login(process.env.token);
	
	require('./modules/commandhandler.js')(bot);
	require('./modules/eventhandler')(bot);
	require('./modules/slashhandler.js')(bot)
	if (bot.commandsConfig.chatbridge) require('./modules/websockethandler')(bot);
}

initialize();
